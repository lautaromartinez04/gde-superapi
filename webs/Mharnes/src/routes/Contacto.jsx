import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import "../assets/css/contacto.css";
import { useTranslation } from "react-i18next";

export const Contacto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    province: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const maxChars = 400;
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > maxChars) return;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    // Standardized: Try using VITE_API_CONTACT first, then fallback to normalized VITE_API_URL
    let CONTACT_API = import.meta.env.VITE_API_CONTACT;
    
    if (!CONTACT_API) {
        let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6500/api';
        const brandSuffixes = ['/duyamis', '/donemilio', '/mharnes'];
        brandSuffixes.forEach(suffix => {
            if (API_URL.endsWith(suffix)) {
                API_URL = API_URL.slice(0, -suffix.length);
            }
        });
        CONTACT_API = `${API_URL}/contact`;
    }

    const payload = {
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      message: `${formData.message} ${formData.city ? `(Ciudad: ${formData.city})` : ''} ${formData.province ? `(Provincia: ${formData.province})` : ''}`,
      service: 'Mharnes'
    };

    try {
      await axios.post(`${CONTACT_API}/`, payload, {
        headers: {
          'x-api-key': '<Donemilio@2026>'
        }
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Enviado con éxito",
        text: "En breve nos pondremos en contacto contigo. ¡Gracias por comunicarte!",
        showConfirmButton: false,
        timer: 3000
      });
      setTimeout(() => {
        setFormData({ name: '', lastName: '', email: '', phone: '', city: '', province: '', message: '' });
        setIsSending(false);
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 3000);
    } catch (error) {
      console.error('API error:', error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error al enviar",
        text: "Ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.",
        showConfirmButton: true
      });
      setIsSending(false);
    }
  };

  const { t } = useTranslation();
  return (
    <>
      <div className="Contacto d-flex justify-content-center mx-0 w-100">
        <div className="p-dm-5 tarjeta border-bottom ">
          <form onSubmit={handleSubmit} className=''>
            <div className="row ">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">{t("contacto.nombre")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="lastName" className="form-label">{t("contacto.apellido")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">{t("contacto.correo")}</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="phone" className="form-label">{t("contacto.telefono")}</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="city" className="form-label">{t("contacto.ciudad")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="province" className="form-label">{t("contacto.provincia")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label text-left w-100">{t("contacto.mensaje")}</label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows="1"
                value={formData.message}
                onChange={handleChange}
                ref={textareaRef}
                style={{ resize: "none", overflow: "hidden" }}
                required
              ></textarea>
              <div className="text-end">
                <small className="numeritos">{formData.message.length}/{maxChars}</small>
              </div>
            </div>
            <div className='w-100 d-flex justify-content-center'>
              <button
                type="submit"
                className="btn boton btn-block mt-2"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    {t("contacto.enviando")}
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </>
                ) : (
                  t("contacto.botonEnviar")
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};
