# Lern-Periode 7
24.10. bis 19.12.2025

# Grob-Planung
Ich möchte für FinHub APi ein frontend erstellen.
Das frontend sollte alle Daten einer Aktie und ein Graph anzeigen (Day high, day low, current price, etc)
Dabei übe ich API calls mit JS.

24.10.
- [x] Arbeitspaket 1: Erstellen Sie mehrere Skizzen von Ihrem front end. Überlegen Sie sich auch, welche Elemente die Interaktion mit dem back end auslösen und wie sich die Oberfläche dadurch verändert. Bauen Sie auch Interaktionen ein, die keinen Aufruf der API benötigen, sondern sich im client bearbeiten lassen (sortieren, suchen etc.)
- [x] Arbeitspaket 2: Setzen Sie in HTML und CSS Ihren Entwurf auf rudimentäre Weise um.
- [x] Arbeitspaket 3: Schreiben Sie ersten JS-Code als proof of concept (bspw. Meldung bei Klick auf Knopf-Element)

Heute habe ich Chess multiplayer mit Alex versucht zu implementiere. Wir sind jetzt an dem Punkt wo das Programm im Code volständig implementiert sein sollte, aber es gibt noch ein paar Objektreferenzen, die nicht richtig funktionieren. Das, weil wir 2 Kontruktoren aufrufen, und jedes braucht die Instanzname des anderen.


31.10.
- [x] HTML CSS Header gleich wie bei Vincent
- [x] HTML: Bildschirm in drittel aufteilen, links Portfolioübersicht, mittel Graphen, rechts Übersicht populäre Aktien

Heute habe ich das Proof of Concept erstellt, es war nur ein simples Textbox wo man ein Stock-Symbol eingeben kann, und dann ein simpler Graph.
Ich ahbe festgestellt, dass finnhub nicht zuverlässig Daten sendet, also bin ich auf TwelveData umgestiegen, was schon gut funktioniert. Danach habe ich gemäss Skizze das Layout gemacht, mit statisches fake data, da ich noch herausfinden muss wie man alle Sachen aus dem API response holt und welche Rechnungen gemacht werden müssen

07.11.
- [ ] Alle Daten dynamisch gemäss API (im JS die placeholder Daten ersetzen und mit API return)
- [ ] Buttons interaktiv machen (highlights, events schon registrieren, nicht unbedingt dass sie etwas machen)
- [ ] Kontostandrechnung (wenn ich Stock kaufe für 100 dann Rechnung minus 100)
