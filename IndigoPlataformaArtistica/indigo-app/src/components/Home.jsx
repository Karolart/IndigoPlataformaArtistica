import { Link } from "react-router-dom";
import categorias from "../data/categorias.json";
import "../styles/Home.css";
import clickSound from "../assets/click.mp3";
import { useRef } from "react";

function Home() {
  const clickAudioRef = useRef(new Audio(clickSound));

  const handleClick = () => {
    const audio = clickAudioRef.current;
    audio.volume = 0.3;
    audio.currentTime = 0;
    audio.play();
  };

  return (
    <div className="home-container">
      <div className="banner">
        <h1>Indigo-:-Plataforma artística</h1>
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

      {/* Footer personalizado */}
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
