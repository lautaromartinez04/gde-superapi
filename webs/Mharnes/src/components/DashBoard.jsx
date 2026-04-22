import { useEffect, useState, useRef } from 'react';
import { useTranslation } from "react-i18next";
import '../assets/css/dashboard.css';
import { useFetch } from '../hooks/useFetch';


export const DashBoard = () => {


    const { t } = useTranslation();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6500/api';
    const { data: rawData, isLoading, errors } = useFetch(`${API_URL}/mharnes/stats`);

    const [data, setData] = useState(null);
    const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
    const [startAnimation, setStartAnimation] = useState([false, false, false, false]);
    const cardRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    useEffect(() => {
        if (rawData) {
            const transformed = [
                { name: "Energia", Valor: rawData.energy_generated.toString(), unity: "kWh", date: rawData.updated_at ? new Date(rawData.updated_at).toLocaleDateString() : "" },
                { name: "Arboles", Valor: rawData.trees_planted.toString(), unity: "", date: rawData.updated_at ? new Date(rawData.updated_at).toLocaleDateString() : "" },
                { name: "Visitantes", Valor: rawData.visitors.toString(), unity: "", date: rawData.updated_at ? new Date(rawData.updated_at).toLocaleDateString() : "" },
                { name: "Agua", Valor: rawData.stored_water.toString(), unity: " Mlitros", date: rawData.updated_at ? new Date(rawData.updated_at).toLocaleDateString() : "" }
            ];
            setData(transformed);
        }
    }, [rawData]);

    useEffect(() => {
        if (data && data.length > 0) {
            const observers = cardRefs.map((ref, index) => {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting && !startAnimation[index]) {
                                setStartAnimation(prev => {
                                    const newAnimationState = [...prev];
                                    newAnimationState[index] = true;
                                    return newAnimationState;
                                });
                                observer.unobserve(entry.target);
                            }
                        });
                    },
                    { threshold: 0.5 }
                );
                if (ref.current) {
                    observer.observe(ref.current);
                }
                return observer;
            });

            return () => {
                observers.forEach(observer => observer.disconnect());
            };
        }
    }, [data]);

    useEffect(() => {
        startAnimation.forEach((shouldStart, index) => {
            if (shouldStart && data) {
                let currentValue = 0;
                const endValue = parseFloat(data[index].Valor);
                const increment = endValue / 150;

                const interval = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= endValue) {
                        currentValue = endValue;
                        clearInterval(interval);
                    }
                    setAnimatedValues(prevValues => {
                        const newValues = [...prevValues];
                        newValues[index] = currentValue.toLocaleString(); // Usa toLocaleString para formatear el número
                        return newValues;
                    });
                }, 20);
            }
        });
    }, [startAnimation, data]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center w-100 my-5">
                <div className="spinner-border" style={{ color: "#1d71b7" }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (errors) {
        return <h1>{errors}</h1>;
    }

    if (!data) {
        return null;
    }

    return (
        <>
            <div className="row g-0 py-0 dashboard mx-0">
                {/* Tarjeta 1 */}
                <div className="col-6 col-lg-3">
                    <div ref={cardRefs[0]} className="card h-100 energia">
                        <div className="card-body" >
                            <h5 className="card-title my-0">{t(`inicio.${data[0].name}`)}</h5>
                            <p className="card-text valor my-0">{animatedValues[0]}<span className="unidad"> {data[0].unity}</span></p>
                            <p className="card-text fecha my-0">{data[0].date}</p>
                            <p className="card-text my-0 card-texto-cuadrantes">{t(`inicio.texto${data[0].name}`)}</p>
                        </div>
                    </div>
                </div>

                {/* Tarjeta 2 */}
                <div className="col-6 col-lg-3">
                    <div ref={cardRefs[1]} className="card h-100 Arboles">
                        <div className="card-body ">
                            <h5 className="card-title my-0">{t(`inicio.${data[1].name}`)}</h5>
                            <p className="card-text valor my-0">{animatedValues[1]}<span className="unidad">{data[1].unity}</span></p>
                            <p className="card-text fecha my-0">{data[1].date}</p>
                            <p className="card-text my-0 card-texto-cuadrantes">{t(`inicio.texto${data[1].name}`)}</p>
                        </div>
                    </div>
                </div>

                {/* Tarjeta 3 */}
                <div className="col-6 col-lg-3">
                    <div ref={cardRefs[2]} className="card h-100 Visitantes">
                        <div className="card-body ">
                            <h5 className="card-title my-0">{t(`inicio.${data[2].name}`)}</h5>
                            <p className="card-text valor my-0">{animatedValues[2]}<span className="unidad">{data[2].unity}</span></p>
                            <p className="card-text fecha my-0">{data[2].date}</p>
                            <p className="card-text my-0 card-texto-cuadrantes">{t(`inicio.texto${data[2].name}`)}</p>
                        </div>
                    </div>
                </div>

                {/* Tarjeta 4 */}
                <div className="col-6 col-lg-3">
                    <div ref={cardRefs[3]} className="card h-100 Agua">
                        <div className="card-body ">
                            <h5 className="card-title my-0">{t(`inicio.${data[3].name}`)}</h5>
                            <p className="card-text valor my-0">{animatedValues[3]}<span className="unidad"> {data[3].unity}</span></p>
                            <p className="card-text fecha my-0">{data[3].date}</p>
                            <p className="card-text my-0 card-texto-cuadrantes">{t(`inicio.texto${data[3].name}`)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};