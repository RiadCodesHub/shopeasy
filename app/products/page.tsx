import ProductGrid from "@/src/components/products/ProductGrid";
import CategoryFilter from "@/app/products/CategoryFilter";

export default function ProductPage() {
 return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        <div className="flex gap-8">
            <aside className="w-1/4">
                <CategoryFilter />
            </aside>
            <div className="w-3/4">
            <ProductGrid />
            </div>
        </div>
    </div>
 );
}