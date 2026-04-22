import { Routes, Route, Navigate } from "react-router-dom";
import { NavBar } from './components/NavBar';
import { Inicio } from './routes/Inicio';
import { SobreNosotros } from './routes/SobreNosotros';
import { NuestrasPracticas } from './routes/NuestrasPracticas';
import { DelAulaAlTambo } from './routes/DelAulaAlTambo';
import { Contacto } from './routes/Contacto';
import { Aliados } from './routes/Aliados';
import Comentarios from './routes/Comentarios';
import ComentarioNuevo from "./routes/ComentarioNuevo";
import { Footer } from './components/Footer';
import "./assets/css/index.css";
import { BackNavBar } from './components/BackNavBar';
export const App = () => {
    return (
        <>
            <BackNavBar/>
            <NavBar />
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/SobreNosotros" element={<SobreNosotros />} />
                <Route path="/NuestrasPracticas/*" element={<NuestrasPracticas />} />
                <Route path="/DelAulaAlTambo" element={<DelAulaAlTambo />} />
                <Route path="/Contacto" element={<Contacto />} />
                <Route path="/Aliados" element={<Aliados />} />
                <Route path='/Comentarios' element={<Comentarios />} />
                <Route path='/ComentarioNuevo' element={<ComentarioNuevo />} />
                
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Footer />
        </>
    );
};
