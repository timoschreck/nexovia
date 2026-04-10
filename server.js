const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
    res.status(200).json({ message: 'Lead gespeichert.' });
  } catch (err) {
    console.error('Fehler beim Schreiben der leads.json:', err);
    res.status(500).json({ error: 'Lead konnte nicht gespeichert werden.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
