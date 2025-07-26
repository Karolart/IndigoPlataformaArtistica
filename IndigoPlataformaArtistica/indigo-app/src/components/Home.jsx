import { Link } from "react-router-dom";
import categorias from "../data/categorias.json";
import "../styles/Home.css";
import clickSound from "../assets/click.mp3";
import IntroSound from "../assets/TiersenSound.mp3";
import indigoLogo from "../assets/Indigo_New_Logo.png";
import bannerGif from "../assets/bannerAnimado.gif"; // 👈 Importa el GIF
import { useRef, useState } from "react";

function Home() {
  const clickAudioRef = useRef(new Audio(clickSound));
  const audioRef = useRef(new Audio(IntroSound));
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    const audio = clickAudioRef.current;
    audio.volume = 0.3;
    audio.currentTime = 0;
    audio.play();
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    audio.volume = 0.4;
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="home-container">
      <div
        className="banner"
        style={{
          backgroundImage: isPlaying
            ? `url(${bannerGif})`
            : "linear-gradient(135deg, #1c1c1c, #3b3b3b)", // fondo por defecto
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <button
          onClick={toggleAudio}
          className="logo-button"
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <img src={indigoLogo} alt="Logo Indigo" className="banner-logo" />
        </button>
        <div className="banner-text">
          <h1>Indigo</h1>
          <h3>Plataforma Artística</h3>
        </div>
      </div>

      <div className="card-list">
        {categorias.map((categoria) => (
          <Link
            key={categoria.slug}
            to={`/categoria/${categoria.slug}`}
            className="card"
            onClick={handleClick}
          >
            <img src={categoria.portada} alt={categoria.nombre} />
            <h2>{categoria.nombre}</h2>
          </Link>
        ))}
      </div>

      <footer className="home-footer">
        <p>
          Creado por: <strong>Karol Díaz</strong> —{" "}
          <a
            href="https://www.linkedin.com/in/karolart/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Karolart90
          </a>
          <br />
          Para IndigoArtistico, ItagÜi, Antioquia, Colombia.
          <br />
          Todo el contenido de este sitio es creación original de la autora apoyada por la IA.
          <br />
          © {new Date().getFullYear()} — Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}

export default Home;
