import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchAllData } from '../api/api'
const logo = `${import.meta.env.BASE_URL}images/navbar/duyamis.webp`
const donEmilioLogo = `${import.meta.env.BASE_URL}images/use/donemilio.webp`
import { useTranslation } from 'react-i18next'

function hexToRgba(hex, alpha = 1) {
    if (!hex || hex.length < 7) return `rgba(0,0,0,${alpha})`
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function isImagePath(val) {
    return typeof val === 'string' && (val.startsWith('/') || val.startsWith('http'))
}

/* ── Patrón de fondo con vacas ── */
function CowPattern({ src, bgColor }) {
    const COW_SIZE = 160
    const GAP = 10
    const STEP = COW_SIZE + GAP
    const COLS = 20
    const ROWS = 15
    return (
        <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: bgColor }}>
            {Array.from({ length: ROWS }).map((_, row) => (
                <div
                    key={row}
                    className="flex"
                    style={{
                        marginLeft: row % 2 === 1 ? -(STEP / 2) : -STEP,
                        marginTop: row === 0 ? -GAP / 2 : 0,
                        gap: GAP,
                        marginBottom: GAP,
                    }}
                >
                    {Array.from({ length: COLS }).map((_, col) => (
                        <img key={col} src={src} alt="" draggable={false}
                            style={{ width: COW_SIZE, height: COW_SIZE, objectFit: 'contain', flexShrink: 0, userSelect: 'none' }}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

/* ── Tabla de información nutricional ── */
function TablanutricionalNutricional({ info, letrasLogo, fondoLetras }) {
    const { t } = useTranslation()
    if (!info || info.length === 0) return null
    const data = info[0]
    const porcion = data['porción'] || data['porcion'] || ''

    // Construir filas emparejando "Nutriente gr" con "Nutriente %"
    const filas = []
    const seen = new Set()
    Object.keys(data).forEach(key => {
        if (key === 'porcion' || key === 'porción') return
        const isGr = key.endsWith(' gr')
        const isPct = key.endsWith(' %')
        if (!isGr && !isPct) return
        const nutriente = isGr ? key.slice(0, -3) : key.slice(0, -2)
        if (seen.has(nutriente)) return
        seen.add(nutriente)
        filas.push({
            nombre: nutriente,
            cantidad: data[`${nutriente} gr`] || '—',
            pct: data[`${nutriente} %`] || '—',
        })
    })

    const headerBg = letrasLogo
    const headerText = fondoLetras

    return (
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: hexToRgba(letrasLogo, 0.3) }}>
            {/* Encabezado */}
            <div className="px-3 py-2" style={{ backgroundColor: headerBg }}>
                <p className="text-xs font-black uppercase tracking-wide" style={{ color: headerText }}>
                    {t('detalleproductos.informacionnutricional')}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: hexToRgba(headerText, 0.8) }}>
                    {porcion}
                </p>
            </div>

            {/* Columnas sub-header */}
            <div className="grid grid-cols-[1fr_auto_auto] px-3 py-1 border-b text-[10px] font-bold text-gray-500"
                style={{ borderColor: hexToRgba(letrasLogo, 0.15), backgroundColor: hexToRgba(letrasLogo, 0.06) }}>

                <span className="w-30 text-center">{t('detalleproductos.cantPorcion')}</span>
                <span className="w-20 text-center">% VD*</span>
            </div>

            {/* Filas */}
            {filas.map((fila, i) => {
                const isIndented = fila.nombre.startsWith('Grasas ') && fila.nombre !== 'Grasas Totales'
                return (
                    <div
                        key={fila.nombre}
                        className="grid grid-cols-[1fr_auto_auto] px-3 py-1 border-b text-xs"
                        style={{
                            borderColor: hexToRgba(letrasLogo, 0.1),
                            backgroundColor: i % 2 === 0 ? 'white' : hexToRgba(letrasLogo, 0.03),
                        }}
                    >
                        <span className="font-medium text-gray-700" style={{ paddingLeft: isIndented ? '0.75rem' : 0 }}>
                            {fila.nombre}
                        </span>
                        <span className="w-30 text-right text-gray-600">{fila.cantidad}</span>
                        <span className="w-10 text-right font-bold" style={{ color: letrasLogo }}>{fila.pct}</span>
                    </div>
                )
            })}

            {/* Nota al pie */}
            <p className="px-3 py-2 text-[9px] text-gray-400 leading-tight">
                * % Valores Diarios con base en una dieta de 2000 Kcal u 8400 Kj. Sus valores diarios pueden ser mayores o menores dependiendo de sus necesidades energéticas.
            </p>
        </div>
    )
}

/* ── Pantalla principal ── */
function ProductDetail() {
    const { t } = useTranslation()
    const { categoryIndex, productId } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState(null)

    useEffect(() => {
        fetchAllData().then(setData)
    }, [])

    const category = data?.Categories[Number(categoryIndex)]
    const product = category?.products.find(p => String(p.id) === productId)

    if (!data || !category || !product) {
        return (
            <main className="max-w-2xl mx-auto px-4 py-20 text-center">
                {!data ? <p className="text-gray-500 text-lg">Cargando...</p> : (
                    <>
                        <p className="text-gray-500 text-lg">Producto no encontrado.</p>
                        <button onClick={() => navigate(-1)} className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg text-sm">
                            Volver
                        </button>
                    </>
                )}
            </main>
        )
    }

    const c = category.colors?.[0] ?? {}
    const fondoVaquitas = c.FondoVaquitas || '#f3f4f6'
    const vaquitas = c.Vaquitas || '#6b7280'
    const letrasLogo = c.LetrasLogo || '#111827'
    const firma = c.Firma || '#374151'
    const detalles = c.Detalles || '#9ca3af'
    const fondoLetras = c.FondoLetras || '#ffffff'
    const texto1 = c.texto1 || '#374151'
    const donemilio = c.donemilio || '#111827'

    const vacaIsImage = isImagePath(vaquitas)
    const logoSrc = product.logo || category.logo

    // Check if product has specific nutrient data, else fallback to category
    const isInfoPopulated = (info) => {
        if (!info || info.length === 0) return false;
        const d = info[0];
        return Object.entries(d).some(([key, val]) =>
            key !== 'porcion' && key !== 'porción' && key !== 'valores diarios' && val && val !== 'null' && val !== ''
        );
    };

    const pNutri = product['informacion nutricional'];
    const infoNutri = isInfoPopulated(pNutri) ? pNutri : category['informacion nutricional'];

    const ingredientes = product.ingredientes ?? category.ingredientes
    const venta = product.venta ?? category.venta
    const envasado = product.envasado ?? category.envasado
    const peso = product.quantity

    // Wavy mask config
    const WAVE_WIDTH = 12; // Narrower for a softer wave
    const WAVE_HEIGHT = 60; // Shorter period for the wave

    // Smooth sinusoidal wave paths (paints the inward area with black to KEEP it, leaving transparent wavy edge outside)
    const svgWaveLeft = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${WAVE_WIDTH}' height='${WAVE_HEIGHT}' viewBox='0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}'%3E%3Cpath d='M${WAVE_WIDTH},0 L0,0 C0,13.5 ${WAVE_WIDTH},16.5 ${WAVE_WIDTH},30 C${WAVE_WIDTH},43.5 0,46.5 0,60 L${WAVE_WIDTH},60 Z' fill='black'/%3E%3C/svg%3E`

    // For the RIGHT wave, the "solid" body is on the LEFT.
    const svgWaveRight = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${WAVE_WIDTH}' height='${WAVE_HEIGHT}' viewBox='0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}'%3E%3Cpath d='M0,0 L${WAVE_WIDTH},0 C${WAVE_WIDTH},13.5 0,16.5 0,30 C0,43.5 ${WAVE_WIDTH},46.5 ${WAVE_WIDTH},60 L0,60 Z' fill='black'/%3E%3C/svg%3E`

    return (
        <div className="flex flex-col">

            {/* ── SECCIÓN 1: Fondo con patrón + card ── */}
            <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: fondoVaquitas }}>
                {vacaIsImage && <CowPattern src={vaquitas} bgColor={fondoVaquitas} />}

                <div className="relative z-10 flex flex-col min-h-screen">

                    {/* Botón volver */}
                    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex cursor-pointer items-center gap-1.5 md:gap-2 text-xs md:text-sm font-bold px-3 py-2 md:px-4 md:py-2.5 rounded-full shadow-xl transition-transform hover:scale-105"
                            style={{ backgroundColor: '#e41d15', color: '#ffffff' }}
                        >
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Volver
                        </button>
                    </div>

                    {/* ── COLUMNA CENTRAL ONDULADA ── */}
                    <div className="w-[95%] md:w-[90%] max-w-4xl mx-auto flex flex-col relative z-20"
                        style={{
                            backgroundColor: fondoLetras,
                            minHeight: '100vh',
                            padding: '3rem 0 2rem 0',
                            maskImage: `url("${svgWaveLeft}"), url("${svgWaveRight}"), linear-gradient(black, black)`,
                            maskPosition: 'left top, right top, center top',
                            maskRepeat: 'repeat-y, repeat-y, no-repeat',
                            // calc(100% - 48px) overlaps 1px on each side (25 + 25 = 50) to prevent transparent gaps
                            maskSize: `${WAVE_WIDTH}px ${WAVE_HEIGHT}px, ${WAVE_WIDTH}px ${WAVE_HEIGHT}px, calc(100% - ${WAVE_WIDTH * 2 - 2}px) 100%`,
                            WebkitMaskImage: `url("${svgWaveLeft}"), url("${svgWaveRight}"), linear-gradient(black, black)`,
                            WebkitMaskPosition: 'left top, right top, center top',
                            WebkitMaskRepeat: 'repeat-y, repeat-y, no-repeat',
                            WebkitMaskSize: `${WAVE_WIDTH}px ${WAVE_HEIGHT}px, ${WAVE_WIDTH}px ${WAVE_HEIGHT}px, calc(100% - ${WAVE_WIDTH * 2 - 2}px) 100%`,
                        }}>

                        {/* Card con logos y firma */}
                        <div className="px-4 md:px-8 py-4 flex flex-col items-center w-full relative text-center">
                            <img src={logo} alt="" className="h-20 md:h-32 mb-4 md:mb-6 w-auto object-contain drop-shadow-sm mx-auto block" />
                            {logoSrc ? (
                                <img src={logoSrc} alt={category.name}
                                    className="h-28 md:h-44 w-auto object-contain drop-shadow-md mx-auto block" />
                            ) : (
                                <div className="h-20 w-20 md:h-28 md:w-28 rounded-full flex items-center justify-center text-3xl md:text-4xl font-black mb-4 mx-auto"
                                    style={{ backgroundColor: hexToRgba(letrasLogo, 0.1), color: letrasLogo }}>
                                    {category.name.charAt(0)}
                                </div>
                            )}
                            <div className="w-16 h-1 rounded-full my-4 md:my-6 opacity-60 mx-auto" style={{ backgroundColor: detalles }} />

                            <p className="text-xs md:text-sm font-black mt-0.5 wardrum tracking-widest text-center" style={{ color: detalles }}>
                                {t('detalleproductos.recetade')}
                            </p>
                            <p className="text-4xl md:text-5xl italic mt-2 md:mt-3 font-black salty text-center leading-tight md:leading-normal" style={{ color: firma }}>
                                Néstor Giraudo
                            </p>
                        </div>

                        {/* ── 1. Descripción — solo texto, sin label ── */}
                        {product.description && (
                            <div className="max-w-3xl mx-auto px-6 md:px-10 pt-4 md:pt-6 pb-2 md:pb-4 w-full text-center">
                                <p className="text-[15px] md:text-lg leading-relaxed md:leading-relaxed" style={{ color: texto1, textShadow: `0 1px 2px ${hexToRgba(fondoVaquitas, 0.3)}` }}>
                                    <span className="font-black text-3xl md:text-4xl tracking-wider">{t('detalleproductos.c')}</span>
                                    <span className="font-black text-lg md:text-xl tracking-wider mr-1.5">{t('detalleproductos.ontrolamos')}</span>
                                    {t('detalleproductos.controlamos')}
                                    <span className="italic mt-1 font-black inline-block mx-1.5">{product.description}</span>
                                    {t('detalleproductos.mesa')}
                                </p>
                            </div>
                        )}

                        {/* ── 2. Barra VENTA | ENVASADO | INDUSTRIA ── */}
                        {(venta || envasado) && (
                            <div className="py-6 md:py-8 w-full flex justify-center">
                                <div className="flex flex-col sm:flex-row items-center sm:items-stretch px-4 md:px-10 justify-center text-center overflow-hidden wardrum font-black tracking-widest gap-y-4 sm:gap-y-0"
                                    style={{ borderTop: `2px dashed ${hexToRgba(letrasLogo, 0.3)}`, borderBottom: `2px dashed ${hexToRgba(letrasLogo, 0.3)}` }}>
                                    {venta && (
                                        <div className="px-4 py-4 md:px-6 md:py-6 flex flex-col items-center justify-center sm:border-r border-b sm:border-b-0 w-full sm:w-auto"
                                            style={{ borderColor: hexToRgba(letrasLogo, 0.3) }}>
                                            <span className="text-[10px] md:text-[9px] opacity-50 tracking-widest">{t('detalleproductos.ventas')}</span>
                                            <span className="text-sm mt-1" style={{ color: texto1 }}>{(venta).toLowerCase() === 'al peso' ? t('detalleproductos.alpeso') : venta}</span>
                                        </div>
                                    )}
                                    {envasado && (
                                        <div className="px-4 py-4 md:px-6 md:py-6 flex flex-col items-center justify-center sm:border-r border-b sm:border-b-0 w-full sm:w-auto"
                                            style={{ borderColor: hexToRgba(letrasLogo, 0.3) }}>
                                            <span className="text-[10px] md:text-[9px] opacity-50 tracking-widest">{t('detalleproductos.envasado')}</span>
                                            <span className="text-sm mt-1" style={{ color: texto1 }}>{(envasado || '').toLowerCase() === 'al vacio' ? t('detalleproductos.alvacio') : ''}</span>
                                        </div>
                                    )}
                                    <div className="px-4 py-4 md:px-6 md:py-6 flex flex-col items-center justify-center w-full sm:w-auto">
                                        <span className="text-[10px] md:text-[9px] opacity-50 tracking-widest">{t('detalleproductos.industria')}</span>
                                        <span className="text-sm mt-1" style={{ color: texto1 }}>ARGENTINA</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── 3. Tabla nutricional — minimalista ── */}
                        {infoNutri && (
                            <div className="max-w-3xl w-full mx-auto px-4 md:px-10 py-4">
                                <div className="overflow-hidden">
                                    {(() => {
                                        const d = infoNutri[0]
                                        const porcion = d['porción'] || d['porcion'] || ''
                                        const filas = []
                                        const seen = new Set()
                                        Object.keys(d).forEach(key => {
                                            if (key === 'porcion' || key === 'porción') return
                                            const isGr = key.endsWith(' gr')
                                            const isPct = key.endsWith(' %')
                                            const isComp = key.endsWith(' comp')
                                            let nutriente = key
                                            if (isGr) nutriente = key.slice(0, -3)
                                            else if (isPct) nutriente = key.slice(0, -2)
                                            else if (isComp) nutriente = key.slice(0, -5)

                                            if (seen.has(nutriente) || (!isGr && !isPct && !isComp)) return
                                            seen.add(nutriente)

                                            filas.push({
                                                nombre: nutriente,
                                                cantidad: d[`${nutriente} gr`] || '—',
                                                pct: d[`${nutriente} %`] || '—',
                                                comp: d[`${nutriente} comp`]
                                            })
                                        })

                                        const hasCompColumn = filas.some(f => f.comp !== undefined);

                                        return (
                                            <>
                                                {/* Encabezado minimalista */}
                                                <div className="px-2 md:px-5 py-3 border-b text-center md:text-left" style={{ borderColor: hexToRgba(texto1) }}>
                                                    <p className="text-[11px] md:text-xs font-black uppercase tracking-widest wardrum" style={{ color: texto1 }}>
                                                        {t('detalleproductos.informacionnutricional')}
                                                    </p>

                                                </div>
                                                {/* Sub-header */}
                                                <div className="flex flex-row items-center justify-between px-2 md:px-5 py-2 text-[9px] md:text-xs font-semibold border-b w-full gap-2"
                                                    style={{ borderColor: hexToRgba(texto1, 0.2), color: hexToRgba(texto1) }}>
                                                    <span className="text-left w-1/3 md:w-auto opacity-80" style={{ color: hexToRgba(texto1) }}>{porcion}</span>
                                                    <div className="flex justify-between w-2/3 md:w-auto flex-1 max-w-[320px] opacity-80 gap-1 md:gap-4">
                                                        <span className="flex-1 text-center">{t('detalleproductos.cantporcion')}</span>
                                                        <span className="flex-1 text-center">% VD*</span>
                                                        {hasCompColumn && <span className="flex-1 text-center">Comp. %</span>}
                                                    </div>

                                                </div>
                                                {/* Filas */}
                                                {filas.map((fila) => {
                                                    const isIndented = fila.nombre.startsWith('Grasas ') && fila.nombre !== 'Grasas Totales'
                                                    return (
                                                        <div key={fila.nombre}
                                                            className="flex flex-row items-center justify-between px-2 md:px-5 py-3 md:py-2 border-b text-[11px] md:text-sm transition-colors hover:bg-black/5 gap-2"
                                                            style={{ borderColor: hexToRgba(texto1, 0.12) }}>
                                                            <span className="font-medium text-left w-1/3 md:w-auto leading-tight"
                                                                style={{ paddingLeft: isIndented ? '0.5rem' : 0, color: hexToRgba(texto1) }}>
                                                                {fila.nombre}
                                                            </span>
                                                            <div className="flex justify-between w-2/3 md:w-auto flex-1 max-w-[320px] gap-1 md:gap-4">
                                                                <span className="flex-1 text-center" style={{ color: hexToRgba(texto1) }}>{fila.cantidad}</span>
                                                                <span className="flex-1 text-center font-bold" style={{ color: texto1 }}>{fila.pct}</span>
                                                                {hasCompColumn && <span className="flex-1 text-center font-bold" style={{ color: texto1 }}>{fila.comp || '—'}</span>}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                <p className="px-2 md:px-5 py-4 text-[10px] md:text-[11px] leading-relaxed opacity-80 text-center md:text-left" style={{ color: texto1 }}>
                                                    {t('detalleproductos.valoresdiarios')}
                                                </p>
                                            </>
                                        )
                                    })()}
                                </div>
                            </div>
                        )}

                        {/* ── 4. Ingredientes — título centrado + texto ── */}
                        {ingredientes && (
                            <div className="max-w-4xl mx-auto px-6 md:px-12 py-6 md:py-8 text-center mt-2 md:mt-4">
                                <p className="text-xs md:text-sm font-black uppercase tracking-widest wardrum mb-2 md:mb-3" style={{ color: texto1 }}>
                                    {t('detalleproductos.ingredientes')} <br /><span className="font-medium normal-case text-[13px] md:text-base inline-block mt-2 opacity-90 leading-relaxed" style={{ color: texto1 }}>{ingredientes}</span>
                                </p>
                            </div>
                        )}

                        {/* ── FOOTER: Don Emilio (Integrado al Final) ── */}
                        <div className="w-full mt-auto pt-8 md:pt-10 pb-12 md:pb-16 px-6" style={{ borderTop: `1px solid ${hexToRgba(texto1, 0.1)}` }}>
                            <div className="mx-auto max-w-2xl flex flex-col items-center w-full text-center montserrat">
                                <img src={donEmilioLogo} alt="Don Emilio" className="h-16 md:h-20 mb-4 md:mb-6 drop-shadow-sm opacity-90" />
                                <div className="space-y-1.5 text-xs md:text-base font-medium" style={{ color: texto1 }}>
                                    <p>{t('detalleproductos.elaborado')} <span className='font-black' style={{ color: donemilio }}>"DON EMILIO S.R.L."</span>.</p>
                                    <p>{t('detalleproductos.of')} <span className='font-black' style={{ color: donemilio }}>"DON EMILIO S.R.L."</span>.</p>
                                </div>
                                <div className="w-10 md:w-12 h-0.5 mx-auto my-4 md:my-5 opacity-40" style={{ backgroundColor: donemilio }}></div>
                                <p className="text-[10px] md:text-sm leading-relaxed block max-w-xl mx-auto opacity-80" style={{ color: texto1 }}>
                                    {t('detalleproductos.fabrica')} <br />
                                    {t('detalleproductos.domicilioLegal')}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
