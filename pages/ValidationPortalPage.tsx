
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Coupon } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';

const ValidationPortalPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [redeemMessage, setRedeemMessage] = useState('');
    
    const queryParams = new URLSearchParams(location.search);
    const affiliateId = queryParams.get('affiliateId');

    useEffect(() => {
        const fetchCoupon = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await api.getCouponById(id);
                if (data) setCoupon(data);
                else setError(t('validationPortal.notFound'));
            } catch (err) {
                setError(t('validationPortal.loadError'));
            } finally {
                setLoading(false);
            }
        };
        fetchCoupon();
    }, [id, t]);

    const handleRedeem = async () => {
        if (!id || !user) return;
        setIsRedeeming(true);
        setRedeemMessage('');
        
        // Call the secure API endpoint which triggers the Cloud Function
        const result = await api.redeemCoupon(id, affiliateId, user.id);
        setRedeemMessage(result.message);

        if(result.success) {
            setTimeout(() => navigate('/dashboard'), 2000);
        }
        setIsRedeeming(false);
    }

    if (loading) return <div className="text-center p-10">{t('common.loading')}</div>;
    if (error) return <div className="text-center p-10 text-alert">{error}</div>;
    if (!coupon) return null;

    const canRedeem = user; // Any logged-in user can redeem coupons to earn points

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg border">
            <h1 className="text-2xl font-bold text-center mb-2">{t('validationPortal.title')}</h1>
            <p className="text-center text-gray-500 mb-6">{t('validationPortal.subtitle')}</p>
            
            <div className="bg-gray-50 p-6 rounded-lg border space-y-3">
                <h3 className="text-lg font-bold text-primary">{coupon.title}</h3>
                <p className="text-sm"><strong>{t('validationPortal.description')}:</strong> {coupon.description}</p>
                <p className="text-sm"><strong>{t('validationPortal.createdBy')}:</strong> {coupon.shopOwnerName}</p>
                <p className="text-sm"><strong>{t('validationPortal.usesLeft')}:</strong> {coupon.usesLeft} / {coupon.maxUses}</p>
                 <p className="text-sm"><strong>{t('validationPortal.couponId')}:</strong> <code className="bg-gray-200 p-1 rounded">{coupon.id}</code></p>
                 {affiliateId && <p className="text-xs text-gray-500 pt-2 border-t mt-2">Affiliate ID: {affiliateId}</p>}
            </div>

            <div className="mt-6">
                {!user && <p className="text-center text-alert">{t('validationPortal.errors.mustBeLoggedIn')}</p>}
                {user && coupon.customerRewardPoints > 0 && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                        <p className="text-blue-800 font-semibold">🎁 You'll earn {coupon.customerRewardPoints} points for using this coupon!</p>
                    </div>
                )}
                
                {canRedeem && (
                    <button 
                        onClick={handleRedeem}
                        disabled={isRedeeming || coupon.usesLeft <= 0}
                        className="w-full bg-success text-white font-bold py-3 px-4 rounded-md hover:opacity-90 disabled:opacity-50"
                    >
                        {isRedeeming ? t('validationPortal.processing') : `${t('validationPortal.redeemButton')} (${t('validationPortal.usesLeft')}: ${coupon.usesLeft})`}
                    </button>
                )}
                 {redeemMessage && <p className={`mt-4 text-center text-sm ${redeemMessage.includes('success') ? 'text-success' : 'text-alert'}`}>{redeemMessage}</p>}
            </div>
        </div>
    );
};

export default ValidationPortalPage;
