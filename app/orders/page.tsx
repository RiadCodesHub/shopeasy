'use client';

import { useEffect, useState} from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchOrders } from '@/lib/store/slices/orderSlice';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
     Package, Clock, Truck, CheckCircle,
     XCircle, ChevronRight, Search, Filter,
     Calendar
} from 'lucide-react';
import Link from 'next/link';
import type {RootState} from '@/lib/store/store';


const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const statusIcons = {
    pending : Clock,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
    cancelled: XCircle,
    refunded: XCircle
}

const OrderPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {data: session, status} = useSession();
    const { orders, loading, pagination } = useAppSelector((state: RootState) => state.orders);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if(status === 'loading') return;

        if(!session) {
            router.push(`/auth/login?returnUrl=${encodeURIComponent('/orders')}`);
            return;
        }

        dispatch(fetchOrders({page : 1}));
    }, [session, status, dispatch, router]);

    const loadMore = () => {
        if(pagination.hasMore) {
            dispatch(fetchOrders({page: pagination.currentPage + 1}));
        }
    }

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesSearch = searchTerm === '' || 
            order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesStatus && matchesSearch;
    });

    if(status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Loading your orders...
                    </p>
                </div>
            </div>
        )
    }
    if(!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        My Orders
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and track your orders
                    </p>
                </div>

                {/*Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className='flex-1 w-full'>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input 
                              type='text'
                              placeholder='Search by order ID or productName...'
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                            />
                        </div>
                        </div>

                        <div className='w-full md:w-auto'>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select 
                               value={filterStatus}
                               onChange={(e) => setFilterStatus(e.target.value)}
                               className='pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600
                                        rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none'
                               >
                               <option value="all">All orders</option>
                               <option value="pending">Pending</option>
                               <option value="processing">Processing</option>
                               <option value="shipped">Shipped</option>
                               <option value="delivered">Delivered</option>
                               <option value="cancelled">Cancelled</option>
                               <option value="refunded">Refunded</option>    
                            </select> 
                        </div>
                        </div>
                        </div>
                        </div>

                          {/* Orders List */}
                        {filteredOrders.length === 0 ? (
                           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                No orders found
                             </h2>
                             <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {searchTerm || filterStatus !== 'all' 
                                  ? 'Try adjusting your filters'
                                  : "You haven't placed any orders yet"}
                             </p>
                             <Link
                              href="/" 
                              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                               Start Shopping
                               <ChevronRight className='h-5 w-5' />
                             </Link>
                           </div>
                        ) : (
                            <>
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {filteredOrders.map((order, index) => {
                                        const StatusIcon = statusIcons[order.status] || Package;
                                        return (
                                            <motion.div
                                             key={order._id}
                                             initial={{opacity: 0, y:20}}
                                             animate={{opacity:1, y: 0}}
                                             exit={{ opacity: 0, y: -20}}
                                             transition={{delay: index * 0.1}} >
                                                <Link href={`/orders/${order.orderId}`}>
                                                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className="text-sm fontmono text-gray-500 dark:text-gray-400">
                                                                    #{order.orderId}
                                                                </span>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                                                    <span className="flex items-center gap-1">
                                                                        <StatusIcon className="h-3 w-3" />
                                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                             <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                                <Calendar className="h-4 w-4" />
                                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                             </div>
                                                        </div>

                                                        <div className="mt-2 md:mt-0">
                                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                ${order.total.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                     {/* Order Items Preview */}
                                                     <div className="flex items-center gap-4 overflow-x-auto pb-2">
                                                        {order.items.slice(0,3).map((item, idx) => (
                                                          <div key={idx} className="flex items-center gap-2 shrink-0">
                                                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                                {item.image ? (
                                                                    <img 
                                                                     src={item.image}
                                                                     alt={item.name}
                                                                     className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <Package className="h-6 w-6 text-gray-400" />
                                                                    </div>

                                                                )}
                                                            </div>

                                                           <div>
                                                            <p className='text-sm font-medium text-gray-900 dark:text-white'>
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                Qty:{item.quantity}
                                                            </p>
                                        
                                                           </div>
                                                          </div>
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                +{order.items.length - 3} more
                                                            </div>
                                                        )}
                                                     </div>

                                                      {/* Estimated Delivery */}
                                                      {order.estimatedDelivery && (
                                                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Truck className="h-4 w-4 text-blue-600" />
                                                                <span className="font-medium text-gray-900 dark:text-white">
                                                                    {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                      )}
                                                 </div>
                                                </Link>
                                             </motion.div>
 
                                        )
                                    })}
                                </AnimatePresence>
                            </div>

                            {pagination.hasMore && (
                                <div className="mt-8 text-center">
                                    <button
                                      onClick={loadMore}
                                      disabled={loading}
                                      className='px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700
                                                 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50'>
                                        {loading ? 'Loading...' : 'load More Orders'}
                                    </button>
                                </div>
                            )}
                            </>
                        )}
                    </div>
                </div>
    )
}

export default OrderPage;