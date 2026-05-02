import ProductGrid from "@/components/products/ProductGrid";
import CategoryFilter from "../products/CategoryFilter";

export default function ProductPage() {
    return (
        <div className="min-h-screen bg-bg py-8">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">
                        Our Products
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Discover amazing products at great prices
                    </p>
                </div>
                
                {/* Content Section */}
                <div className="flex flex-col gap-8">
                    <div className="w-full">
                        <CategoryFilter />
                    </div>
                    <div className="w-full">
                        <ProductGrid />
                    </div>
                </div>
            </div>
        </div>
    );
}