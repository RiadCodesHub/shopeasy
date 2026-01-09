'use client';
import {motion} from 'framer-motion';
import { ArrowRight, Shield, Truck, Clock, Tag } from 'lucide-react';


const HeroSection = () => {
    return (
        <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 p-8 md:p-12">
            <div className="relative z-10 max-w-2xl">
                <motion.div
                initial={{ opacity: 0, y: 20}}
                animate={{ opacity:1, y: 0}}
                transition={{ duration: 0.6}} >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm md-6">
                     <Tag className="h-4 w-4" />
                     Black Friday Sale - Up to 70% off
                    </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Premium Shopping
                <span className="block text-yellow-300">Experience</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                 whileHover={{scale: 1.05}}
                 whileTap={{scale: 0.95}}
                 className='inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all'>
                    Shop Now
                    <ArrowRight className='h-5 w-5' />
                </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              View Deals
            </motion.button>                 
            </div>
                </motion.div>
            </div>
            <motion.div
            animate={{y:[0, -20, 0]}}
            transition={{
                duration : 3,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className='absolute top-10 right-20 opacity-20'
            >
                <ShoppingBag className="h-32 w-32 text-white" />
            </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 20}}
            animate={{ opacity:1, y: 0}}
            transition={{ duration: 0.6, delay:0.3}}
            className='mt-12 grid grid-cols-2 md:grid-cols-4 gap-4' >
                {features.map((feature, index) => (
                    <div className="flex items-center gap-3 text-white" key={index}>
                        <div className="p-2 rounded-lg bg-white/20">
                        {feature.icon}
                        </div>
                <div>
                    <p className="font-semibold">{feature.title}</p>
              <p className="text-sm text-white/80">{feature.description}</p>
                    </div>
                </div>
                ))}
            </motion.div>
        </section>
    );
};

const features = [
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Free Shipping",
    description: "On orders over $50"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Payment",
    description: "100% secure"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "24/7 Support",
    description: "Dedicated support"
  },
  {
    icon: <Tag className="h-6 w-6" />,
    title: "Best Price",
    description: "Guaranteed"
  }
];

const ShoppingBag = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

export default HeroSection;