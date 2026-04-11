# Nexovia Landingpage & Funnel

Dieses Repository enthält eine Landingpage zur Leadgenerierung für Photovoltaik und Wärmepumpen sowie ein einfaches Node.js/Express-Backend zum Speichern der Leads.

## Verwendung

### Landingpage

Die Datei `landing_page.html` ist eine eigenständige Seite mit einem mehrstufigen Formular (Funnel), das interessierte Nutzer abfragt. Die Formulardaten werden beim Abschluss an das Backend gesendet.

### Backend

`server.js` implementiert einen Express‑Server, der statische Dateien bedient und unter `/api/leads` POST‑Anfragen entgegennimmt. Die Daten werden in `leads.json` gespeichert.

### Leads abrufen und verwalten

Es gibt eine einfache Administrationsseite (`admin.html`), über die alle gespeicherten Leads eingesehen werden können. Der Server stellt dafür den Endpunkt `/api/leads` bereit, der eine JSON‑Liste der Leads zurückgibt. Aus Sicherheitsgründen verlangt dieser Endpunkt einen Header `X-Admin-Token` mit einem geheimen Token. Standardmäßig ist das Token in `server.js` auf `secret` gesetzt; in einer produktiven Umgebung sollte es über die Umgebungsvariable `ADMIN_TOKEN` überschrieben werden.

Die Administrationsseite sendet beim Laden automatisch eine Anfrage mit dem Token und zeigt die Leads in einer Tabelle an. Um die Seite zu verwenden, öffne `admin.html` im Browser (z. B. unter `http://localhost:3000/admin.html` wenn der Server ausgeführt wird).

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
