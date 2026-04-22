import React from 'react'
import logo from '../media/images/mharnes/mharnes.webp'
import './mharnes.css'

export const Mharnes = ({ onBack }) => {
    return (
        <section className="mharnes-section">
            {onBack && (
                <button
                    onClick={onBack}
                    className="mharnes-back-btn"
                >
                    VOLVER
                </button>
            )}
            <a href="/mharnes/">
                <img src={logo} alt="Mharnes" className="mharnes-logo" />
            </a>
            <h1 className="mharnes-title">GRUPO MHARNES</h1>
            <p className="mharnes-text">Contenido de Mharnes...</p>
        </section>
    )
}
