'use client';

import { useEffect, useState } from 'react';
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
import type { RootState } from '@/lib/store/store';

const statusColors = {
  pending: 'badge-warning',
  processing: 'badge-primary',
  shipped: 'badge-primary',
  delivered: 'badge-success',
  cancelled: 'badge-error',
  refunded: 'bg-(--background-tertiary) text-(--foreground-secondary)'
}

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  refunded: XCircle
}

const OrderPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { orders, loading, pagination } = useAppSelector((state: RootState) => state.orders);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push(`/auth/login?returnUrl=${encodeURIComponent('/orders')}`);
      return;
    }

    dispatch(fetchOrders({ page: 1 }));
  }, [session, status, dispatch, router]);

  const loadMore = () => {
    if (pagination.hasMore) {
      dispatch(fetchOrders({ page: pagination.currentPage + 1 }));
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchTerm === '' ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--background)">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-(--foreground-secondary)">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-(--background) py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-(--foreground) mb-2">
            My Orders
          </h1>
          <p className="text-(--foreground-secondary)">
            View and track your orders
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--foreground-tertiary)" />
                <input
                  type="text"
                  placeholder="Search by order ID or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="w-full md:w-auto">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--foreground-tertiary)" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input-field pl-10 pr-8 appearance-none cursor-pointer"
                >
                  <option value="all">All orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-(--foreground-tertiary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="card text-center p-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-(--background-tertiary) flex items-center justify-center">
              <Package className="h-12 w-12 text-(--foreground-tertiary)" />
            </div>
            <h2 className="text-2xl font-bold text-(--foreground) mb-2">
              No orders found
            </h2>
            <p className="text-(--foreground-secondary) mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : "You haven't placed any orders yet"}
            </p>
            <Link
              href="/"
              className="btn-primary inline-flex items-center gap-2"
            >
              Start Shopping
              <ChevronRight className="h-5 w-5" />
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
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/orders/${order.orderId}`}>
                        <div className="card-hover p-6">
                          {/* Order Header */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-mono text-(--foreground-secondary)">
                                  #{order.orderId}
                                </span>
                                <span className={`badge ${statusColors[order.status]}`}>
                                  <span className="flex items-center gap-1">
                                    <StatusIcon className="h-3 w-3" />
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-(--foreground-secondary)">
                                <Calendar className="h-4 w-4" />
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>

                            <div className="mt-2 md:mt-0">
                              <span className="text-2xl font-bold text-(--foreground)">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Order Items Preview */}
                          <div className="flex items-center gap-4 overflow-x-auto pb-2">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 shrink-0">
                                <div className="w-12 h-12 bg-(--background-tertiary) rounded-lg overflow-hidden">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="h-6 w-6 text-(--foreground-tertiary)" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-(--foreground)">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-(--foreground-tertiary)">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="text-sm text-(--foreground-tertiary)">
                                +{order.items.length - 3} more
                              </div>
                            )}
                          </div>

                          {/* Estimated Delivery */}
                          {order.estimatedDelivery && (
                            <div className="mt-4 pt-4 border-t border-(--border)">
                              <div className="flex items-center gap-2 text-sm">
                                <Truck className="h-4 w-4 text-primary" />
                                <span className="text-(--foreground-secondary)">Estimated delivery:</span>
                                <span className="font-medium text-(--foreground)">
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
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Load More Button */}
            {pagination.hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Orders'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderPage;