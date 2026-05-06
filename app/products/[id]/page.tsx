'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Truck, 
  Shield, 
  ArrowLeft,
  Minus,
  Plus,
  Share2,
  Package,
  RotateCcw,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { addToCart } from '@/lib/store/slices/cartSlice';
import { fetchProducts, Product } from '@/lib/store/slices/productSlice';
import Link from 'next/link';

interface ProductDetailPageProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
const { id } = params;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products, status } = useAppSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Fetch products if not loaded
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === 'succeeded' && products.length > 0 && id) {
      const foundProduct = products.find(p => String(p.id) === String(id));
      if (foundProduct) {
        setProduct(foundProduct);
        setLoading(false);
      } else {
        fetchProductDirectly(id);
      }
    } else if (status === 'failed') {
      setLoading(false);
    }
  }, [products, status, id]);

  const fetchProductDirectly = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    }));
  };

  const handleBuyNow = () => {
    if(!product) return;

    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    }));
    router.push('/checkout');
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (!product) return;
    
    const stock = product.stock || 10; 
    
    if (type === 'increase') {
      setQuantity(prev => Math.min(prev + 1, stock));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="card text-center max-w-md p-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
            <Package className="h-12 w-12 text-error" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-4">
            Product Not Found
          </h2>
          <p className="text-text-secondary mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            href="/"
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Get related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-bg">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center text-sm text-text-secondary">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/categories/${product.category}`} className="hover:text-primary transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-text font-medium truncate max-w-xs">
            {product.name}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <div className="relative h-96 md:h-125 rounded-2xl overflow-hidden bg-bg-tertiary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {(product.stock || 10) < 10 && (product.stock || 10) > 0 && (
                  <div className="absolute top-4 left-4 bg-warning text-white px-3 py-1 rounded-full text-sm font-medium">
                    Only {product.stock} left
                  </div>
                )}
                {(product.stock || 0) === 0 && (
                  <div className="absolute top-4 left-4 bg-error text-white px-3 py-1 rounded-full text-sm font-medium">
                    Out of Stock
                  </div>
                )}
              </div>
            </motion.div>

            {/* Thumbnail Images */}
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[product.image, product.image, product.image, product.image].map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Category and Rating */}
              <div className="flex items-center justify-between mb-4">
                <Link href={`/categories/${product.category}`}>
                  <span className="badge-primary hover:opacity-80 transition-opacity">
                    {product.category}
                  </span>
                </Link>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating || 0)
                            ? 'text-warning fill-warning'
                            : 'text-(--foreground-tertiary)'
                        }`}
                      />
                    ))]}
                  </div>
                  <span className="text-text-secondary">
                    ({(product.rating || 0).toFixed(1)}/5)
                  </span>
                </div>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-text-secondary mb-6 text-lg">
                {product.description || 'No description available'}
              </p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl font-bold text-text">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-text-secondary">
                  {(product.stock || 0) > 0 ? (
                    <span className="text-success font-medium">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      In Stock • {product.stock} available
                    </span>
                  ) : (
                    <span className="text-error font-medium">
                      Out of Stock
                    </span>
                  )}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <p className="text-text font-medium mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="h-4 w-4 text-text-secondary" />
                    </button>
                    <span className="w-12 text-center text-lg font-semibold text-text">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      disabled={quantity >= (product.stock || 10)}
                      className="p-3 hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="h-4 w-4 text-text-secondary" />
                    </button>
                  </div>
                  <p className="text-sm text-(--foreground-tertiary)">
                    {product.stock || 10} units available
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={(product.stock || 0) === 0}
                  className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                    (product.stock || 0) === 0
                      ? 'bg-bg-tertiary text-(--foreground-tertiary) cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  <ShoppingCart className="h-6 w-6" />
                  {(product.stock || 0) === 0 ? 'Out of Stock' : `Add to Cart (${quantity})`}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={(product.stock || 0) === 0}
                  className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                    (product.stock || 0) === 0
                      ? 'bg-bg-tertiary text-(--foreground-tertiary) cursor-not-allowed'
                      : 'btn-secondary'
                  }`}
                >
                  Buy Now
                  <ArrowLeft className="h-6 w-6 rotate-180" />
                </motion.button>
              </div>

              {/* Wishlist Button */}
              <div className="mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all ${
                    isFavorite
                      ? 'border-error text-error bg-error/10'
                      : 'border-border text-text-secondary hover:border-error/50 hover:text-error'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isFavorite ? 'fill-error' : ''}`} />
                  {isFavorite ? 'Added to Wishlist' : 'Add to Wishlist'}
                </motion.button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg border border-border">
                  <Truck className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold text-text">Free Shipping</p>
                    <p className="text-sm text-(--foreground-tertiary)">Orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg border border-border">
                  <RotateCcw className="h-6 w-6 text-success" />
                  <div>
                    <p className="font-semibold text-text">30-Day Returns</p>
                    <p className="text-sm text-(--foreground-tertiary)">Easy returns</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg border border-border">
                  <Shield className="h-6 w-6 text-accent" />
                  <div>
                    <p className="font-semibold text-text">Secure Payment</p>
                    <p className="text-sm text-(--foreground-tertiary)">100% secure</p>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-4">
                <p className="text-text-secondary">Share:</p>
                <button className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
                  <Share2 className="h-5 w-5 text-text-secondary" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-text">
                Related Products
              </h2>
              <Link
                href={`/categories/${product.category}`}
                className="text-primary hover:text-primary-dark font-medium flex items-center gap-2 transition-colors"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="group card-hover overflow-hidden"
                >
                  <Link href={`/products/${relatedProduct.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-text group-hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                          ${relatedProduct.price.toFixed(2)}
                        </span>
                        <span className="badge-primary text-sm">
                          {relatedProduct.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}