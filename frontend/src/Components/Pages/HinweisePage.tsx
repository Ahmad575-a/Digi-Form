import React, { useEffect } from "react";

const HinweisePage: React.FC = () => {
  useEffect(() => {
    document.title = "DigiForm – Hinweise";
  }, []);

  return (
    <main className="info-page">
      <h1>Hinweise</h1>

      <img className="info-image" />

      <h3>Anmerkung für Lernende </h3>

      <p className="info-text">
        Die mit dieser Anwendung erhobenenen Daten erleichtern und beschleunigen
        die schulischen Abläufe. Bitte tragen auch Sie dazu bei, in dem Sie die
        erbetenen Angaben vollständig und richtig eintragen.
      </p>

      <h3>Betreiber dieser Anwendung </h3>

      <p className="info-text">
        Carl-Severing-Berufskolleg für Metall- und Elektrotechnik der Stadt
        Bielefeld Näheres können Sie dem Impressum entnehmen.
      </p>

      <h3>Rechtliche Bestimmungen </h3>
      <p className="info-text">
        Die Erhebung und Verarbeitung der erforderlichen Daten erfolgt im Rahmen
        der schulrechtlichen Bestimmungen unter Beachtung der
        datenschutzrechtlichen Regelungen.
      </p>
    </main>
  );
};

export default HinweisePage;
