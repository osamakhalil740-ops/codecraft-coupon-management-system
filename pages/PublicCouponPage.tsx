
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Coupon } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../hooks/useAuth';
import CouponCard from '../components/CouponCard';
import { QRCodeSVG } from 'qrcode.react';
import { QrCodeIcon } from '@heroicons/react/24/outline';

const PublicCouponPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isActivating, setIsActivating] = useState(false);
    const [activationMessage, setActivationMessage] = useState('');

    const queryParams = new URLSearchParams(location.search);
    const affiliateId = queryParams.get('affiliateId');
    
    useEffect(() => {
        const fetchAndTrackCoupon = async () => {
            if (!id) {
                setError(t('validationPortal.notFound'));
                setLoading(false);
                return;
            };
            
            setLoading(true);
            try {
                // Track click first, it will fail silently if coupon doesn't exist
                await api.trackCouponClick(id);

                const data = await api.getCouponById(id);
                if (data) {
                    setCoupon(data);
                } else {
                    setError(t('validationPortal.notFound'));
                }
            } catch (err) {
                setError(t('validationPortal.loadError'));
            } finally {
                setLoading(false);
            }
        };
        fetchAndTrackCoupon();
    }, [id, t]);

    const handleActivateCoupon = async () => {
        if (!id || !user) {
            setActivationMessage('Please login to activate this coupon and earn reward points.');
            return;
        }

        setIsActivating(true);
        setActivationMessage('');
        
        try {
            const result = await api.redeemCoupon(id, affiliateId, user.id);
            setActivationMessage(result.message);
            
            if (result.success) {
                // Refresh coupon data to show updated uses
                const updatedCoupon = await api.getCouponById(id);
                if (updatedCoupon) setCoupon(updatedCoupon);
            }
        } catch (error: any) {
            setActivationMessage(error.message || 'Failed to activate coupon. Please try again.');
        } finally {
            setIsActivating(false);
        }
    };

    if (loading) return <div className="text-center p-10">{t('common.loading')}</div>;
    if (error) return <div className="text-center p-10 text-alert">{error}</div>;
    if (!coupon) return null;

    const validationUrl = `${window.location.origin}/#/validate/${coupon.id}${affiliateId ? `?affiliateId=${affiliateId}` : ''}`;

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-fadeIn">
            <div className="md:col-span-1">
                <h2 className="text-2xl font-bold text-center mb-4 text-dark-gray">{t('publicCoupon.forTheCustomer.title')}</h2>
                <p className="text-center text-gray-600 mb-6">{t('publicCoupon.forTheCustomer.description')}</p>
                <CouponCard coupon={coupon} showAffiliateCommission={!!affiliateId} />
                
                {/* Customer Activation Section */}
                <div className="mt-6 bg-white p-6 rounded-xl shadow-lg border">
                    {!user && (
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">Login to activate this coupon and earn reward points!</p>
                            <Link to="/login" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg transform hover:scale-105 inline-block text-center">
                                Login to Activate
                            </Link>
                        </div>
                    )}
                    
                    {user && coupon.customerRewardPoints > 0 && (
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                            <p className="text-blue-800 font-semibold">🎁 You'll earn {coupon.customerRewardPoints} points for activating this coupon!</p>
                        </div>
                    )}
                    
                    {user && coupon.usesLeft > 0 && (
                        <button 
                            onClick={handleActivateCoupon}
                            disabled={isActivating}
                            className="w-full bg-success text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-lg"
                        >
                            {isActivating ? 'Activating...' : `🎫 Activate Coupon (${coupon.usesLeft} left)`}
                        </button>
                    )}
                    
                    {user && coupon.usesLeft <= 0 && (
                        <div className="text-center p-4 bg-gray-100 rounded-lg">
                            <p className="text-gray-600 font-semibold">This coupon has no uses left</p>
                        </div>
                    )}
                    
                    {activationMessage && (
                        <div className={`mt-4 p-3 rounded-lg text-center font-semibold ${
                            activationMessage.includes('success') || activationMessage.includes('successfully') 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {activationMessage}
                        </div>
                    )}
                </div>
            </div>
             <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-lg border animate-slideInUp">
                <div className="text-center border-b border-dashed pb-4 mb-4">
                    <QrCodeIcon className="h-8 w-8 mx-auto text-gray-400 mb-2"/>
                    <h2 className="text-xl font-bold">{t('publicCoupon.forTheMerchant.title')}</h2>
                    <p className="text-gray-600 text-sm">{t('publicCoupon.forTheMerchant.description')}</p>
                </div>
                <div className="flex justify-center mb-4 p-2 bg-white rounded-lg border">
                     <QRCodeSVG value={validationUrl} size={192} />
                </div>
                <Link 
                    to={`/validate/${coupon.id}${affiliateId ? `?affiliateId=${affiliateId}` : ''}`}
                    className="w-full block text-center bg-success text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                    {t('publicCoupon.forTheMerchant.button')}
                </Link>
            </div>
        </div>
    );
};

export default PublicCouponPage;