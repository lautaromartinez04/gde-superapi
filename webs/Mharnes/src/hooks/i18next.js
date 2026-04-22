import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../locales/en/translation.json';
import esTranslation from '../locales/es/translation.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation, // Cambia aquí a "translation"
            },
            es: {
                translation: esTranslation, // Cambia aquí a "translation"
            },
        },
        lng: 'es', // idioma por defecto
        fallbackLng: 'en', // idioma de respaldo
        interpolation: {
            escapeValue: false, // React ya escapa el contenido
        },
    });

export default i18n;
