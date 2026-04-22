import React from 'react'
import logo from '../media/images/duyamis/duyamis.webp'
import './duyamis.css'

export const DuyAmis = ({ onBack }) => {
    return (
        <section className="duyamis-section">
            {onBack && (
                <button
                    onClick={onBack}
                    className="duyamis-back-btn"
                >
                    VOLVER
                </button>
            )}
            <a href="/duyamis/">
                <img src={logo} alt="Duy Amis" className="duyamis-logo" />
            </a>
            <h1 className="duyamis-title">DUY AMIS</h1>
            <p className="duyamis-text">Contenido de Duy Amis...</p>
        </section>
    )
}
