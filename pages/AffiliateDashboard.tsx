
import React, { useState, useEffect, useCallback } from 'react';
import StatCard from '../components/StatCard';
import { BanknotesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { api } from '../services/api';
import { Coupon, Redemption } from '../types';
import CouponCard from '../components/CouponCard';
import QRCodeModal from '../components/QRCodeModal';

const AffiliateDashboard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [redemptions, setRedemptions] = useState<Redemption[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalInfo, setModalInfo] = useState<{url: string} | null>(null);

    const fetchData = useCallback(async () => {
        if (user) {
            setLoading(true);
            const [allCoupons, affiliateRedemptions] = await Promise.all([
                api.getAllCoupons(),
                api.getRedemptionsForAffiliate(user.id),
            ]);
            setCoupons(allCoupons);
            setRedemptions(affiliateRedemptions);
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    if (!user) return null;
    
    const totalPointsEarned = redemptions.reduce((sum, redemption) => sum + (redemption.commissionEarned || 0), 0);
    const totalExecutions = redemptions.length;

    const handleGetLink = (couponId: string) => {
        const url = `${window.location.origin}/#/coupon/${couponId}?affiliateId=${user.id}`;
        setModalInfo({ url });
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {modalInfo && <QRCodeModal url={modalInfo.url} onClose={() => setModalInfo(null)} />}
            
            <h1 className="text-3xl font-bold text-dark-gray">{t('affiliate.dashboardTitle')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title={t('affiliate.stats.totalPoints')} value={totalPointsEarned.toLocaleString()} icon={<BanknotesIcon className="h-6 w-6"/>} color="green" />
                <StatCard title={t('affiliate.stats.totalExecutions')} value={totalExecutions} icon={<CheckCircleIcon className="h-6 w-6"/>} color="blue" />
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-dark-gray mb-4">{t('affiliate.availableCoupons')}</h2>
                {loading ? (
                    <p>{t('common.loading')}</p>
                ) : (
                    coupons.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {coupons.map(coupon => (
                                <CouponCard key={coupon.id} coupon={coupon} showAffiliateCommission={true}>
                                    <button
                                        onClick={() => handleGetLink(coupon.id)}
                                        className="w-full bg-success text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                                    >
                                        {t('affiliate.getLink')}
                                    </button>
                                </CouponCard>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center p-4 bg-white rounded-xl shadow-lg border text-gray-500">{t('user.noCoupons.title')}</p>
                    )
                )}
            </div>
        </div>
    );
};

export default AffiliateDashboard;