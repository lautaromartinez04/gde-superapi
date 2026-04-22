import React from 'react'
import logo from '../media/images/donemilio/donemilio.webp'
import './donemilio.css'

export const DonEmilio = ({ onBack }) => {
    return (
        <section className="donemilio-section">
            {onBack && (
                <button
                    onClick={onBack}
                    className="donemilio-back-btn"
                >
                    VOLVER
                </button>
            )}
            <a href="/donemilio/">
                <img src={logo} alt="Don Emilio" className="donemilio-logo" />
            </a>
            <h1 className="donemilio-title">DON EMILIO</h1>
            <p className="donemilio-text">Contenido de Don Emilio...</p>
        </section>
    )
}
