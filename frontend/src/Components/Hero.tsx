<<<<<<< Updated upstream
import React from "react";
=======
import React, { useEffect } from "react";
>>>>>>> Stashed changes
import "./Hero.css";
import heroImage from "../assets/heroImage.jpg";
import LiquidEther from "./LiquidEther";

const Hero: React.FC = () => {
  return (
    <section className="hero-section">
<<<<<<< Updated upstream
      <div className="hero-inner">

        <img src={heroImage} alt="Hero" className="hero-image" />
=======
      <LiquidEther>
        <div className="hero-inner">
          <img src={heroImage} alt="Hero" className="hero-image" />
>>>>>>> Stashed changes

          <div className="hero-text">
            <h1>Digitale Formulare online verwalten</h1>
            <p>
              Alle Dokumente und Formulare an einem Ort – einfach einsehen,
              herunterladen und digital unterschreiben.
            </p>
          </div>
        </div>
<<<<<<< Updated upstream

      </div>
=======
      </LiquidEther>
>>>>>>> Stashed changes
    </section>
  );
};

export default Hero;
