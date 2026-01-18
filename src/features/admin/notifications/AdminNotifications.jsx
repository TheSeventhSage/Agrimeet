import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
    Bell,
    Send,
    BarChart3,
    Check,
    Trash2,
    User,
    Wallet,      // Imported for Withdrawals
    ArrowDownLeft, // Imported for Withdrawals
    Clock,
    ExternalLink
} from 'lucide-react';
import { adminNotificationsApi } from './api/adminNotifications.api';
import { showSuccess, showError } from '../../../shared/utils/alert';
import { useNavigate } from 'react-router-dom';

// --- 1. INBOX TAB (General Notifications) ---
const InboxTab = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const fetchInbox = async () => {
        setLoading(true);
        try {
            const res = await adminNotificationsApi.getNotifications(page);
            const list = res.data?.notifications || res.data?.data || [];
            setNotifications(list);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInbox();
    }, [page]);

    const handleMarkRead = async (id) => {
        try {
            await adminNotificationsApi.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
        } catch (err) {
            showError('Failed to mark as read');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await adminNotificationsApi.markAllAsRead();
            fetchInbox();
            showSuccess('All marked as read');
        } catch (err) {
            showError('Failed to update');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this notification?')) return;
        try {
            await adminNotificationsApi.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            showSuccess('Deleted');
        } catch (err) {
            showError('Failed to delete');
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-end">
                <button onClick={handleMarkAllRead} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                    Mark all as read
                </button>
            </div>

            {loading ? (
                <div className="p-8 text-center"><div className="animate-spin h-8 w-8 border-2 border-brand-500 rounded-full border-t-transparent mx-auto"></div></div>
            ) : notifications.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-500">No notifications found.</div>
            ) : (
                <div className="space-y-3">
                    {notifications.map(n => (
                        <div key={n.id} className={`p-4 rounded-lg border ${n.read_at ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'} flex justify-between items-start gap-4 transition-all hover:shadow-sm`}>
                            <div className="flex gap-3">
                                <div className={`mt-1 p-2 h-fit rounded-full ${n.read_at ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'}`}>
                                    <Bell className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className={`text-sm font-semibold ${n.read_at ? 'text-gray-700' : 'text-gray-900'}`}>
                                        {n.data?.title || 'Notification'}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">{n.data?.message || n.data?.body || 'No content'}</p>
                                    <p className="text-xs text-gray-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {!n.read_at && (
                                    <button onClick={() => handleMarkRead(n.id)} title="Mark Read" className="p-1.5 hover:bg-white rounded-md text-blue-600">
                                        <Check className="w-4 h-4" />
                                    </button>
                                )}
                                <button onClick={() => handleDelete(n.id)} title="Delete" className="p-1.5 hover:bg-white rounded-md text-red-400 hover:text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- 2. WITHDRAWALS TAB (New Financial Notifications) ---
const WithdrawalsTab = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const res = await adminNotificationsApi.getWithdrawalNotifications(page);
            // Handling pagination wrapper commonly found in Laravel resources
            const list = res.data?.data || res.data?.notifications || res.data || [];
            setWithdrawals(list);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, [page]);

    const handleMarkRead = async (id) => {
        try {
            await adminNotificationsApi.markAsRead(id);
            setWithdrawals(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
        } catch (err) {
            // Silently fail or show toast
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-green-50 border border-green-100 p-4 rounded-lg flex items-center gap-3 text-green-800 mb-6">
                <Wallet className="w-5 h-5" />
                <p className="text-sm font-medium">These notifications represent financial withdrawal requests requiring attention.</p>
            </div>

            {loading ? (
                <div className="p-8 text-center"><div className="animate-spin h-8 w-8 border-2 border-brand-500 rounded-full border-t-transparent mx-auto"></div></div>
            ) : withdrawals.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <Wallet className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No withdrawal requests found.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {withdrawals.map(n => (
                        <div key={n.id} className={`p-5 rounded-xl border ${n.read_at ? 'bg-white border-gray-100' : 'bg-white border-brand-200 shadow-sm ring-1 ring-brand-50'} flex justify-between items-start gap-4 transition-all group`}>
                            <div className="flex gap-4">
                                <div className={`mt-1 p-3 rounded-full flex-shrink-0 ${n.read_at ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-600'}`}>
                                    <ArrowDownLeft className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className={`text-sm font-bold ${n.read_at ? 'text-gray-700' : 'text-gray-900'}`}>
                                            {n.data?.title || 'Withdrawal Request'}
                                        </h4>
                                        {!n.read_at && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{n.data?.message || n.data?.body}</p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(n.created_at).toLocaleString()}
                                        </p>
                                        {/* Action Link to Finance Page (Hypothetical) */}
                                        <button
                                            onClick={() => navigate('/admin/commissions')} // Adjust path to where withdrawals are handled
                                            className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            View Finance <ExternalLink className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {!n.read_at && (
                                    <button
                                        onClick={() => handleMarkRead(n.id)}
                                        className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Mark Read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// // --- 3. BROADCAST TAB ---
// const BroadcastTab = () => {
//     const [activeSubTab, setActiveSubTab] = useState('send');
//     const [formData, setFormData] = useState({ title: '', body: '', user_id: '', type: 'info' });
//     const [sending, setSending] = useState(false);
//     const [history, setHistory] = useState([]);
//     const [loadingHistory, setLoadingHistory] = useState(false);

//     const handleSend = async (e) => {
//         e.preventDefault();
//         setSending(true);
//         try {
//             await adminNotificationsApi.sendNotification(formData);
//             showSuccess('Notification Sent!');
//             setFormData({ title: '', body: '', user_id: '', type: 'info' });
//             loadHistory();
//         } catch (err) {
//             showError('Failed to send');
//         } finally {
//             setSending(false);
//         }
//     };

//     const loadHistory = async () => {
//         setLoadingHistory(true);
//         try {
//             const res = await adminNotificationsApi.getNotificationHistory();
//             setHistory(res.data?.data || res.data || []);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoadingHistory(false);
//         }
//     };

//     useEffect(() => {
//         if (activeSubTab === 'history') loadHistory();
//     }, [activeSubTab]);

//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-200">
//             <div className="lg:col-span-1 space-y-6">
//                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                     <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                         <Send className="w-4 h-4 text-brand-600" />
//                         Send New Notification
//                     </h3>
//                     <form onSubmit={handleSend} className="space-y-4">
//                         <div>
//                             <label className="block text-xs font-medium text-gray-700 mb-1">Target User ID (Optional)</label>
//                             <div className="relative">
//                                 <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//                                 <input
//                                     type="text"
//                                     placeholder="Leave empty to broadcast to ALL"
//                                     className="w-full pl-9 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
//                                     value={formData.user_id}
//                                     onChange={e => setFormData({ ...formData, user_id: e.target.value })}
//                                 />
//                             </div>
//                         </div>

//                         <div>
//                             <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
//                             <select
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                                 value={formData.type}
//                                 onChange={e => setFormData({ ...formData, type: e.target.value })}
//                             >
//                                 <option value="info">Information</option>
//                                 <option value="success">Success</option>
//                                 <option value="warning">Warning</option>
//                                 <option value="alert">Alert</option>
//                             </select>
//                         </div>

//                         <div>
//                             <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
//                             <input
//                                 type="text"
//                                 required
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                                 value={formData.title}
//                                 onChange={e => setFormData({ ...formData, title: e.target.value })}
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-xs font-medium text-gray-700 mb-1">Message Body</label>
//                             <textarea
//                                 required
//                                 rows={4}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                                 value={formData.body}
//                                 onChange={e => setFormData({ ...formData, body: e.target.value })}
//                             />
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={sending}
//                             className="w-full py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 text-sm font-medium"
//                         >
//                             {sending ? 'Sending...' : 'Send Notification'}
//                         </button>
//                     </form>
//                 </div>
//             </div>

//             <div className="lg:col-span-2">
//                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                     <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//                         <h3 className="font-semibold text-gray-900 text-sm">Broadcast History</h3>
//                         <button onClick={loadHistory} className="text-xs text-brand-600 hover:underline">Refresh</button>
//                     </div>

//                     <div className="max-h-[600px] overflow-y-auto">
//                         {loadingHistory ? (
//                             <div className="p-8 text-center text-gray-500">Loading history...</div>
//                         ) : history.length === 0 ? (
//                             <div className="p-8 text-center text-gray-500">No history found.</div>
//                         ) : (
//                             <table className="w-full text-left text-sm">
//                                 <thead className="bg-gray-50 border-b border-gray-100">
//                                     <tr>
//                                         <th className="px-4 py-3 font-medium text-gray-500">Title</th>
//                                         <th className="px-4 py-3 font-medium text-gray-500">Target</th>
//                                         <th className="px-4 py-3 font-medium text-gray-500">Date</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-100">
//                                     {history.map((item, idx) => (
//                                         <tr key={item.id || idx} className="hover:bg-gray-50">
//                                             <td className="px-4 py-3">
//                                                 <p className="font-medium text-gray-900">{item.title}</p>
//                                                 <p className="text-xs text-gray-500 truncate max-w-[200px]">{item.body}</p>
//                                             </td>
//                                             <td className="px-4 py-3 text-xs">
//                                                 {item.user_id ? <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">User: {item.user_id}</span> : <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">Broadcast</span>}
//                                             </td>
//                                             <td className="px-4 py-3 text-gray-500 text-xs">
//                                                 {new Date(item.created_at).toLocaleDateString()}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- 4. STATS TAB ---
// const StatsTab = () => {
//     const [stats, setStats] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const load = async () => {
//             try {
//                 const res = await adminNotificationsApi.getNotificationStats();
//                 setStats(res.data);
//             } catch (e) {
//                 console.error(e);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         load();
//     }, []);

//     if (loading) return <div className="p-8 text-center">Loading stats...</div>;

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-200">
//             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
//                 <div className="p-3 bg-blue-100 rounded-full text-blue-600">
//                     <Send className="w-6 h-6" />
//                 </div>
//                 <div>
//                     <p className="text-gray-500 text-sm">Total Sent</p>
//                     <h3 className="text-2xl font-bold text-gray-900">{stats?.total_sent || 0}</h3>
//                 </div>
//             </div>
//             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
//                 <div className="p-3 bg-purple-100 rounded-full text-purple-600">
//                     <User className="w-6 h-6" />
//                 </div>
//                 <div>
//                     <p className="text-gray-500 text-sm">Broadcasts</p>
//                     <h3 className="text-2xl font-bold text-gray-900">{stats?.broadcast_count || 0}</h3>
//                 </div>
//             </div>
//             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
//                 <div className="p-3 bg-amber-100 rounded-full text-amber-600">
//                     <Clock className="w-6 h-6" />
//                 </div>
//                 <div>
//                     <p className="text-gray-500 text-sm">Last Sent</p>
//                     <h3 className="text-sm font-bold text-gray-900">{stats?.last_sent_at ? new Date(stats.last_sent_at).toLocaleDateString() : 'N/A'}</h3>
//                 </div>
//             </div>
//         </div>
//     );
// };

// --- MAIN COMPONENT ---
const tabs = [
    { id: 'inbox', label: 'My Inbox', icon: Bell },
    { id: 'withdrawals', label: 'Withdrawal Requests', icon: Wallet }, // Added new tab
    // { id: 'broadcast', label: 'Broadcast', icon: Send },
    // { id: 'stats', label: 'Statistics', icon: BarChart3 },
];

const AdminNotifications = () => {
    const [activeTab, setActiveTab] = useState('inbox');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'inbox': return <InboxTab />;
            case 'withdrawals': return <WithdrawalsTab />;
            // case 'broadcast': return <BroadcastTab />;
            // case 'stats': return <StatsTab />;
            default: return null;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications Center</h1>
                    <p className="text-gray-500">Manage system alerts, withdrawals, and broadcasts.</p>
                </div>

                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'text-brand-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span>{tab.label}</span>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-brand-600" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-6">
                    {renderTabContent()}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminNotifications;