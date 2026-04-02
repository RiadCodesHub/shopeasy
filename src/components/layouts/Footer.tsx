'use client';
import { motion } from 'framer-motion';
import {Facebook, Twitter, Instagram, Linkedin, CreditCard, Mail, Phone, MapPin} from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--background-secondary)] text-[var(--foreground)] mt-16 border-t border-[var(--border)]">
      <div className="container mx-auto px-4 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">
              Shop<span className="text-gradient">Easy</span>
            </h3>

            <p className="text-[var(--foreground-secondary)] mb-6">
              Your trusted online shopping destination offering premium products
              with exceptional service and fast delivery.
            </p>

            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  whileHover={{ scale: 1.1, y: -3 }}
                  href="#"
                  className="p-2 rounded-lg bg-[var(--background-tertiary)] hover:bg-primary text-[var(--foreground-secondary)] hover:text-white transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="nav-link flex items-center gap-2">
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-[var(--foreground-secondary)]">
                <Phone className="h-5 w-5 text-primary" />
                <span>017-780-017-982</span>
              </li>

              <li className="flex items-center gap-3 text-[var(--foreground-secondary)]">
                <Mail className="h-5 w-5 text-primary" />
                <span>support@shopeasy.com</span>
              </li>

              <li className="flex items-center gap-3 text-[var(--foreground-secondary)]">
                <MapPin className="h-5 w-5 text-primary" />
                <span>123 Shopping St, New York</span>
              </li>
            </ul>
          </motion.div>

          {/* Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">We Accept</h4>

            <div className="grid grid-cols-3 gap-4">
              {paymentMethods.map((method, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="p-3 rounded-lg bg-[var(--background-tertiary)] flex items-center justify-center border border-[var(--border)]"
                >
                  <CreditCard className="h-8 w-8 text-primary" />
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-lg bg-[var(--background-tertiary)] border border-[var(--border)]">
              <p className="text-sm text-[var(--foreground-secondary)] mb-2">
                Secure & Encrypted
              </p>
              <p className="text-xs text-[var(--foreground-tertiary)]">
                All transactions are secured with 256-bit SSL encryption
              </p>
            </div>
          </motion.div>

        </div>

        {/* Divider */}
        <div className="divider"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-[var(--foreground-secondary)] text-sm">
            © {currentYear} ShopEasy. All rights reserved.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="nav-link text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="nav-link text-sm">
              Terms of Service
            </Link>
            <Link href="/cookies" className="nav-link text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>

      </div>
    </footer> 
  )}


const quickLinks = [
  { name: 'About Us', href: '/', icon: null },
  { name: 'Contact', href: '/', icon: null },
  { name: 'FAQ', href: '/', icon: null },
  { name: 'Shipping Policy', href: '/', icon: null },
  { name: 'Return Policy', href: '/', icon: null },
  { name: 'Careers', href: '/', icon: null },
];

const paymentMethods = [
  { name: 'Visa' },
  { name: 'MasterCard' },
  { name: 'PayPal' },
  { name: 'Apple Pay' },
  { name: 'Google Pay' },
  { name: 'Stripe' },
];

export default Footer;