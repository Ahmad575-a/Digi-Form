import React from "react";
import { useEffect } from "react";
import "./Hero.css";
import heroImage from "../assets/heroImage.jpg";

const Hero: React.FC = () => {

  useEffect(() => {
  document.title = "DigiForm – Home";
}, []);

  return (
    <section className="hero-section">
      <div className="hero-inner">

        <img src={heroImage} alt="Hero" className="hero-image" />

        <div className="hero-text">
          <h1>Digitale Formulare online verwalten</h1>
          <p>
            Alle Dokumente und Formulare an einem Ort – einfach einsehen,
            herunterladen und digital unterschreiben.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Hero;
