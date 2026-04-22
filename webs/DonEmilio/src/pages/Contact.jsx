import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';

const Contact = () => {
    const { t } = useTranslation();
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

        try {
            await axios.post(`${CONTACT_API}/`, {
                name: formData.name,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                message: `${formData.message} ${formData.city ? `(Ciudad: ${formData.city})` : ''} ${formData.province ? `(Provincia: ${formData.province})` : ''}`,
                service: 'DonEmilio'
            }, {
                headers: {
                    'x-api-key': 'Donemilio@2026'
                }
            });
            Swal.fire({
                icon: 'success',
                title: '¡Mensaje enviado!',
                text: 'Gracias por contactarnos. Te responderemos a la brevedad.',
                confirmButtonColor: '#0033a1'
            });
            setFormData({ name: '', lastName: '', email: '', phone: '', city: '', province: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo enviar el mensaje. Por favor intenta más tarde.',
                confirmButtonColor: '#0033a1'
            });
        } finally {
            setIsSending(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-6 font-tommy">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold text-[#0033a1] mb-4">{t('contacto.titulo')}</h1>
                    <div className="w-24 h-1.5 bg-[#E30613] mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                        {t('contacto.descripcion')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">
                    {/* INFO COLUMN */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border-2 border-[#0033a177]">
                            <h2 className="text-2xl font-bold text-[#0033a1] mb-8">{t('contacto.info')}</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#0033a1]/10 p-3 rounded-lg text-[#0033a1]">
                                        <FontAwesomeIcon icon={faLocationDot} className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{t('contacto.nuestraUbicacion')}</h3>
                                        <p className="text-gray-600">Av. Perón 1650, Villa María, Córdoba</p>
                                        <p className="text-gray-600">Tucumán 1650, Villa María, Córdoba</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-[#25D366]/10 p-3 rounded-lg text-[#25D366]">
                                        <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">WhatsApp</h3>
                                        <p className="text-gray-600">+54 9 3534 82-4646</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-[#E30613]/10 p-3 rounded-lg text-[#E30613]">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Email</h3>
                                        <p className="text-gray-600">recursoshumanos@donemiliosrl.com.ar</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0033a1] text-white p-8 rounded-2xl shadow-xl overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-4">{t('contacto.atencionAlCliente')}</h3>
                                <p className="opacity-90">{t('contacto.Lunavie')}: 8:00 - 18:00 hs</p>
                                <p className="opacity-90">{t('contacto.sabados')}: 8:00 - 14:00 hs</p>
                            </div>
                            <div className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12">
                                <FontAwesomeIcon icon={faPhone} className="text-9xl" />
                            </div>
                        </div>
                    </motion.div>

                    {/* FORM COLUMN */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-[#0033a177]">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                    <div>
                                        <label className="block text-sm font-bold text-[#0033a1] mb-2">{t('contacto.formulario.nombre')}</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-[#0033a177] text-[#0033a1] focus:border-[#0033a1] focus:ring-2 focus:ring-[#0033a1]/20 outline-none transition-all"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#0033a1] mb-2">{t('contacto.formulario.apellido')}</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-[#0033a177] text-[#0033a1] focus:border-[#0033a1] focus:ring-2 focus:ring-[#0033a1]/20 outline-none transition-all"
                                            placeholder="Tu apellido"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-[#0033a1] mb-2">{t('contacto.formulario.email')}</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-[#0033a177] text-[#0033a1] focus:border-[#0033a1] focus:ring-2 focus:ring-[#0033a1]/20 outline-none transition-all"
                                            placeholder="ejemplo@correo.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#0033a1] mb-2">{t('contacto.formulario.telefono')}</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-[#0033a177] text-[#0033a1] focus:border-[#0033a1] focus:ring-2 focus:ring-[#0033a1]/20 outline-none transition-all"
                                            placeholder="+54 9 353 ..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-[#0033a1] mb-2">{t('contacto.formulario.ciudad')}</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-[#0033a177] text-[#0033a1] focus:border-[#0033a1] focus:ring-2 focus:ring-[#0033a1]/20 outline-none transition-all"
                                            placeholder="Tu ciudad"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#0033a1] mb-2">{t('contacto.formulario.provincia')}</label>
                                        <input
                                            type="text"
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-[#0033a177] text-[#0033a1] focus:border-[#0033a1] focus:ring-2 focus:ring-[#0033a1]/20 outline-none transition-all"
                                            placeholder="Tu provincia"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#0033a1] mb-2">{t('contacto.formulario.mensaje')}</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-[#0033a177] text-[#0033a1] focus:border-[#0033a1] focus:ring-2 focus:ring-[#0033a1]/20 outline-none transition-all resize-none"
                                        placeholder="¿En qué podemos ayudarte?"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="w-full bg-[#0033a1] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#002b85] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70"
                                >
                                    {isSending ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            {t('contacto.formulario.enviar')}
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
