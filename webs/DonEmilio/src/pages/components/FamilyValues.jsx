import React from 'react';
import { motion } from 'framer-motion';

// Import named images
import empresa1 from '../../media/images/About/empresa1.webp';
import empresa2 from '../../media/images/About/empresa2.webp';
import empresa3 from '../../media/images/About/empresa3.webp';

import equipo1 from '../../media/images/About/equipo1.webp';
import equipo2 from '../../media/images/About/equipo2.webp';

import tecnologia1 from '../../media/images/About/tecnologia1.webp';
import tecnologia2 from '../../media/images/About/tecnologia2.webp';

import familia1 from '../../media/images/About/familia1.webp';
import familia2 from '../../media/images/About/familia2.webp';
import familia3 from '../../media/images/About/familia3.webp';

import donemilio from '../../media/images/About/donemilio.webp';

const BentoImage = ({ src, className, delay = 0, overlay = null }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay }}
            className={`${className} rounded-[2rem] overflow-hidden shadow-sm group relative bg-gray-200`}
        >
            <img src={src} alt="Don Emilio" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
            {overlay && overlay}
        </motion.div>
    );
};

const TextBlock = ({ title, text, className, delay = 0, variant = "white" }) => {
    const isBlue = variant === "blue";
    const isRed = variant === "red";
    
    let bgClass = "bg-white border-gray-100 text-gray-600";
    let titleClass = "text-[#0033a1]";
    
    if (isBlue) {
        bgClass = "bg-[#0033a1] border-transparent text-white/90";
        titleClass = "text-white";
    } else if (isRed) {
        bgClass = "bg-[#E30613] border-transparent text-white/90";
        titleClass = "text-white";
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay }}
            className={`${className} ${bgClass} rounded-[2rem] p-8 md:p-14 shadow-lg border flex flex-col justify-center relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500`}
        >
            {!isBlue && !isRed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-[#E30613] rounded-r-full"></div>
            )}
            {(isBlue || isRed) && (
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            )}
            
            <h2 className={`text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] uppercase tracking-tighter ${titleClass}`}>
                {title}
            </h2>
            <p className="text-lg md:text-xl leading-relaxed font-medium relative z-10">
                {text}
            </p>
        </motion.div>
    );
};

const FamilyValues = ({ valuesData }) => {
    if (!valuesData || !valuesData.titulo1) return null;

    return (
        <section className="w-full bg-[#fafafa] py-16 md:py-24 font-tommy relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}></div>
            
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
                
                {/* Manifesto Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
                    
                    {/* Section 1: NO SOMOS SOLO UNA EMPRESA (Text + 3 images) */}
                    <TextBlock 
                        title={valuesData.titulo1} 
                        text={valuesData.texto1} 
                        className="col-span-1 md:col-span-2 row-span-1 md:row-span-2" 
                        variant="white"
                    />
                    <BentoImage src={empresa1} className="col-span-1 row-span-1 md:row-span-2" delay={0.1} />
                    <BentoImage src={empresa2} className="col-span-1 row-span-1" delay={0.2} />
                    <BentoImage src={empresa3} className="col-span-1 row-span-1" delay={0.3} />

                    {/* Section 2: SOMOS UN EQUIPO (Text + 2 images) */}
                    {/* equipo1 and equipo2 on the left, stacked (wide). Text on the right (spans 2 rows). */}
                    <BentoImage src={equipo1} className="col-span-1 md:col-span-2 row-span-1" delay={0.1} />
                    <TextBlock 
                        title={valuesData.titulo2} 
                        text={valuesData.texto2} 
                        className="col-span-1 md:col-span-2 row-span-1 md:row-span-2" 
                        variant="blue"
                        delay={0.2}
                    />
                    <BentoImage src={equipo2} className="col-span-1 md:col-span-2 row-span-1" delay={0.3} />

                    {/* Section 3: SOMOS TECNOLOGIA (Text + 2 images) */}
                    {/* Text3 wide (3 cols). tecnologia2 tall (1 col, 2 rows) on the right. tecnologia1 wide (3 cols) below text. */}
                    <TextBlock 
                        title={valuesData.titulo3} 
                        text={valuesData.texto3} 
                        className="col-span-1 md:col-span-3 row-span-1" 
                        variant="white"
                        delay={0.1}
                    />
                    <BentoImage src={tecnologia2} className="col-span-1 md:col-span-1 row-span-1 md:row-span-2" delay={0.2} />
                    <BentoImage src={tecnologia1} className="col-span-1 md:col-span-3 row-span-1" delay={0.3} />

                    {/* Section 4: SOMOS UNA FAMILIA (Text + 3 images) */}
                    {/* familia1 tall (1 col, 2 rows). familia2 and familia3 square (1 col, 1 row). Text4 (2 cols, 2 rows). */}
                    <TextBlock 
                        title={valuesData.titulo4} 
                        text={valuesData.texto4} 
                        className="col-span-1 md:col-span-2 row-span-1 md:row-span-2" 
                        variant="red"
                        delay={0.1}
                    />
                    <BentoImage src={familia1} className="col-span-1 row-span-1 md:row-span-2" delay={0.2} />
                    <BentoImage src={familia2} className="col-span-1 row-span-1" delay={0.3} />
                    <BentoImage src={familia3} className="col-span-1 row-span-1" delay={0.4} />

                </div>

                {/* Section 5: SOMOS DON EMILIO SRL (Grand Finale, outside grid) */}
                <div className="w-full flex flex-col items-center mt-16 md:mt-24">
                    <motion.h2 
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                        className="text-5xl md:text-7xl lg:text-[8rem] font-black tracking-tighter uppercase text-center leading-tight mb-4 md:mb-8 drop-shadow-lg"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0033a1] to-[#E30613] py-6 px-8 inline-block">
                            {valuesData.titulo5}
                        </span>
                    </motion.h2>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full rounded-[2rem] overflow-hidden shadow-2xl relative bg-gray-200 group"
                    >
                        <img src={donemilio} alt="Don Emilio SRL" className="w-full h-auto transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default FamilyValues;
