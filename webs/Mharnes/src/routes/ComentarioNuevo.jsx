import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPublicComment } from "../php/api";
import "../assets/css/comentarios.css";
import "../assets/css/comentarioNuevo.css";


export default function ComentarioNuevo() {
  const nav = useNavigate();

  const [author, setAuthor] = useState("");
  const [institution, setInstitution] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null); // {kind, text}

  const showAlert = (text, kind = "success") => {
    setAlert({ text, kind });
    clearTimeout(showAlert._t);
    showAlert._t = setTimeout(() => setAlert(null), 3200);
  };

  const onSelectFiles = (e) => {
    const chosen = Array.from(e.target.files || []);
    if (!chosen.length) return;

    const newFiles = [...files, ...chosen];
    setFiles(newFiles);

    // Previews
    const addPrev = chosen
      .filter(f => (f.type || "").startsWith("image/"))
      .map(f => URL.createObjectURL(f));

    setPreviews(prev => [...prev, ...addPrev]);
  };

  const removeFile = (idx) => {
    // Revocar el objectURL para evitar fugas de memoria
    URL.revokeObjectURL(previews[idx]);
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!author.trim() || !body.trim()) {
      showAlert("Completá nombre y comentario.", "danger");
      return;
    }
    if (rating < 1) {
      showAlert("Por favor, seleccioná al menos 1 estrella.", "danger");
      return;
    }
    setSubmitting(true);
    try {
      await createPublicComment({
        author,
        institution,
        body,
        rating,
        files
      });
      showAlert("¡Gracias! Tu comentario fue enviado.", "success");
      setTimeout(() => nav("/Comentarios"), 900);
    } catch (err) {
      console.error(err);
      showAlert("No se pudo enviar. Intentá nuevamente.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mh-comments-section">
      <div className="container py-4">
        {alert && (
          <div className={`alert alert-${alert.kind} alert-dismissible`} role="alert">
            {alert.text}
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setAlert(null)} />
          </div>
        )}

        <div className="card border-0 shadow-sm mh-form-card">
          <div className="card-body">
            <h2 className="h4 mb-4 text-center titulo-comentario-nuevo">Dejanos tu experiencia</h2>
            <form onSubmit={onSubmit}>
              <div className="row g-3">

                {/* Nombre e Institución en la misma línea */}
                <div className="col-12 col-md-6">
                  <label className="form-label">Tu nombre</label>
                  <input
                    className="form-control"
                    placeholder="Nombre y apellido"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    maxLength={80}
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Institución / Empresa <span className="text-muted small">(opcional)</span></label>
                  <input
                    className="form-control"
                    placeholder="Ej: Colegio San José..."
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    maxLength={100}
                    disabled={submitting}
                  />
                </div>

                {/* Calificación y Fotos en la misma línea pero con estructura vertical interna */}
                <div className="col-12 col-md-6">
                  <label className="form-label mb-1">Calificación</label>
                  <div className="star-rating d-flex">
                    {[...Array(5)].map((star, index) => {
                      index += 1;
                      return (
                        <button
                          type="button"
                          key={index}
                          className={index <= (hover || rating) ? "star on" : "star off"}
                          onClick={() => setRating(index)}
                          onMouseEnter={() => setHover(index)}
                          onMouseLeave={() => setHover(rating)}
                          disabled={submitting}
                        >
                          <span className="star-icon">&#9733;</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label mb-1">Fotos <span className="text-muted small">(opcional)</span></label>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="file"
                      id="photo-upload"
                      className="d-none"
                      accept="image/*"
                      multiple
                      onChange={onSelectFiles}
                      disabled={submitting}
                    />
                    <label htmlFor="photo-upload" className="btn btn-outline-primary mb-0">
                      <i className="fa-solid fa-camera me-2"></i>
                      Seleccionar
                    </label>
                    <span className="text-muted small">{files.length} {files.length === 1 ? 'foto' : 'fotos'}</span>
                  </div>
                </div>

                {/* Comentario en bloque completo */}
                <div className="col-12">
                  <label className="form-label">Comentario</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Escribí tu experiencia…"
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>

                {!!previews.length && (
                  <div className="col-12 mt-3">
                    <div className="mh-preview-grid">
                      {previews.map((src, i) => (
                        <div className="mh-preview" key={i}>
                          <img src={src} alt="" />
                          <button
                            type="button"
                            className="mh-remove"
                            onClick={() => removeFile(i)}
                            aria-label="Quitar imagen"
                          >×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4 mh-actions justify-content-center justify-content-md-start">
                <button type="submit" className="btn btn-primary px-5 py-2" disabled={submitting}>
                  {submitting ? "Enviando…" : "Enviar comentario"}
                </button>
                <Link to="/Comentarios" className="btn btn-outline-secondary px-4 py-2">Cancelar</Link>
              </div>
            </form>
          </div>
        </div>

        <p className="mh-hint mt-3 text-center">
          Al enviar aceptás que podamos publicar tu comentario y las imágenes adjuntas.
        </p>
      </div>
    </section>
  );
}
