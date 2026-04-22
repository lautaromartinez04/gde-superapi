import React from 'react';
import Home from './components/Home';
import { Schedules } from './components/Schedules';
import { Commitment } from './components/Commitment';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <Home />
            <Schedules />
            <Commitment />
        </>
    );
};

export default LandingPage;
