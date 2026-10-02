function Footer() {
  return (
    <footer className="mt-16 bg-gray-900 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-3">
          
          <div>
            <h2 className="text-xl font-bold">E-Commerce</h2>
            <p className="mt-2 text-sm text-gray-400">
              Shop quality products at your convenience.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Quick Links</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-400">
              <p>Home</p>
              <p>Products</p>
              <p>Login</p>
              <p>Register</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Categories</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-400">
              <p>Electronics</p>
              <p>Fashion</p>
              <p>Shoes</p>
            </div>
          </div>

        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          © 2026 E-Commerce. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;