import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listPublicComments } from "../php/api";
import "../assets/css/comentarios.css";

const API_BASE = (import.meta.env.VITE_API_BASE || '/api').replace('/api', '');

/* Lightbox en “modal” estilo Bootstrap (sin JS de Bootstrap) */
function ModalLightbox({ urls = [], start = 0, onClose }) {
  const [i, setI] = useState(start || 0);
  if (!urls.length) return null;

  const prev = (e) => { e.stopPropagation(); setI((p) => (p - 1 + urls.length) % urls.length); };
  const next = (e) => { e.stopPropagation(); setI((p) => (p + 1) % urls.length); };

  return (
    <>
      <div className="modal-backdrop show" onClick={onClose} />
      <div className="modal show d-block" tabIndex="-1" onClick={onClose} style={{ background: "rgba(0,0,0,.3)" }}>
        <div className="modal-dialog modal-dialog-centered modal-xl" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Imagen {i + 1}/{urls.length}</h5>
              <button className="btn-close" onClick={onClose} aria-label="Cerrar" />
            </div>
            <div className="modal-body text-center">
              <img src={urls[i]} alt="" className="img-fluid" />
            </div>
            {urls.length > 1 && (
              <div className="modal-footer justify-content-between">
                <button className="btn btn-outline-secondary" onClick={prev}>‹ Anterior</button>
                <button className="btn btn-primary" onClick={next}>Siguiente ›</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Stars({ n = 0 }) {
  const on = "★".repeat(n);
  const off = "☆".repeat(5 - n);
  return <span className="mh-stars" aria-label={`${n} de 5`}>{on}{off}</span>;
}

export default function Comentarios() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Lightbox
  const [lbOpen, setLbOpen] = useState(false);
  const [lbUrls, setLbUrls] = useState([]);
  const [lbStart, setLbStart] = useState(0);
  const openLightbox = (urls, start = 0) => { setLbUrls(urls); setLbStart(start); setLbOpen(true); };

  useEffect(() => {
    (async () => {
      setLoading(true); setErr("");
      try {
        const data = await listPublicComments(20, 1);
        setItems(data || []);
        setHasMore((data || []).length === 20);
      } catch (e) {
        setErr(e.message || "Error al cargar comentarios");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadMore = async () => {
    if (!hasMore || loading) return;
    const next = page + 1;
    setLoading(true);
    try {
      const data = await listPublicComments(20, next);
      setItems((prev) => [...prev, ...(data || [])]);
      setPage(next);
      setHasMore((data || []).length === 20);
    } catch (e) {
      setErr(e.message || "Error al cargar más");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mh-comments-section">
      <div className="container py-4">
        <div className="row g-4">

          {/* Columna izquierda: lista */}
          <div className="col-12 col-lg-8">
            {err && <div className="alert alert-danger">En este momento no podemos cargar los comentarios.</div>}
            {loading && <div className="text-muted mb-3">Cargando…</div>}
            {!loading && !items.length && (
              <div className="alert alert-secondary">Todavía no hay comentarios publicados.</div>
            )}

            <div className="d-flex flex-column gap-3">
              {items.map((it) => (
                <article key={it.id} className="card mh-comment border-0 shadow-sm">
                  <div className="card-body mh-card-body">
                    {/* Cabecera */}
                    <header className="mh-header d-flex justify-content-between align-items-start gap-2 flex-wrap">
                      <div className="mh-author-wrapper mx-2 mt-1">
                        <div className="mh-author h6 mb-0">
                          {it.author_name}
                        </div>
                        {it.institution && (
                          <div className="mh-institution text-muted small">
                            {it.institution}
                          </div>
                        )}
                      </div>
                      <div className="mh-meta">
                        <span className="mh-date">{new Date(it.created_at).toLocaleString()}</span>
                        <Stars n={it.rating} />
                      </div>
                    </header>

                    <div className="mh-hr" />

                    {/* Cuerpo */}
                    <p className="mh-body-text mb-0 mt-2 mx-2">{it.content}</p>

                    {/* Imágenes */}
                    {it.photos && it.photos.length > 0 && (
                      <div className="row g-2 mt-2 px-1">
                        {it.photos.map((p, idx) => (
                          <div className="col-4 col-sm-3 col-md-2" key={p.id}>
                            <div className="mh-thumb-wrap">
                              <img
                                src={`${API_BASE}${p.thumb_url || p.photo_url}`}
                                alt=""
                                className="mh-thumb"
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                onClick={() => openLightbox(it.photos.map(x => `${API_BASE}${x.photo_url}`), idx)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {hasMore && !loading && (
              <div className="text-center mt-3">
                <button className="btn btn-outline-primary" onClick={loadMore}>Ver más</button>
              </div>
            )}
          </div>

          {/* Columna derecha: aside (solo desktop) */}
          <div className="col-12 col-lg-4 d-none d-lg-block">
            <aside className="mh-aside position-sticky" style={{ top: "96px" }}>
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                  <h2 className="h5 mb-2 texto-azul">¿Querés dejar tu comentario?</h2>
                  <p className="text-muted small mb-3">
                    Valoramos tu opinión. Podés calificar, escribir un mensaje y adjuntar imágenes.
                  </p>
                  <Link to="/ComentarioNuevo" className="btn botonAgregarComentario2 w-100">
                    Agregar comentario
                  </Link>
                </div>
              </div>

              <div className="card border-0">
                <div className="card-body">
                  <ul className="list-unstyled mb-0 small text-muted">
                    <li>• Publicamos reseñas verificadas.</li>
                    <li>• Las imágenes son opcionales.</li>
                    <li>• El contenido puede moderarse.</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>

        </div>
      </div>

      {/* FAB mobile: botón flotante (solo en celular) */}
      <Link
        to="/ComentarioNuevo"
        className="btn btn-primary botonAgregarComentario"
        aria-label="Agregar comentario"
      >
        Agregar comentario
      </Link>

      {lbOpen && <ModalLightbox urls={lbUrls} start={lbStart} onClose={() => setLbOpen(false)} />}
    </section>
  );
}
