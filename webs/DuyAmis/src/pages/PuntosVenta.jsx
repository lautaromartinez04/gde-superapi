import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from "/images/sellpoints/logo.webp"
import logo1 from "/images/sellpoints/logo1.webp"
import vaca from "/images/sellpoints/vaca.webp"
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Haversine formula to calculate distance between two coordinates in km
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

/* ── Patrón de fondo con Vacas (para la sección inferior) ── */
function CowPattern() {
    const SIZE = 200
    const GAP = 30
    const STEP = SIZE + GAP
    const COLS = 15
    const ROWS = 6
    return (
        <div className="absolute inset-0 overflow-hidden opacity-[0.5] pointer-events-none">
            {Array.from({ length: ROWS }).map((_, row) => (
                <div
                    key={row}
                    className="flex"
                    style={{
                        marginLeft: row % 2 === 1 ? -(STEP / 2) : -STEP,
                        gap: GAP,
                        marginBottom: GAP,
                    }}
                >
                    {Array.from({ length: COLS }).map((_, col) => (
                        <img key={col} src={vaca} alt="" draggable={false}
                            className="invert-[0.35] sepia-[1] saturate-[5] hue-rotate-[330deg] brightness-125"
                            style={{ width: SIZE, height: SIZE, objectFit: 'contain', flexShrink: 0, userSelect: 'none' }}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

/* ── Patrón de fondo con Logo ── */
function LogoPattern() {
    const SIZE = 60
    const GAP = 10
    const STEP = SIZE + GAP
    const COLS = 50
    const ROWS = 10
    return (
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
            {Array.from({ length: ROWS }).map((_, row) => (
                <div
                    key={row}
                    className="flex"
                    style={{
                        marginLeft: row % 2 === 1 ? -(STEP / 2) : -STEP,
                        gap: GAP,
                        marginBottom: GAP,
                    }}
                >
                    {Array.from({ length: COLS }).map((_, col) => (
                        <img key={col} src={logo} alt="" draggable={false}
                            className="invert brightness-0"
                            style={{ width: SIZE, height: SIZE, objectFit: 'contain', flexShrink: 0, userSelect: 'none' }}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

export default function PuntosVenta() {
    const { t } = useTranslation();
    const [cityData, setCityData] = useState([])
    const [selectedCityId, setSelectedCityId] = useState(null)
    const [findingLocation, setFindingLocation] = useState(false)
    const [userLocation, setUserLocation] = useState(null)


    useEffect(() => {
        const fetchSellpoints = async () => {
            try {
                const res = await axios.get(`${API_BASE}/sellpoints/cities`);
                setCityData(res.data);
                if (res.data.length > 0 && !selectedCityId) {
                    setSelectedCityId(res.data[0].id);
                }
            } catch (error) {
                console.error('Error fetching sellpoints:', error);
            }
        };
        fetchSellpoints();
    }, []); // Only fetch on mount to avoid redundant loads on selection change

    const findNearest = () => {
        if (!navigator.geolocation) {
            alert(t('comprar.geolocalizacion'));
            return;
        }

        setFindingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                let minDistance = Infinity;
                let nearestCityId = null;
                console.log("Finding nearest out of", cityData.length, "cities");

                cityData.forEach(city => {
                    city.sellers?.forEach(seller => {
                        if (seller.lat && seller.lng) {
                            const dist = getDistance(latitude, longitude, seller.lat, seller.lng);
                            if (dist < minDistance) {
                                minDistance = dist;
                                nearestCityId = city.id;
                            }
                        }
                    });
                });

                if (nearestCityId) {
                    console.log("Nearest city found:", nearestCityId);
                    setSelectedCityId(nearestCityId);
                    setUserLocation({ latitude, longitude });
                    // Scroll to results on mobile
                    if (window.innerWidth < 1024) {
                        document.getElementById('stores-display')?.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    console.warn("No sellers found with coordinates in cityData");
                }
                setFindingLocation(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setFindingLocation(false);
                let message = t('comprar.noGeolocalizacion');

                if (error.code === 1) { // PERMISSION_DENIED
                    message = t('comprar.errorPermiso');
                } else if (error.code === 2) { // POSITION_UNAVAILABLE
                    message = t('comprar.errorPosicion');
                } else if (error.code === 3) { // TIMEOUT
                    message = t('comprar.errorTimeout');
                }

                if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                    message += " (Nota: Geolocation requiere HTTPS en este navegador)";
                }

                alert(message);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    const selectedCity = cityData.find(c => c.id === selectedCityId);

    // Sorted sellers based on distance to user (if location is available)
    const sortedSellers = useMemo(() => {
        if (!selectedCity?.sellers) return [];
        if (!userLocation) return selectedCity.sellers;

        return [...selectedCity.sellers].sort((a, b) => {
            if (!a.lat || !a.lng) return 1;
            if (!b.lat || !b.lng) return -1;
            const distA = getDistance(userLocation.latitude, userLocation.longitude, a.lat, a.lng);
            const distB = getDistance(userLocation.latitude, userLocation.longitude, b.lat, b.lng);
            return distA - distB;
        });
    }, [selectedCity, userLocation]);

    return (
        <div className="min-h-screen bg-white font-montserrat overflow-hidden">
            {/* Header Section */}
            <section className="relative h-[35vh] md:h-[45vh] flex items-center justify-center overflow-hidden bg-[#e32515]">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#b01c10] to-[#e32515]" />
                    <LogoPattern />
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 text-center px-4 pt-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-6 border border-white/20"
                    >
                        {t('comprar.donde')}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white uppercase tracking-tighter leading-none wardrum"
                    >
                        {t('comprar.puntos')} <span className="block md:inline md:ml-2">{t('comprar.venta')}</span>
                    </motion.h1>
                    <div className="mt-4 mb-8 flex flex-col items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={findNearest}
                            disabled={findingLocation}
                            className="bg-white text-[#e32515] px-6 py-3 md:px-8 md:py-4 rounded-full cursor-pointer font-black uppercase italic tracking-widest shadow-2xl flex items-center gap-3 hover:bg-gray-100 transition-all disabled:opacity-50 text-sm md:text-base"
                        >
                            {findingLocation ? (
                                <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-[#e32515]"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                            )}
                            {findingLocation ? t('comprar.buscando') : t('comprar.encontranos')}
                        </motion.button>
                    </div>
                </div>
            </section>

            {/* Main Interactive Section */}
            <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left Side: City Navigation */}
                    <div className="lg:col-span-5 sticky top-32">
                        <div className="mb-12">
                            <h2 className="text-xs font-black text-[#e32515] uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-[#e32515]" />
                                {t('comprar.zona')}
                            </h2>
                            <p className="text-gray-400 text-sm font-medium">{t('comprar.explora')}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-2 pr-2 bg-gray-50/30 p-2 rounded-3xl border border-gray-100/80 shadow-inner">
                            {cityData.length > 0 ? cityData.map((city, index) => (
                                <motion.button
                                    key={city.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedCityId(city.id)}
                                    className={`relative w-full text-left p-3 md:p-4 rounded-2xl border-2 transition-all duration-500 flex items-center justify-between group overflow-hidden ${selectedCityId === city.id
                                        ? 'bg-[#e32515] border-[#e32515] text-white shadow-xl shadow-red-200'
                                        : 'bg-white border-gray-100 text-gray-800 hover:border-red-100 hover:shadow-lg hover:-translate-y-1'
                                        }`}
                                >
                                    <span className={`relative z-10 text-sm md:text-base lg:text-lg font-black uppercase italic tracking-tight transition-transform duration-500 group-hover:translate-x-2 ${selectedCityId === city.id ? 'wardrum' : ''
                                        }`}>
                                        {city.name}
                                    </span>

                                    <div className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 ${selectedCityId === city.id
                                        ? 'bg-white text-[#e32515] rotate-90 scale-110'
                                        : 'bg-red-50 text-[#e32515] group-hover:bg-[#e32515] group-hover:text-white'
                                        }`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                    </div>
                                </motion.button>
                            )) : (
                                <div className="text-slate-300 text-center py-10 font-black italic uppercase">{t('comprar.cargandoCiudades')}</div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Display Content */}
                    <div id="stores-display" className="lg:col-span-7 lg:min-h-[700px]">
                        <AnimatePresence mode="wait">
                            {selectedCity ? (
                                <motion.div
                                    key={selectedCity.id}
                                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -40, scale: 0.95 }}
                                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                    className=" md:p-6 lg:p-8 rounded-3xl relative overflow-hidden h-full shadow-inner"
                                >
                                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

                                    <div className="relative z-10">
                                        <div className="flex items-center flex-col md:flex-row justify-center md:justify-start gap-4 mb-8">
                                            <div className="w-12 h-12 bg-[#e32515] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                            </div>
                                            <div className="flex flex-col items-center md:items-start">
                                                <h3 className="text-xl text-center md:text-left lg:text-2xl xl:text-3xl font-black text-gray-900 uppercase italic wardrum leading-tight">
                                                    {selectedCity?.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                    <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">{t('comprar.habilitados')}</p>
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse md:hidden" />
                                                </div>
                                            </div>

                                        </div>
                                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                                            {sortedSellers.map((seller, i) => (
                                                <motion.div
                                                    key={seller.id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 + (i * 0.04) }}
                                                    className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 hover:bg-red-50/30 transition-all duration-300 group/item gap-4"
                                                >
                                                    <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                                                        <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#e32515] flex items-center justify-center shrink-0 group-hover/item:bg-[#e32515] group-hover/item:text-white transition-all">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <span className="text-base md:text-lg lg:text-xl font-black text-gray-900 tracking-tight block uppercase italic wardrum">{seller.name}</span>
                                                            {seller.address && (
                                                                <span className="text-[10px] md:text-sm text-gray-500 font-medium flex items-center gap-2 mt-1 line-clamp-1">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                                                    {seller.address}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {seller.maps_url && (
                                                        <a
                                                            href={seller.maps_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex items-center justify-center w-full sm:w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl hover:bg-[#e32515] hover:text-white transition-all duration-300 group/link"
                                                            title="¿Cómo llegar?"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/link:scale-110">
                                                                <polyline points="15 10 20 15 15 20" />
                                                                <path d="M4 4v7a4 4 0 0 0 4 4h12" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                        {(!selectedCity?.sellers || selectedCity.sellers.length === 0) && (
                                            <div className="text-slate-400 font-black italic uppercase text-center py-10">{t('comprar.noHayVendedores')}</div>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="bg-gray-50/50 p-16 md:p-24 rounded-[3.5rem] border-2 border-dashed border-gray-200 h-full flex flex-col items-center justify-center text-center group">
                                    <motion.div
                                        animate={{
                                            rotate: [0, 5, -5, 0],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center text-gray-200 shadow-2xl mb-10 group-hover:text-red-100 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                                    </motion.div>
                                    <h3 className="text-2xl md:text-3xl font-black text-gray-300 uppercase italic mb-4 wardrum">Explorá el mapa</h3>
                                    <p className="text-gray-400 max-w-sm font-medium leading-relaxed">
                                        Seleccioná una de las ciudades del listado para ver los locales y distribuidores oficiales donde podés conseguir nuestros productos.
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* B2B CTA Section: Redesigned White/Red */}
            <section className="bg-white py-20 md:py-32 px-6 overflow-hidden relative border-t-8 border-[#e32515] shadow-[inset_0_20px_50px_rgba(0,0,0,0.02)]">
                <CowPattern />
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-red-50 rounded-full blur-[120px] opacity-40 -mr-[10%] -mt-[10%]" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gray-50 rounded-full blur-[120px] opacity-40 -ml-[10%] -mb-[10%]" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 uppercase italic mb-8 md:mb-10 leading-tight tracking-tighter wardrum flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                            <span>{t('comprar.queresvender')}</span>
                            <img src={logo1} alt="Duy Amis" className="h-12 sm:h-16 lg:h-16 xl:h-20 w-auto object-contain mb-2 md:mb-4" />
                            <span>{t('comprar.negocio')}</span>
                        </h2>
                        <p className="text-gray-500 text-base md:text-2xl mb-12 md:text-16 max-w-2xl mx-auto font-medium leading-relaxed">
                            {t('comprar.sumate')}
                        </p>
                        <Link
                            to="/contacto"
                            className="inline-flex items-center justify-center gap-4 md:gap-6 bg-[#e32515] hover:bg-white hover:text-black text-white px-8 md:px-8 py-5 md:py-3 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase italic text-sm md:text-base tracking-widest transition-all duration-500 hover:scale-105 shadow-[0_20px_60px_-10px_rgba(227,37,21,0.5)] active:scale-95 group w-full sm:w-auto"
                        >
                            {t('comprar.contactate')}
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
