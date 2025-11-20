import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { Shop, AdminCreditLog, Coupon, Redemption, Referral, Role, User } from '../types';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import {
    UserGroupIcon,
    BanknotesIcon,
    GiftIcon,
    TicketIcon,
    TrashIcon,
    EyeIcon,
    Cog6ToothIcon,
    AdjustmentsHorizontalIcon,
    TableCellsIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../hooks/useTranslation';

type AdminTab =
    | 'overview'
    | 'shops'
    | 'affiliates'
    | 'coupons'
    | 'redemptions'
    | 'referrals'
    | 'intelligence'
    | 'settings';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [allUsers, setAllUsers] = useState<Shop[]>([]);
    const [allCoupons, setAllCoupons] = useState<Coupon[]>([]);
    const [creditLogs, setCreditLogs] = useState<AdminCreditLog[]>([]);
    const [redemptions, setRedemptions] = useState<Redemption[]>([]);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [selectedUser, setSelectedUser] = useState<Shop | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [creditsInput, setCreditsInput] = useState('');
    const [rolesInput, setRolesInput] = useState<Role[]>([]);
    const [savingUser, setSavingUser] = useState(false);
    const [busy, setBusy] = useState(false);
    const [affiliateDetailsOpen, setAffiliateDetailsOpen] = useState(false);
    const [selectedAffiliate, setSelectedAffiliate] = useState<User | null>(null);
    const [systemActivity, setSystemActivity] = useState<any[]>([]);
    const [allCustomerData, setAllCustomerData] = useState<any[]>([]);
    const [intelligenceData, setIntelligenceData] = useState<any>({});

    const fetchData = useCallback(async () => {
        if (user?.roles.includes('admin')) {
            setBusy(true);
            try {
                const [fetchedUsers, fetchedCoupons, allCreditLogs, allRedemptions, allReferrals, activityData] = await Promise.all([
                api.getAllUsers(), 
                api.getAllCoupons(),
                    api.getAdminCreditLogs(),
                    api.getAllRedemptions(),
                    api.getAllReferrals(),
                    api.getSystemActivity()
            ]);
            setAllUsers(fetchedUsers);
            setAllCoupons(fetchedCoupons);
            setCreditLogs(allCreditLogs);
                setRedemptions(allRedemptions);
                setReferrals(allReferrals);
                setSystemActivity(activityData || []);
            } finally {
                setBusy(false);
            }
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-12">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-dark-gray mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">System overview and management tools</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-dark-gray mb-4">Data Intelligence Center (Coming Soon)</h3>
                    <p className="text-gray-600">The complete admin intelligence system is being finalized and will be available in the next update.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;