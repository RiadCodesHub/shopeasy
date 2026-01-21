import ProductGrid from "@/src/components/products/ProductGrid";
import CategoryFilter from "@/app/products/CategoryFilter";

export default function ProductPage() {
    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold ">Our Products</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-10">
                Discover amazing products at great prices
            </p>
            <div className="flex flex-col items-center gap-8">
                <div className="w-full">
                    <CategoryFilter />
                </div>
                <div className="w-full">
                    <ProductGrid />
                </div>
            </div>
        </div>
    );
}