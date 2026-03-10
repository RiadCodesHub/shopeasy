'use Client';

import {motion} from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { useAppDispatch } from '@/lib/store/hooks';
import { addToCart } from '@/lib/store/slices/cartSlice';
import { Product } from '@/lib/store/slices/productSlice';
import Link from 'next/link';

interface ProductCardProps {
    product: Product;
    index: number;
}

const ProductCard = ({product, index} : ProductCardProps) => {
    const dispatch = useAppDispatch();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
    }));
    };

    return (
        <motion.div
        initial={{opacity: 0, y:20}}
        animate={{ opacity:1, y:0}}
        transition={{ duration: 0.3, delay: index * 0.1}}
        whileHover={{ y: -5 }}
         className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group"
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
          {product.stock < 10 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
          </div>
 </Link>
<div className='p-4'>
<div className='flex justify-between items-start mb-2'>
 <Link href={`/products/${product.id}`}>
 <h3 className='font-semibold text-lg hover:text-primary transition-colors'>
 {product.name}    
</h3>
 </Link>
<span className='text-sm px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700'>
    {product.category}
</span>
</div>
<p className='text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2'>
    {product.description}
</p>

<div className='flex items-center mb-3'>
<div className='flex items-center'>
    {[...Array(5)].map((_, i) => (
        <Star
        key={i}
        className={`h-4 w-4 ${
            i < Math.floor(product.rating) 
            ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
        }`}
        />
))}
</div>
<span className='ml-2 text-sm text-gray-600 dark:text-gray-400'>
    ({product.rating.toFixed(1)})
</span>
</div>

<div className='flex justify-between items-center'>
    <div>
    <span className='text-2xl font-bold text-primary dark:text-blue-400'>
        ${product.price.toFixed(2)}
    </span>
    {product.originalPrice && (
        <span className='block text-sm text-gray-500 line-through'>
           ${product.originalPrice.toFixed(2)}
        </span> 
    )}
    {product.discount && (
        <span className="block text-sm text-green-600 dark:text-green-400">
            Save {product.discount }%
        </span>
    )}
    </div>

<motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              product.stock === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark text-white'
            }`}
>
    <ShoppingCart className='h-4 w-4'/>
        <span className='px-3 py-2'>Add</span>
</motion.button>

</div>
</div>
</motion.div>
    )
}

export default ProductCard