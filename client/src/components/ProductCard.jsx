import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/products/${product._id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      <div className="p-4">
        <p className="text-sm text-gray-500">
          {product.category}
        </p>

        <Link to={`/products/${product._id}`}>
          <h3 className="mt-1 text-lg font-semibold hover:underline">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 text-xl font-bold">
          ₹{product.price}
        </p>

        <p
          className={`mt-2 text-sm font-medium ${
            product.stock > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {product.stock > 0
            ? `${product.stock} in stock`
            : "Out of stock"}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;