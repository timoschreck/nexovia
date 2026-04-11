# Nexovia Landingpage & Funnel

Dieses Repository enthält eine Landingpage zur Leadgenerierung für Photovoltaik und Wärmepumpen sowie ein einfaches Node.js/Express-Backend zum Speichern der Leads.

## Verwendung

### Landingpage

Die Datei `landing_page.html` ist eine eigenständige Seite mit einem mehrstufigen Formular (Funnel), das interessierte Nutzer abfragt. Die Formulardaten werden beim Abschluss an das Backend gesendet.

### Backend

`server.js` implementiert einen Express‑Server, der statische Dateien bedient und unter `/api/leads` POST‑Anfragen entgegennimmt. Die Daten werden in `leads.json` gespeichert.

### E-Mail-Benachrichtigungen

Optional kann der Server einen Hinweis per E‑Mail versenden, sobald ein neuer Lead eingeht. Dazu wird die Bibliothek **nodemailer** verwendet. Damit dies funktioniert, müssen gültige SMTP‑Zugangsdaten über Umgebungsvariablen bereitgestellt werden:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` – Zugangsdaten Ihres E‑Mail‑Servers
- `SMTP_SECURE` – `true` falls eine verschlüsselte Verbindung (z. B. Port 465) genutzt wird, sonst `false` oder leer
- `SMTP_FROM` – Absenderadresse für die E‑Mails (optional; falls nicht gesetzt, wird `SMTP_USER` verwendet)
- `ADMIN_EMAIL` – Zieladresse, an die der Lead geschickt wird

Wenn diese Variablen gesetzt sind, versendet der POST‑Endpunkt automatisch eine E‑Mail mit den Lead‑Daten, nachdem sie gespeichert wurden.

Um **nodemailer** zu installieren, führen Sie vor dem Start des Servers aus:

```bash
npm install express nodemailer
```

### Leads abrufen und verwalten

Es gibt eine einfache Administrationsseite (`admin.html`), über die alle gespeicherten Leads eingesehen, exportiert und gelöscht werden können. Der Server stellt dafür folgende Endpunkte bereit:

* `GET /api/leads` – Gibt eine JSON‑Liste aller Leads zurück. Aus Sicherheitsgründen muss im Header `X-Admin-Token` ein geheimes Token mitgesendet werden. Standardmäßig ist das Token in `server.js` auf `secret` gesetzt; in einer produktiven Umgebung sollte es über die Umgebungsvariable `ADMIN_TOKEN` überschrieben werden.
* `GET /api/leads/csv` – Liefert die gleiche Datenmenge als CSV‑Datei. Die Spalten umfassen Name, E‑Mail, Telefon, Immobilientyp, Dach- oder Grundstücksfläche, Baujahr, Heizsystem und Zeitstempel.
* `DELETE /api/leads` – Entfernt alle Leads aus der Speicherdatei. Auch hierfür ist der Admin‑Token erforderlich.

Die Administrationsseite sendet beim Laden automatisch eine Anfrage mit dem Token und zeigt die Leads in einer Tabelle an. Neben einem Button „CSV exportieren“ gibt es auch einen Button „Leads löschen“, der alle Einträge nach einer Sicherheitsabfrage entfernt. Um die Seite zu verwenden, öffne `admin.html` im Browser (z. B. unter `http://localhost:3000/admin.html`, wenn der Server ausgeführt wird).

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
