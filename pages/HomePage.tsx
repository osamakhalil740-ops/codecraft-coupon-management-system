
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { SparklesIcon, ShareIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const CouponGenerator: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="glass-panel max-w-xl mt-10 w-full animate-slideInUp">
            <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-dark-gray mb-6 text-center">{t('home.generator.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder={t('home.generator.placeholder1')} className="w-full form-input py-3" />
                    <input type="text" placeholder={t('home.generator.placeholder2')} className="w-full form-input py-3" />
                </div>
                <Link
                    to="/login"
                    className="btn-primary w-full mt-6 inline-flex justify-center"
                >
                    {t('home.generator.button')}
                </Link>
            </div>
        </div>
    );
};

const HomePage: React.FC = () => {
    const { t } = useTranslation();

    const metrics = [
        { label: t('home.metrics.shops'), value: '3,200+' },
        { label: t('home.metrics.coupons'), value: '12,500+' },
        { label: t('home.metrics.redemptions'), value: '57,800+' },
    ];

    const benefits = [
        {
            icon: <SparklesIcon className="h-6 w-6" />,
            title: t('home.benefits.items.0.title'),
            description: t('home.benefits.items.0.description'),
        },
        {
            icon: <ShareIcon className="h-6 w-6" />,
            title: t('home.benefits.items.1.title'),
            description: t('home.benefits.items.1.description'),
        },
        {
            icon: <RocketLaunchIcon className="h-6 w-6" />,
            title: t('home.benefits.items.2.title'),
            description: t('home.benefits.items.2.description'),
        },
    ];

    const steps = [
        {
            title: t('home.howItWorks.step1.title'),
            description: t('home.howItWorks.step1.description'),
        },
        {
            title: t('home.howItWorks.step2.title'),
            description: t('home.howItWorks.step2.description'),
        },
        {
            title: t('home.howItWorks.step3.title'),
            description: t('home.howItWorks.step3.description'),
        },
    ];

    return (
        <div className="space-y-16 animate-fadeIn">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#051937] via-[#0f62ff] to-[#7de2fc] text-white px-6 py-14 md:px-12">
                <div className="blur-blob -right-10 top-10" />
                <div className="blur-blob -left-12 bottom-0" />
                <div className="relative z-10 max-w-3xl">
                    <span className="hero-pill mb-6 inline-flex">{t('home.hero.badge')}</span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-balance">
                        {t('home.hero.title')}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-100/90 mt-6 max-w-2xl leading-relaxed">
                        {t('home.hero.subtitle')}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-8">
                        <Link to="/login" className="btn-primary">
                            {t('home.hero.primaryCta')}
                        </Link>
                        <Link to="/marketplace" className="btn-secondary">
                            {t('home.hero.secondaryCta')}
                        </Link>
                    </div>
                </div>
                <CouponGenerator />
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-white/90">
                    {metrics.map((metric) => (
                        <div key={metric.label} className="stat-chip">
                            <span className="text-3xl font-semibold">{metric.value}</span>
                            <span className="text-sm uppercase tracking-wide">{metric.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-12">
                <div className="text-center max-w-3xl mx-auto">
                    <p className="hero-pill mx-auto mb-4 text-sm text-primary/90 bg-primary/5 border-primary/20">
                        {t('home.benefits.title')}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-dark-gray">
                        {t('home.benefits.description')}
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {benefits.map((benefit) => (
                        <div key={benefit.title} className="glass-panel p-6 flex flex-col gap-4">
                            <span className="feature-icon">{benefit.icon}</span>
                            <h3 className="text-xl font-semibold text-dark-gray">{benefit.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="glass-panel p-8 md:p-12">
                <div className="grid gap-10 md:grid-cols-2 items-center">
                    <div>
                        <p className="hero-pill text-sm text-primary/90 bg-primary/5 border-primary/20 inline-flex mb-4">
                            {t('home.howItWorks.title')}
                        </p>
                        <h3 className="text-3xl font-bold text-dark-gray mb-4">
                            {t('home.workflow.title')}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            {t('home.workflow.description')}
                        </p>
                    </div>
                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <div key={step.title} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary font-semibold flex items-center justify-center">
                                        {index + 1}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-lg text-dark-gray">{step.title}</p>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="glass-panel p-10 text-center">
                <p className="hero-pill mx-auto mb-4 text-sm text-primary/90 bg-primary/5 border-primary/20">
                    {t('home.ctaSection.highlight')}
                </p>
                <h3 className="text-3xl font-bold text-dark-gray mb-4">{t('home.ctaSection.title')}</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">{t('home.ctaSection.subtitle')}</p>
                <div className="flex flex-wrap gap-4 justify-center mt-8">
                    <Link to="/login" className="btn-primary">
                        {t('home.ctaSection.primary')}
                    </Link>
                    <Link to="/partner-with-us" className="btn-secondary dark">
                        {t('home.ctaSection.secondary')}
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;