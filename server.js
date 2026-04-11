const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { Parser } = require('json2csv');

const app = express();
const PORT = process.env.PORT || 3000;
const LEADS_FILE = path.join(__dirname, 'leads.json');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'secret';

// reCAPTCHA secret for server-side validation
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

// Setup nodemailer transporter using SMTP environment variables
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM;
const adminEmail = process.env.ADMIN_EMAIL;

let transporter = null;
if (smtpHost && smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort || 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });
}

app.use(bodyParser.json());

// Helper: verify Google reCAPTCHA token
async function verifyRecaptcha(token) {
  // Skip verification if no secret is configured
  if (!RECAPTCHA_SECRET) return true;
  const https = require('https');
  const params = new URLSearchParams({
    secret: RECAPTCHA_SECRET,
    response: token
  }).toString();
  const url = `https://www.google.com/recaptcha/api/siteverify?${params}`;
  return new Promise((resolve) => {
    https.get(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => (data += chunk));
      resp.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.success === true);
        } catch {
          resolve(false);
        }
      });
    }).on('error', () => resolve(false));
  });
}

// Helper: read leads from file
async function readLeads() {
  try {
    const data = await fs.readFile(LEADS_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    // if file does not exist or invalid, return empty array
    return [];
  }
}

// Helper: write leads to file
async function writeLeads(leads) {
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));
}

// POST: Save new lead
app.post('/api/leads', async (req, res) => {
  const lead = req.body;
  lead.timestamp = new Date().toISOString();
  try {
    // Verify reCAPTCHA if token is provided
    const token = lead.recaptchaToken;
    const recaptchaValid = await verifyRecaptcha(token);
    if (!recaptchaValid) {
      return res.status(400).json({ error: 'Ungültiger Captcha-Token' });
    }
    // Basic validation: ensure required fields are present
    if (!lead.name || typeof lead.name !== 'string' || !lead.name.trim()) {
      return res.status(400).json({ error: 'Name ist erforderlich' });
    }
    if (!lead.email || typeof lead.email !== 'string' || !lead.email.includes('@')) {
      return res.status(400).json({ error: 'Gültige E-Mail ist erforderlich' });
    }
    // Remove token before saving
    delete lead.recaptchaToken;
    const leads = await readLeads();
    leads.push(lead);
    await writeLeads(leads);
    // send email notification if transporter is configured
    if (transporter && adminEmail) {
      await transporter.sendMail({
        from: smtpFrom || smtpUser,
        to: adminEmail,
        subject: 'Neuer Lead eingegangen',
        text: `Es wurde ein neuer Lead generiert.\n\nDetails:\n${JSON.stringify(lead, null, 2)}`
      });
    }
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Fehler beim Speichern des Leads' });
  }
});

// Middleware: verify admin token
function verifyAdmin(req, res, next) {
  const token = req.header('X-Admin-Token');
  if (token === ADMIN_TOKEN) {
    return next();
  } else {
    return res.status(401).json({ error: 'Ungültiger Token' });
  }
}

// GET: return all leads (JSON)
app.get('/api/leads', verifyAdmin, async (req, res) => {
  const leads = await readLeads();
  res.json(leads);
});

// GET: return leads as CSV
app.get('/api/leads/csv', verifyAdmin, async (req, res) => {
  const leads = await readLeads();
  const parser = new Parser();
  const csv = parser.parse(leads);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.send(csv);
});

// DELETE: remove all leads
app.delete('/api/leads', verifyAdmin, async (req, res) => {
  await writeLeads([]);
  res.json({ success: true });
});

// Serve static files (landing page & admin)
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
