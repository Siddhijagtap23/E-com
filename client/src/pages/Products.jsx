import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getCategories, getProducts } from "../api/products";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {};

        if (selectedCategory !== "All") {
          params.category = selectedCategory;
        }

        if (search.trim()) {
          params.search = search.trim();
        }

        const data = await getProducts(params);

        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);

        setError("Unable to load products. Please try again.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadProducts();
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedCategory, search]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Product Catalog
          </h1>

          <p className="mt-2 text-gray-600">
            Browse our latest products.
          </p>
        </div>

        {/* Search */}
        <div className="mt-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 sm:max-w-md"
          />
        </div>

        {/* Categories */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`rounded-full px-5 py-2 text-sm font-medium ${
              selectedCategory === "All"
                ? "bg-black text-white"
                : "border bg-white text-gray-700"
            }`}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category._id || category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`rounded-full px-5 py-2 text-sm font-medium ${
                selectedCategory === category.name
                  ? "bg-black text-white"
                  : "border bg-white text-gray-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-xl border bg-white"
              >
                <div className="aspect-square bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-1/3 rounded bg-gray-200" />
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-5 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold">
              No products found
            </h2>

            <p className="mt-2 text-gray-600">
              Try a different search or category.
            </p>
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Products;