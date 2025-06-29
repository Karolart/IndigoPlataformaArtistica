import { useParams } from 'react-router-dom';
import negocios from '../data/negocios.json';
import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker?worker';
import '../styles/negocio.css'; // Asegúrate de que esta ruta esté bien



// Iconos importados desde src/assets
import whatsappIcon from '../assets/whatsapp.png';
import instagramIcon from '../assets/instagram.png';
import pdfIcon from '../assets/pdf.png';

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfWorker();

function Negocio() {
  const { slug } = useParams();
  const negocio = negocios[slug];
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    if (!negocio?.pdf) return;

    let cancelled = false;

    const fetchPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(negocio.pdf);
        const pdf = await loadingTask.promise;
        if (!cancelled) setPdfDoc(pdf);
      } catch (error) {
        console.error("Error al cargar el PDF:", error);
      }
    };

    fetchPDF();
    return () => { cancelled = true; };
  }, [negocio]);

  useEffect(() => {
    if (!pdfDoc) return;

    let renderTask = null;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const scale = 1.0;
        const viewport = page.getViewport({ scale, rotation: page.rotate });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;
      } catch (error) {
        if (error?.name !== 'RenderingCancelledException') {
          console.error("Error al renderizar la página:", error);
        }
      }
    };

    renderPage();

    return () => {
      if (renderTask) renderTask.cancel();
    };
  }, [pdfDoc, pageNum]);

  if (!negocio) return <h2>Negocio no encontrado</h2>;

  return (
    <div className="negocio-container">
      <img src={negocio.logo} alt={negocio.nombre} className="negocio-logo" />
      <h1>{negocio.nombre}</h1>

      <div className="pdf-viewer">
        <canvas ref={canvasRef}></canvas>
        <div className="nav-buttons">
          <button
            onClick={() => setPageNum((prev) => Math.max(prev - 1, 1))}
            className="hand-btn"
          >
            👈
          </button>
          <button
            onClick={() =>
              setPageNum((prev) => Math.min(prev + 1, pdfDoc?.numPages || 1))
            }
            className="hand-btn"
          >
            👉
          </button>
        </div>
      </div>

      <div className="botones-contacto">
        <a href={negocio.whatsapp} target="_blank" rel="noopener noreferrer">
          <div className="boton-contenido">
            <img src={whatsappIcon} alt="WhatsApp" className="icono-boton" />
            <span>WhatsApp</span>
          </div>
        </a>
        <a href={negocio.instagram} target="_blank" rel="noopener noreferrer">
          <div className="boton-contenido">
            <img src={instagramIcon} alt="Instagram" className="icono-boton" />
            <span>Instagram</span>
          </div>
        </a>
        <a href={negocio.pdf} download>
          <div className="boton-contenido">
            <img src={pdfIcon} alt="PDF" className="icono-boton" />
            <span>Catálogo</span>
          </div>
        </a>
      </div>
    </div>
  );
}

export default Negocio;
