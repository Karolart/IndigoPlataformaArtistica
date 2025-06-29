import { useParams, Link } from "react-router-dom";
import negocios from "../data/negocios.json";
import "../styles/Categoria.css";

function Categoria() {
  const { categoriaSlug } = useParams();

  // Filtra negocios por categoría
  const negociosFiltrados = Object.entries(negocios)
    .filter(([_, negocio]) => negocio.categoria === categoriaSlug)
    .map(([slug, negocio]) => ({ slug, ...negocio }));

  return (
    <div className="categoria-container">
      <h1>{categoriaSlug.toUpperCase()}</h1>
      <div className="card-list">
        {negociosFiltrados.map((negocio) => (
          <Link key={negocio.slug} to={`/negocio/${negocio.slug}`} className="card">
            <img src={negocio.logo} alt={negocio.nombre} />
            <h3>{negocio.nombre}</h3>
            <p>{negocio.descripcion}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Categoria;
