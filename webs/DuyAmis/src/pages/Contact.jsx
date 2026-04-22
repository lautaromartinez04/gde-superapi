import { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function Contact() {
    const { t } = useTranslation()
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        province: '',
        message: ''
    })
    const [isSending, setIsSending] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSending(true)

        // Standardized: Try using VITE_API_CONTACT first, then fallback to normalized VITE_API_URL
        let CONTACT_API = import.meta.env.VITE_API_CONTACT;

        if (!CONTACT_API) {
            let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6500/api'
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
                service: 'DuyAmis'
            })
            Swal.fire({
                icon: 'success',
                title: t('contacto.success'),
                text: t('contacto.gracias'),
                confirmButtonColor: '#e32515'
            })
            setFormData({ name: '', lastName: '', email: '', phone: '', city: '', province: '', message: '' })
        } catch (error) {
            console.error(error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: t('contacto.error'),
                confirmButtonColor: '#e32515'
            })
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#fffaf8] py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 montserrat uppercase tracking-widest">
                        {t('contacto.titulo')}
                    </h1>
                    <div className="w-20 h-1 bg-red-600 mx-auto" />
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col"
                    >
                        <h2 className="text-3xl font-bold mb-6 montserrat text-gray-900 leading-tight">{t('contacto.hablemos')}</h2>
                        <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                            {t('contacto.duda')}
                        </p>

                        <div className="space-y-8 flex-grow">
                            <div className="group">
                                <span className="block font-bold text-red-600 uppercase tracking-[0.2em] text-xs mb-3">{t('contacto.fabrica')}</span>
                                <div className="flex items-start gap-4 text-gray-700">
                                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                                        <i className="fas fa-map-marker-alt text-xl"></i>
                                    </div>
                                    <p className="text-gray-700 montserrat font-medium pt-1">
                                        Ramón J. Cárcano 125, <br />
                                        <span className="text-gray-500 font-normal">Ana Zumarán, Córdoba</span>
                                    </p>
                                </div>
                            </div>

                            <div className="group">
                                <span className="block font-bold text-red-600 uppercase tracking-[0.2em] text-xs mb-3">{t('contacto.adminVentas')}</span>
                                <div className="flex items-start gap-4 text-gray-700">
                                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                                        <i className="fas fa-building text-xl"></i>
                                    </div>
                                    <p className="text-gray-700 montserrat font-medium pt-1">
                                        Pablo Colabianchi 412, <br />
                                        <span className="text-gray-500 font-normal">Villa María, Córdoba</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 flex gap-4">
                            <motion.a
                                whileHover={{ scale: 1.1, translateY: -5 }}
                                href="https://www.instagram.com/duyamislacteos"
                                target="_blank"
                                rel="noreferrer"
                                className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-red-600 hover:bg-[#e32515] hover:text-white transition-all duration-300 border border-red-50"
                            >
                                <i className="fab fa-instagram text-2xl"></i>
                            </motion.a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-8 rounded-2xl shadow-xl border border-red-50"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-red-600 mb-2">{t('contacto.nombre')}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border-red-200 focus:bg-white focus:border-red-600 border-2 rounded-lg outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-red-600 mb-2">{t('contacto.apellido')}</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border-red-200 focus:bg-white focus:border-red-600 border-2 rounded-lg outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-red-600 mb-2">{t('contacto.email')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border-red-200 focus:bg-white focus:border-red-600 border-2 rounded-lg outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-red-600 mb-2">{t('contacto.telefono')}</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border-red-200 focus:bg-white focus:border-red-600 border-2 rounded-lg outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-red-600 mb-2">{t('contacto.ciudad')}</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border-red-200 focus:bg-white focus:border-red-600 border-2 rounded-lg outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-red-600 mb-2">{t('contacto.provincia')}</label>
                                    <input
                                        type="text"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border-red-200 focus:bg-white focus:border-red-600 border-2 rounded-lg outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-red-600 mb-2">{t('contacto.mensaje')}</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border-red-200 focus:bg-white focus:border-red-600 border-2 rounded-lg outline-none transition-all"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full py-3 bg-red-600 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                                {isSending ? t('contacto.enviando') : t('contacto.enviar')}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
