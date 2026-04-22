import React, { useState, useEffect } from 'react';
import axios from 'axios';
import donemilio from '../../media/images/schedules/donemilio.webp';
import carrito from '../../media/images/schedules/carrito.webp';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const Schedules = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/donemilio/branches`)
            .then(res => setBranches(res.data))
            .catch(() => setLoading(false))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-[#0033a1] py-8 font-tommy px-4 md:px-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute top-1/2 left-1/2 z-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `url(${carrito})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '70px',
                    width: '150vmax',
                    height: '150vmax',
                    transform: 'translate(-50%, -50%) rotate(-45deg)'
                }}
            ></div>

            <div className="w-full max-w-[100%] mx-auto border-2 border-white rounded-3xl p-8 shadow-2xl relative z-10">
                <h2 className="text-3xl text-white font-bold text-center mb-8 tracking-wider drop-shadow-md">HORARIOS</h2>

                {loading ? (
                    <div className="text-white text-center opacity-60 py-4">Cargando horarios...</div>
                ) : branches.length === 0 ? (
                    <div className="text-white text-center opacity-60 py-4">No hay horarios disponibles</div>
                ) : (
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                        {branches.map((branch, index) => (
                            <React.Fragment key={branch.id}>
                                {/* Center Logo between first and second branch */}
                                {index === 1 && (
                                    <div className="flex-shrink-0">
                                        <img
                                            src={donemilio}
                                            alt="Don Emilio Logo"
                                            className="w-32 md:w-40 h-auto drop-shadow-xl filter brightness-0 invert"
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col items-center text-center flex-1 w-full md:w-auto">
                                    <div className="bg-[#E30613] text-white font-bold text-lg py-1 px-4 w-full max-w-sm uppercase tracking-wider mb-1 shadow-md">
                                        <span className="block transform">SUCURSAL</span>
                                    </div>
                                    <div className="bg-[#E30613] text-white font-bold text-lg py-1 px-4 w-full max-w-sm uppercase tracking-wider shadow-md">
                                        <span className="block transform">{branch.name}</span>
                                    </div>

                                    <div className="w-12 h-1 bg-white my-4 opacity-80"></div>

                                    <div className="text-white space-y-2">
                                        {branch.schedules.map(sched => (
                                            <div key={sched.id}>
                                                <p className="text-lg font-light">{sched.days}</p>
                                                {sched.hours.split('&').map((part, i) => (
                                                    <p key={i} className="text-xl font-bold">
                                                        {i > 0 ? '& ' : ''}{part.trim()}
                                                    </p>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}

                        {/* If only 1 branch, show logo after it */}
                        {branches.length === 1 && (
                            <div className="flex-shrink-0">
                                <img
                                    src={donemilio}
                                    alt="Don Emilio Logo"
                                    className="w-32 md:w-40 h-auto drop-shadow-xl filter brightness-0 invert"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
