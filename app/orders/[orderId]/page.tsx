'use client';

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchOrderById, clearCurrentOrder } from "@/lib/store/slices/orderSlice";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation"; 
import Link from "next/link";
import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  CreditCard,
  ChevronLeft,
  Download,
  Printer,
} from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

export default function OrderDetailsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId as string;
  const { data: session, status: sessionStatus } = useSession();
  const { currentOrder: order, loading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (sessionStatus === 'loading') return;

    if (!session) {
      router.push(`/auth/login?returnUrl=${encodeURIComponent(`/orders/${params.orderId}`)}`);
      return;
    }

    dispatch(fetchOrderById(orderId));
    
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [session, sessionStatus, dispatch, orderId, router]);

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

    if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link
            href='/orders'
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href='/orders'
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Order #{order.orderId}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Printer className="h-5 w-5" />
              </button>
              <button
                onClick={() => {}}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Order Status
              </p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            {order.trackingNumber && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Tracking Number
                </p>
                <p className="font-mono text-gray-900 dark:text-white">
                  {order.trackingNumber}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items
          </h2>

          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Quantity: {item.quantity}
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Information
            </h2>
            <div className="space-y-3">
              <p className="text-gray-900 dark:text-white font-medium">
                {order.customerInfo.firstName} {order.customerInfo.lastName}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {order.shippingAddress.street} <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode} <br />
                {order.shippingAddress.country}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Phone: {order.customerInfo.phone}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Method: {order.shippingMethod === 'standard' ? 'Standard Shipping' : 'Express Shipping'}
              </p>
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400">
                Payment Method: {order.paymentMethod.replace('-', ' ').toUpperCase()}
              </p>
              {order.lastFourDigits && (
                <p className="text-gray-600 dark:text-gray-400">
                  Card ending in **** {order.lastFourDigits}
                </p>
              )}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                  <span className="text-gray-900 dark:text-white">
                    {order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                  <span className="text-gray-900 dark:text-white">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total:</span>
                  <span className="text-lg font-bold text-blue-600">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Need Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Need help with this order?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Contact our support team for assistance with your order
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </Link>
        </motion.div>
      </div>
    </div>
  );
}