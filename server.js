const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const nodemailer = require('nodemailer');

// Configure nodemailer transporter if SMTP credentials are provided
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: (process.env.SMTP_USER && process.env.SMTP_PASS)
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined
});

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from public directory (the root of the repository)
app.use(express.static(path.join(__dirname)));

// Endpoint to handle lead submissions
app.post('/api/leads', (req, res) => {
  const lead = req.body;

  if (!lead || Object.keys(lead).length === 0) {
    return res.status(400).json({ error: 'Leaddaten fehlen.' });
  }

  // Append lead to leads.json file
  const leadsFile = path.join(__dirname, 'leads.json');
  let leads = [];

  // Read existing leads
  try {
    if (fs.existsSync(leadsFile)) {
      const data = fs.readFileSync(leadsFile, 'utf8');
      if (data) {
        leads = JSON.parse(data);
      }
    }
  } catch (err) {
    console.error('Fehler beim Lesen der leads.json:', err);
  }

  // Add new lead
  leads.push({ ...lead, timestamp: new Date().toISOString() });

  // Write updated leads array back to file
  try {
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));

    // Send notification email if SMTP and admin settings are provided
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: adminEmail,
        subject: 'Neuer Lead eingegangen',
        text: `Es wurde ein neuer Lead generiert:\n${JSON.stringify(lead, null, 2)}`
      };
      transporter.sendMail(mailOptions).catch(err => {
        console.error('Fehler beim Senden der E-Mail:', err);
      });
    }

    res.status(200).json({ message: 'Lead gespeichert.' });
  } catch (err) {
    console.error('Fehler beim Schreiben der leads.json:', err);
    res.status(500).json({ error: 'Lead konnte nicht gespeichert werden.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

// Endpoint to fetch leads (requires admin token)
app.get('/api/leads', (req, res) => {
  // Simple token check via custom header
  const token = req.headers['x-admin-token'];
  const adminToken = process.env.ADMIN_TOKEN || 'secret';
  if (token !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const leadsFile = path.join(__dirname, 'leads.json');
  try {
    if (fs.existsSync(leadsFile)) {
      const data = fs.readFileSync(leadsFile, 'utf8');
      const leads = data ? JSON.parse(data) : [];
      return res.status(200).json(leads);
    } else {
      return res.status(200).json([]);
    }
  } catch (err) {
    console.error('Fehler beim Lesen der leads.json:', err);
    return res.status(500).json({ error: 'Leads konnten nicht geladen werden.' });
  }
});
