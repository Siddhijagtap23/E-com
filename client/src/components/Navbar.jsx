import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-bold"
        >
          E-Commerce
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="hover:text-gray-600">
            Home
          </Link>

          <Link to="/products" className="hover:text-gray-600">
            Products
          </Link>

          <Link to="/login" className="hover:text-gray-600">
            Login
          </Link>

          <Link to="/register" className="hover:text-gray-600">
            Register
          </Link>

          <Link to="/cart" className="relative">
            🛒
            <span className="absolute -right-3 -top-2 rounded-full bg-black px-2 py-0.5 text-xs text-white">
              0
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-md border px-3 py-2 md:hidden"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              onClick={closeMenu}
              className="hover:text-gray-600"
            >
              Home
            </Link>

            <Link
              to="/products"
              onClick={closeMenu}
              className="hover:text-gray-600"
            >
              Products
            </Link>

            <Link
              to="/login"
              onClick={closeMenu}
              className="hover:text-gray-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="hover:text-gray-600"
            >
              Register
            </Link>

            <Link
              to="/cart"
              onClick={closeMenu}
              className="flex items-center gap-2"
            >
              🛒 Cart
              <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">
                0
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;