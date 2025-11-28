# Lern-Periode 7
24.10. bis 19.12.2025

# Grob-Planung
Ich möchte für FinHub APi ein frontend erstellen.
Das frontend sollte alle Daten einer Aktie und ein Graph anzeigen (Day high, day low, current price, etc)
Dabei übe ich API calls mit JS.

24.10.2025
- [x] Arbeitspaket 1: Erstellen Sie mehrere Skizzen von Ihrem front end. Überlegen Sie sich auch, welche Elemente die Interaktion mit dem back end auslösen und wie sich die Oberfläche dadurch verändert. Bauen Sie auch Interaktionen ein, die keinen Aufruf der API benötigen, sondern sich im client bearbeiten lassen (sortieren, suchen etc.)
- [x] Arbeitspaket 2: Setzen Sie in HTML und CSS Ihren Entwurf auf rudimentäre Weise um.
- [x] Arbeitspaket 3: Schreiben Sie ersten JS-Code als proof of concept (bspw. Meldung bei Klick auf Knopf-Element)

Heute habe ich Chess multiplayer mit Alex versucht zu implementiere. Wir sind jetzt an dem Punkt wo das Programm im Code volständig implementiert sein sollte, aber es gibt noch ein paar Objektreferenzen, die nicht richtig funktionieren. Das, weil wir 2 Kontruktoren aufrufen, und jedes braucht die Instanzname des anderen.


31.10.2025
- [x] HTML CSS Header gleich wie bei Vincent
- [x] HTML: Bildschirm in drittel aufteilen, links Portfolioübersicht, mittel Graphen, rechts Übersicht populäre Aktien

Heute habe ich das Proof of Concept erstellt, es war nur ein simples Textbox wo man ein Stock-Symbol eingeben kann, und dann ein simpler Graph.
Ich ahbe festgestellt, dass finnhub nicht zuverlässig Daten sendet, also bin ich auf TwelveData umgestiegen, was schon gut funktioniert. Danach habe ich gemäss Skizze das Layout gemacht, mit statisches fake data, da ich noch herausfinden muss wie man alle Sachen aus dem API response holt und welche Rechnungen gemacht werden müssen

07.11.2025
- [x] Portfolio Kontostand rechnungs Funktion (acc value, cash, annual return)
- [x] Funktionen, um die Daten dynamisch anzuzeigen

# Zusammenfassung 01.11.2025
Heute habe ich fast alle Funktionen erstellt, die nötig sind um die portfolio-Seite von sachen zu haben. Das heisst: Variablen für Kontostand, Verfügbares Geld, Gewinnrate, funktionen um das alles zu berechnen, und Funktionen um die Variablen zu erstellen, die nacher als Listen angezeigt werden. Auch habe ich die Funktionen gemacht um diese anzuzeigen.

14.11.2025
- [ ] Funktion OpenTradeDialog: dieses muss mit HTML verschiedene Trade optionen grafisch darstellen, und dann all die ausgewählte Informationen als formattierte string speichern.
- [x] Funktion: saveDailyData: dieses muss die Veränderungen im Portfolio von Tag zu Tag aufnehmen, damit es im Graph angezeigt werden kann.
- [ ] Funktion RenderStock: sobald aus irgend eine Liste (egal welches im UI) ein Stock ausgewählt wird muss diese im unteren Graph angezeigt werden
      
Ich habe falsch eingeschätzt, was genau nötig wäre. Am wichtigsten ist es jetzt die Account history irgendwie zu speichern, damit forschritt auch angezeigt werden kann.
- [x] Funktion getHistory
- [x] Funktion CreateAccountHistory
- [x] Funktion populateAccountValueChart

# Zusammenfassung 14.11
Heute habe ich fast nur an portfolio.js gearbeitet, und dabei viele neue Funktionen erstellt und integriert. Jetzt funktioniert es richting undwerden alle Daten dynamisch angezeigt statt als placeholders, und der Kontoentwicklungs-Graph wird auch mit Kontostand-Daten mit Datum erstellt. Dazu hat es die Funktionen function saveDailyAccountValue(), function getValueHistory(), function getTradeHistory(), function createAccountHistory(), function PopulateAccountValueChart() gebraucht.


21.11.2025
- [x] Funktion OpenTradeDialog: dieses muss mit HTML verschiedene Trade optionen grafisch darstellen, und dann all die ausgewählte Informationen als formattierte string
- [x] Funktion RenderStock: sobald aus irgend eine Liste (egal welches im UI) ein Stock ausgewählt wird muss diese im unteren Graph angezeigt werden
- [x] API.js: populateStockOverview(), es sollte mit API Daten der Overview ganz rechts füllen.
- [x] Integration von mehrere JS Dateien (Portfolio.js macht nur alles portfolio related, es macht keine Stock API calls, das wird durch API.js gemacht)

Heute habe ich das OpenTradeDIalog erstellt und ui.js ausgebreitet. Auch konnte ich die Local Storage und Portfolio Graph testen, welche gut funktionieren. Ich habe jetzt semi funktionierendes JS für das Live Market Overview, da mein API key Probleme hat (es gibt manchmal 403/401 obwohl beides Form und limit rochtig sind)

28.11.2025
- [ ]  StonkSim UI gleich bei beides Vincent und mir
- [x]  Integration der JS Dateien mit js module (in UI.js wird eine Funktion von portfolio.js abgerufen, das funktioniert jetzt nicht)
- [x]  Testen von Buy/Sell aktionen (wird Betrag vom Konto abgeschrieben?)
- [ ]  Button "Crypto" mit Crypto Seite verlinken

Heute habe ich die Live-Market-Overview auf der rechte Seite implementiert und getestet. Es hat noch ein paar bugs, wie ZB nach jede refresh/reload verschwinden die Daten, aber endlich zeigt es die Stocks an. Ich habe mich dagegen entschieden die andere Seite von Vincent zu implentieren, da seines ein Backend hat und meines noch nicht solide genug ist um es "fertig" zu nennen

05.12.2025
- [ ] Funktionalität: Stock Auswählen und dann im unteren Graph anzeigen
- [ ] Logikfehler beim Live Market Overview fixen
- [ ] Button "Crypto" mit Crypto Seite verlinken
- [ ] StonkSim UI stil/Logo gleich bei beides Vincent und mir

