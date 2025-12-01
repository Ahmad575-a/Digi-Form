import React, { useEffect, useState } from "react";
import "./DatenschutzPage.css";

type Section = {
  id: string;
  title: string;
  content: React.ReactNode;
};

const sections: Section[] = [
  {
    id: "schulrecht",
    title: "Schulrecht",
    content: (
      <>
        <p>
          Schulen dürfen personenbezogene Daten auch ohne Zustimmung der
          Betroffenen verarbeiten, soweit ihnen dies zur Erfüllung ihrer
          Aufgaben durch eine Rechtsnorm gestattet wird.
        </p>
        <p>
          Für Schulen in Nordrhein-Westfalen sind in erster Linie folgende
          Bestimmungen relevant:
        </p>
        <ul>
          <li style={{ display: "list-item" }}>
            <a
              href="https://bass.schule.nrw/6043.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Schulgesetz (§§ 120 – 122)
            </a>
          </li>
          <li style={{ display: "list-item" }}>
            <a
              href="https://bass.schule.nrw/101.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              VO-DV I
            </a>{" "}
            mit{" "}
            <a
              href="https://bass.schule.nrw/101.htm#Anlage1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Anlagen
            </a>
          </li>
        </ul>
        <p>
          Ferner können zusätzliche Daten im Rahmen der allgemeinen
          datenschutzrechtlichen Vorschriften erhoben und verarbeitet werden.
        </p>
      </>
    ),
  },
  {
    id: "dsgvo",
    title: "DSGVO",
    content: (
      <>
        <p>
          Auch innerhalb von Schulen ist die{" "}
          <a
            href="https://www.bmjv.de/DE/themen/themen_node.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datenschutz-Grundverordnung
          </a>{" "}
          unmittelbar geltendes Recht. Die Erhebung und Speicherung von Daten
          durch diese App erfolgt zweckgebunden zur Durchführung des
          gesetzlichen Bildungsauftrags von Schulen. Eine darüber hinausgehende
          Nutzung oder Weitergabe von Daten darf nicht und wird nicht
          stattfinden. Die Speicherung erfolgt nur so lange wie nötig und so
          kurz wie möglich. Name und Vorname können dabei automatisiert aus
          einem vorhandenen Verzeichnisdienst übernommen werden, bei
          Schülerinnen und Schülern zusätzlich auch die Schülernummer und die
          Klassenzugehörigkeit. Der jeweils aktuell zu einer Person gespeicherte
          Datenbestand kann von dieser innerhalb der App selbst eingesehen
          werden.
        </p>
      </>
    ),
  },
  {
    id: "logging",
    title: "Logging",
    content: (
      <>
        <p>
          Bei der Nutzung dieser <em>App</em> werden in den <em>Logs</em> des
          eingesetzten Webservers folgende Daten erfasst:
        </p>

        <ul>
          <li>die IP-Adresse des anfragenden Rechners,</li>
          <li>das Datum und die Uhrzeit der Anfrage,</li>
          <li>unter Umständen die übertragene Datenmenge,</li>
          <li>
            die Adresse der direkt zuvor aufgerufenen Webseite{" "}
            <em>(Referer)</em>
          </li>
          <li>sowie Browsertyp, Browserversion und Betriebssystem.</li>
        </ul>

        <p>
          Diese Daten werden ausschließlich zur Problemanalyse bei technischen
          Störungen und zur Aufklärung einer missbräuchlichen Nutzung dieser{" "}
          <em>WebApp</em> verwendet. Rechtsgrundlage für die Verarbeitung sind
          berechtigte Interessen gemäß Art. 6 Abs. 1 UAbs. 1 Buchstabe f) DSGVO.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <>
        <p>
          Diese App verwendet beim Anmeldeverfahren einen technisch notwendigen
          Session-Cookie, welcher automatisch wieder gelöscht wird, so bald die
          Browsersitzung endet. Eine ausdrückliche Zustimmung zur Verwendung des
          Cookies ist nicht erforderlich.
        </p>
      </>
    ),
  },
];

const DatenschutzPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>("schulrecht");

  useEffect(() => {
    document.title = "DigiForm – Datenschutz";
  }, []);

  const toggleSection = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <main className="ds-page">
      <h1 className="ds-title">Datenschutz-Infos</h1>

      <div className="ds-accordion">
        {sections.map((section) => {
          const isOpen = section.id === openId;

          return (
            <section key={section.id} className="ds-section">
              <button
                type="button"
                className={`ds-section-header ${isOpen ? "open" : ""}`}
                onClick={() => toggleSection(section.id)}
              >
                <span className="ds-section-marker" />
                <span className="ds-section-title">{section.title}</span>
                <span className="ds-section-icon">{isOpen ? "▴" : "▾"}</span>
              </button>

              {isOpen && (
                <div className="ds-section-body">{section.content}</div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
};

export default DatenschutzPage;
