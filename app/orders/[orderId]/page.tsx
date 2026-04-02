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
  pending: 'bg-warning/10 text-warning',
  processing: 'bg-info/10 text-info',
  shipped: 'bg-primary/10 text-primary',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-error/10 text-error',
  refunded: 'bg-[var(--background-tertiary)] text-[var(--foreground-secondary)]'
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
      router.push(`/auth/login?returnUrl=${encodeURIComponent(`/orders/${orderId}`)}`);
      return;
    }

    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
    
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [session, sessionStatus, dispatch, orderId, router]);

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-[var(--foreground-secondary)]">
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--background-tertiary)] flex items-center justify-center">
            <Package className="h-12 w-12 text-[var(--foreground-tertiary)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            Order Not Found
          </h2>
          <p className="text-[var(--foreground-secondary)] mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link
            href='/orders'
            className="btn-primary inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href='/orders'
            className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-primary transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                Order #{order.orderId}
              </h1>
              <p className="text-[var(--foreground-secondary)]">
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
                className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-tertiary)] transition-colors"
              >
                <Printer className="h-5 w-5 text-[var(--foreground-secondary)]" />
              </button>
              <button
                onClick={() => {}}
                className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-tertiary)] transition-colors"
              >
                <Download className="h-5 w-5 text-[var(--foreground-secondary)]" />
              </button>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--foreground-tertiary)] mb-1">
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
                <p className="text-sm text-[var(--foreground-tertiary)] mb-1">
                  Tracking Number
                </p>
                <p className="font-mono text-[var(--foreground)]">
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
          className="card mb-6"
        >
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Order Items
          </h2>

          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 py-4 border-b border-[var(--border)] last:border-0"
              >
                <div className="w-20 h-20 bg-[var(--background-tertiary)] rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-[var(--foreground-tertiary)]" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--foreground)]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-[var(--foreground-secondary)] mb-2">
                    Quantity: {item.quantity}
                  </p>
                  <p className="font-bold text-[var(--foreground)]">
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
            className="card"
          >
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Shipping Information
            </h2>
            <div className="space-y-3">
              <p className="text-[var(--foreground)] font-medium">
                {order.customerInfo.firstName} {order.customerInfo.lastName}
              </p>
              <p className="text-[var(--foreground-secondary)]">
                {order.shippingAddress.street} <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode} <br />
                {order.shippingAddress.country}
              </p>
              <p className="text-[var(--foreground-secondary)]">
                Phone: {order.customerInfo.phone}
              </p>
              <p className="text-[var(--foreground-secondary)]">
                Method: {order.shippingMethod === 'standard' ? 'Standard Shipping' : 'Express Shipping'}
              </p>
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Information
            </h2>
            <div className="space-y-3">
              <p className="text-[var(--foreground-secondary)]">
                Payment Method: {order.paymentMethod?.replace('-', ' ').toUpperCase()}
              </p>
              {order.lastFourDigits && (
                <p className="text-[var(--foreground-secondary)]">
                  Card ending in **** {order.lastFourDigits}
                </p>
              )}
              <div className="divider"></div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-secondary)]">Subtotal:</span>
                  <span className="text-[var(--foreground)]">${order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-secondary)]">Shipping:</span>
                  <span className="text-[var(--foreground)]">
                    {order.shippingCost === 0 ? 'Free' : `$${order.shippingCost?.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-secondary)]">Tax:</span>
                  <span className="text-[var(--foreground)]">${order.tax?.toFixed(2)}</span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-[var(--foreground)]">Total:</span>
                  <span className="text-lg font-bold text-primary">${order.total?.toFixed(2)}</span>
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
          className="bg-info/10 border border-info/20 rounded-lg p-6 text-center"
        >
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            Need help with this order?
          </h3>
          <p className="text-[var(--foreground-secondary)] mb-4">
            Contact our support team for assistance with your order
          </p>
          <Link
            href="/contact"
            className="btn-primary inline-flex items-center gap-2"
          >
            Contact Support
          </Link>
        </motion.div>
      </div>
    </div>
  );
}