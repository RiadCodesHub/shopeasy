'use client';
import { motion } from 'framer-motion';
import {Facebook, Twitter, Instagram, Linkedin, CreditCard, Mail, Phone, MapPin} from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="container mx-auto px-4 py-12">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div
                  initial={{ opacity:0, y: 20}}
                  whileInView={{ opacity: 1, y:0}}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                    <h3 className="text-2xl font-bold mb-4">
                     Prime <span className="text-yellow-400">Cart</span>
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Your trusted online shopping destination offering premium products 
                        with exceptional service and first delivary.
                    </p>
                <div className="flex gap-4">
                    {[Facebook, Twitter,Instagram, Linkedin].map((Icon, index) => 
                        (
                            <motion.a 
                            key={index}
                            whileHover={{ scale: 1.1, y: -3}}
                            href='#'
                            className='p-2 bg-gray-800 rounded-lg hover:bg-primary transition-colors'
                            >
                                <Icon className='h-5 w-5' />
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
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5" />
                <span>017-780-017-982</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>support@shopeasy.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="h-5 w-5" />
                <span>123 Shopping St, New York</span>
              </li>
            </ul>
          </motion.div>

          {/* Payment Methods */}
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
                  className="p-3 bg-gray-800 rounded-lg flex items-center justify-center"
                >
                  <CreditCard className="h-8 w-8" />
                </motion.div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Secure & Encrypted</p>
              <p className="text-xs text-gray-500">
                All transactions are secured with 256-bit SSL encryption
              </p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} ShopEasy. All rights reserved.
          </p>
          
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const quickLinks = [
  { name: 'About Us', href: '/about', icon: null },
  { name: 'Contact', href: '/contact', icon: null },
  { name: 'FAQ', href: '/faq', icon: null },
  { name: 'Shipping Policy', href: '/shipping', icon: null },
  { name: 'Return Policy', href: '/returns', icon: null },
  { name: 'Careers', href: '/careers', icon: null },
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