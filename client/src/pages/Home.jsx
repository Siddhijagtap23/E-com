import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <section className="bg-gray-100 px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Shop Everything You Love
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Discover quality products across electronics, fashion, and shoes.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">
            Shop by Category
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border p-8 text-center shadow-sm">
              <h3 className="text-xl font-semibold">
                Electronics
              </h3>
              <p className="mt-2 text-gray-600">
                Explore the latest electronic products.
              </p>
            </div>

            <div className="rounded-xl border p-8 text-center shadow-sm">
              <h3 className="text-xl font-semibold">
                Fashion
              </h3>
              <p className="mt-2 text-gray-600">
                Find products for your everyday style.
              </p>
            </div>

            <div className="rounded-xl border p-8 text-center shadow-sm">
              <h3 className="text-xl font-semibold">
                Shoes
              </h3>
              <p className="mt-2 text-gray-600">
                Discover shoes for every occasion.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;