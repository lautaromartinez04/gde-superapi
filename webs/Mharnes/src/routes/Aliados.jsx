import { useState, useEffect } from 'react'
import axios from 'axios'
import "../assets/css/aliados.css"

export const Aliados = () => {
  const [allies, setAllies] = useState([])
  const [loadedImages, setLoadedImages] = useState({})

  // baseURL normally includes /api, e.g http://192.168.0.25:6500/api
  const baseURL = import.meta.env.VITE_API_URL 
    ? (import.meta.env.VITE_API_URL.endsWith('/') ? import.meta.env.VITE_API_URL.slice(0, -1) : import.meta.env.VITE_API_URL)
    : 'http://localhost:6500/api';
  // Remove /api from the end for image paths
  const imageBaseURL = '';

  useEffect(() => {
    axios.get(`${baseURL}/allies?brand=mharnes`, {
      headers: { 'x-api-key': '<Donemilio@2026>' }
    })
      .then(response => {
        setAllies(response.data)
      })
      .catch(error => {
        console.error('Error fetching allies:', error)
      })
  }, [baseURL])

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }))
  }

  return (
    <>
      <div className='ContenedorAliados'>
        {allies.map((ally) => {
          const Wrapper = ally.website_url ? 'a' : 'div';
          const wrapProps = ally.website_url
            ? { href: ally.website_url, target: '_blank', rel: 'noopener noreferrer' }
            : {};
          const isLoaded = loadedImages[ally.id];
          return (
            <Wrapper key={ally.id} className='Aliados'
              style={{ width: "100%", position: 'relative' }}
              {...wrapProps}
            >
              {/* Skeleton pulsante mientras carga */}
              {!isLoaded && (
                <div style={{
                  aspectRatio: '16/5',
                  width: '100%',
                  borderRadius: '12px',
                  background: '#e5e7eb',
                  animation: 'aliadoPulse 1.5s ease-in-out infinite'
                }} />
              )}
              <img
                src={`${imageBaseURL}${ally.image_url}`}
                className="img-fluid donemilio"
                alt={ally.name}
                onLoad={() => handleImageLoad(ally.id)}
                style={{
                  objectFit: 'contain',
                  width: "100%",
                  cursor: ally.website_url ? 'pointer' : 'default',
                  opacity: isLoaded ? 1 : 0,
                  transition: 'opacity 0.6s ease',
                  position: isLoaded ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            </Wrapper>
          );
        })}
        {allies.length === 0 && (
          <p className="text-center w-100">No hay aliados corporativos cargados por el momento.</p>
        )}
      </div>
      <style>{`
        @keyframes aliadoPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  )
}
// Cache bust 2
