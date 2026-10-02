import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../api/products";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getProductById(id);
        setProduct(data.product);
      } catch (error) {
        console.error("Failed to load product:", error);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p className="text-gray-600">Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold">
          Product not found
        </h1>

        <p className="mt-2 text-gray-600">
          {error || "This product does not exist."}
        </p>

        <Link
          to="/products"
          className="mt-6 rounded-lg bg-black px-5 py-3 text-white"
        >
          Back to Products
        </Link>
      </main>
    );
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const outOfStock = product.stock <= 0;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/products"
          className="text-sm font-medium hover:underline"
        >
          ← Back to Products
        </Link>

        <div className="mt-8 grid gap-10 rounded-xl border bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
          
          {/* Product Image */}
          <div className="overflow-hidden rounded-xl bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full max-h-[500px] w-full object-cover"
            />
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-gray-500">
              {product.category}
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 text-2xl font-bold">
              ₹{product.price}
            </p>

            <p className="mt-6 leading-7 text-gray-600">
              {product.description}
            </p>

            {/* Stock */}
            <div className="mt-6">
              {outOfStock ? (
                <p className="font-semibold text-red-600">
                  Out of stock
                </p>
              ) : (
                <p className="font-semibold text-green-600">
                  {product.stock} items available
                </p>
              )}
            </div>

            {/* Quantity */}
            {!outOfStock && (
              <div className="mt-6">
                <p className="mb-2 font-medium">Quantity</p>

                <div className="flex w-fit items-center overflow-hidden rounded-lg border">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                    className="px-4 py-2 text-lg disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>

                  <span className="border-x px-5 py-2">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="px-4 py-2 text-lg disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Cart Button */}
            <button
              disabled={outOfStock}
              className="mt-8 w-full rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;