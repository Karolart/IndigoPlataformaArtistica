import { useParams } from 'react-router-dom';
import negocios from '../data/negocios.json';
import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker?worker';
import '../styles/negocio.css';

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
  const [transitionClass, setTransitionClass] = useState('');

  useEffect(() => {
    if (!negocio?.pdf) return;

    let cancelled = false;

    const fetchPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(negocio.pdf);
        const pdf = await loadingTask.promise;

        if (!cancelled) {
          setPdfDoc(pdf);

          const savedPage = Number(localStorage.getItem(`lastPage_${slug}`));
          if (savedPage && !isNaN(savedPage) && savedPage >= 1 && savedPage <= pdf.numPages) {
            setPageNum(savedPage);
          } else {
            setPageNum(1);
          }

          const handleBeforeUnload = () => {
            localStorage.removeItem(`lastPage_${slug}`);
          };
          window.addEventListener("beforeunload", handleBeforeUnload);

          // Clean up event
          return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
          };
        }
      } catch (error) {
        console.error("Error al cargar el PDF:", error);
      }
    };

    fetchPDF();
    return () => { cancelled = true; };
  }, [negocio, slug]);

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

  const handlePageChange = (direction) => {
    if (!pdfDoc) return;

    if (direction === "prev" && pageNum > 1) {
      setTransitionClass("canvas-slide-right");
      setTimeout(() => {
        setPageNum((prev) => {
          const newPage = prev - 1;
          localStorage.setItem(`lastPage_${slug}`, newPage);
          return newPage;
        });
        setTransitionClass("");
      }, 150);
    } else if (direction === "next" && pageNum < pdfDoc.numPages) {
      setTransitionClass("canvas-slide-left");
      setTimeout(() => {
        setPageNum((prev) => {
          const newPage = prev + 1;
          localStorage.setItem(`lastPage_${slug}`, newPage);
          return newPage;
        });
        setTransitionClass("");
      }, 150);
    }
  };

  // Swipe para móviles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let startX = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - startX;

      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          handlePageChange("prev");
        } else {
          handlePageChange("next");
        }
      }
    };

    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pdfDoc, pageNum]);

  if (!negocio) return <h2>Negocio no encontrado</h2>;

  return (
    <div className="negocio-container">
      <img src={negocio.logo} alt={negocio.nombre} className="negocio-logo" />
      <h1>{negocio.nombre}</h1>

      <div className="pdf-viewer">
        <canvas ref={canvasRef} className={transitionClass}></canvas>

        <div className="page-controls">
          <div className="nav-buttons">
            <button onClick={() => handlePageChange("prev")} className="hand-btn">👈</button>
            <button onClick={() => handlePageChange("next")} className="hand-btn">👉</button>
          </div>

          <div className="page-indicator">
            Página {pageNum} de {pdfDoc?.numPages || "?"}
          </div>

          <input
            type="range"
            min="1"
            max={pdfDoc?.numPages || 1}
            value={pageNum}
            onChange={(e) => {
              const newPage = Number(e.target.value);
              setPageNum(newPage);
              localStorage.setItem(`lastPage_${slug}`, newPage);
            }}
            className="page-slider"
          />
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
