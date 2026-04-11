# Nexovia Projekt – Landing Page mit Funnel und Backend

Diese Repository enthält eine produktionsreife Landingpage zur Lead‑Generierung im Bereich Photovoltaik und Wärmepumpen. Die Lösung besteht aus einem statischen Frontend (`landing_page.html`), einem einfachen Node.js‑/Express‑Backend (`server.js`) zur Speicherung von Leads und E‑Mail‑Benachrichtigung, sowie einer Administrationsoberfläche (`admin.html`).

## Features

- **Dynamischer Funnel:** Die Landingpage fragt im ersten Schritt ab, ob sich der Interessent für PV, Wärmepumpe oder beides interessiert. Abhängig von dieser Auswahl werden im nächsten Schritt nur die relevanten Felder (z. B. Dachfläche, Baujahr, Heizsystem) angezeigt. Eine Fortschrittsanzeige zeigt „Schritt X von 4“ und verbessert die Orientierung.
- **Heizsystem‑Feld:** Für Wärmepumpen steht ein Dropdown mit typischen Heizsystemen zur Verfügung (Radiatoren, Fußbodenheizung etc.).
- **Trust‑Elemente & Conversion‑Optimierung:** Über der Seite wurde eine neue Headline eingebaut („Bis zu 60 % Energiekosten sparen …“). Darunter werden Trust‑Badges mit Bewertung, Kundenzahl und Hinweis auf kostenlose Beratung angezeigt. Das Telefonnummernfeld im Funnel ist optional.
- **Lead‑Speicherung & Benachrichtigung:** Das Backend (`server.js`) speichert Leads in der Datei `leads.json` und verschickt per Nodemailer eine E‑Mail an die in `ADMIN_EMAIL` angegebene Adresse. SMTP‑Zugangsdaten müssen als Umgebungsvariablen (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `ADMIN_EMAIL`, `SMTP_FROM`) gesetzt werden.
- **Admin‑Dashboard:** Die `admin.html` zeigt alle Leads in einer Tabelle an (inkl. Heizsystem), ermöglicht den Export als CSV und das Löschen aller Leads. Der Zugriff erfolgt über einen Token (`ADMIN_TOKEN`), der per HTTP‑Header `X‑Admin‑Token` übermittelt wird.
- **CSV‑Export & Delete‑Endpoint:** Das Backend bietet einen `GET /api/leads/csv` zur CSV‑Ausgabe und einen `DELETE /api/leads` zur Löschung. Beide Endpunkte erfordern den Admin‑Token.
- **Tracking‑Setup:** Im `<head>` sind Google Analytics 4 (GA4) und der Meta Pixel eingebunden. Nach dem Absenden eines Leads wird ein GA‑Event `lead_submitted` und ein Pixel‑Event `Lead` ausgelöst. Ersetze die Platzhalter `G‑XXXXXXXXXX` und `DEINE_PIXEL_ID` durch deine echten IDs.
- **Spam‑Schutz mit reCAPTCHA:** In Schritt 3 des Funnels ist ein Google‑reCAPTCHA‑Widget integriert. Vor dem Absenden eines Leads muss das Captcha bestätigt werden. Auf Serverseite wird der Token mit dem Secret‑Key `RECAPTCHA_SECRET` verifiziert. Die Keys musst du bei [Google reCAPTCHA](https://www.google.com/recaptcha/about/) erstellen und in der `.env`/Render‑Konfiguration hinterlegen (Site‑Key im HTML, Secret‑Key als Umgebungsvariable `RECAPTCHA_SECRET`).

## Deployment

1. **Hosting:** Das Backend lässt sich z. B. auf [Render.com](https://render.com/) deployen:
   - Repository mit Render verbinden.
   - Neuen Web Service anlegen.
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Umgebungsvariablen einrichten: `ADMIN_TOKEN`, `SMTP_*`, `ADMIN_EMAIL`, `SMTP_FROM`, `PORT`.

2. **Frontend:** Nach dem Deployment muss in der `landing_page.html` der `fetch`‑Aufruf in der Funktion `submitLeadAndClose()` auf die Produktions‑URL angepasst werden (z. B. `https://dein-backend.onrender.com/api/leads`).

3. **Analytics:** Trage in der Datei `landing_page.html` deine GA4 Measurement ID (`G-XXXXXXXXXX`) und deine Meta‑Pixel‑ID (`DEINE_PIXEL_ID`) ein. Prüfe im GA4‑Event‑Manager, ob das Event `lead_submitted` eingeht, und im Meta‑Pixel‑Dashboard, ob das Event `Lead` registriert wird.

4. **reCAPTCHA konfigurieren:** Registriere deine Domain bei Google reCAPTCHA (Version 2 „Ich bin kein Roboter“) und trage den erhaltenen Site‑Key in `landing_page.html` im Attribut `data-sitekey` der `g-recaptcha`‑Div ein. Den Secret‑Key hinterlegst du im Render‑Dashboard als Umgebungsvariable `RECAPTCHA_SECRET`, damit die serverseitige Verifizierung funktioniert.

## render.yaml

Im Repository befindet sich eine Beispielkonfigurationsdatei `render.yaml`, die die Einstellungen für Render beschreibt (Build‑ & Start‑Befehle sowie Umgebungsvariablen wie Tokens, SMTP‑Daten und reCAPTCHA‑Secret). Diese Datei kann beim Einrichten eines neuen Web‑Services hochgeladen oder als Vorlage genutzt werden. Passe die Werte an deine tatsächlichen Credentials an.

## Weiterentwicklung

- **Lead‑Validierung:** Für eine höhere Datenqualität können Pflichtfelder mit JavaScript validiert werden (z. B. korrekte E‑Mail‑Adresse) und Spam‑Schutz (reCAPTCHA) hinzugefügt werden.
- **A/B‑Testing & Optimierung:** Die Copy und der Funnel können mithilfe von A/B‑Tests optimiert werden (z. B. Variation der Headline, weniger Felder pro Schritt). Zudem empfiehlt es sich, Ladezeiten zu optimieren und responsive Design weiter zu verbessern.
- **CRM‑Anbindung:** Die Leads können per API an ein CRM übertragen oder per Webhook an externe Dienste weitergeleitet werden.

Diese README erläutert die aktuelle Architektur und den Einsatz der Komponenten. Änderungen an der Datei können in zukünftigen Commits ergänzt werden.
