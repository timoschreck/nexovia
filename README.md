# Nexovia Landingpage & Funnel

Dieses Repository enthält eine Landingpage zur Leadgenerierung für Photovoltaik und Wärmepumpen sowie ein einfaches Node.js/Express-Backend zum Speichern der Leads.

## Verwendung

### Landingpage

Die Datei `landing_page.html` ist eine eigenständige Seite mit einem mehrstufigen Formular (Funnel), das interessierte Nutzer abfragt. Die Formulardaten werden beim Abschluss an das Backend gesendet.

### Backend

`server.js` implementiert einen Express‑Server, der statische Dateien bedient und unter `/api/leads` POST‑Anfragen entgegennimmt. Die Daten werden in `leads.json` gespeichert.

Um den Server lokal auszuführen:

1. Stelle sicher, dass Node.js installiert ist.
2. Installiere die Abhängigkeiten:
   ```bash
   npm install
   ```
3. Starte den Server:
   ```bash
   npm start
   ```
4. Öffne anschließend die Landingpage im Browser (`landing_page.html`), oder navigiere zu `http://localhost:3000/landing_page.html`, falls diese im Server‑Verzeichnis liegt.

## Deployment

Die Dateien können auf jedem statischen Hostingdienst bereitgestellt werden. Das Backend muss separat gehostet werden, z. B. als Node.js‑Anwendung.
