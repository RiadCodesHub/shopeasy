'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { useAppDispatch } from '@/lib/store/hooks';
import { addToCart } from '@/lib/store/slices/cartSlice';
import { Product } from '@/lib/store/slices/productSlice';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="rounded-xl shadow-md border bg-bg-secondary border-border overflow-hidden group transition"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-warning text-white">
              Low Stock
            </span>
          )}

          {product.stock === 0 && (
            <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-border-dark text-white">
              Out of Stock
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-lg text-text hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          <span className="text-sm px-2 py-1 rounded-full bg-bg-tertiary text-text-secondary">
            {product.category}
          </span>
        </div>

        <p className="text-sm mb-3 line-clamp-2 text-text-secondary">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-warning fill-warning'
                    : 'text-border'
                }`}
              />
            ))}
          </div>

          <span className="ml-2 text-sm text-text-secondary">
            ({product.rating.toFixed(1)})
          </span>
        </div>

        {/* Price + Button */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>

            {product.originalPrice && (
              <span className="block text-sm line-through text-text-tertiary">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}

            {product.discount && (
              <span className="block text-sm text-success">
                Save {product.discount}%
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              product.stock === 0
                ? 'bg-bg-tertiary text-text-tertiary cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark text-white'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;