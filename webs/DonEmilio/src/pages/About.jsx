import React from 'react';
import FamilyValues from './components/FamilyValues';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();
    const valuesData = t('sobreNosotros.valores', { returnObjects: true });

    return (
        <div className="min-h-screen bg-[#fafafa] font-tommy text-gray-900 relative">
            {valuesData && <FamilyValues valuesData={valuesData} />}
        </div>
    );
};

export default About;
