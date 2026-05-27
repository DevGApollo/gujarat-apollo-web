const Products = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero */}
      <div className="bg-blue-800 text-white py-20 text-center">
        <h1 className="text-5xl font-bold">Our Products</h1>
        <p className="mt-4 text-gray-200">
          High-performance construction & mining equipment
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
          <h2 className="text-xl font-bold text-blue-700">
            Asphalt Paver
          </h2>
          <p className="mt-3 text-gray-600">
            Advanced road construction machine for smooth paving operations.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
          <h2 className="text-xl font-bold text-blue-700">
            Mobile Crusher
          </h2>
          <p className="mt-3 text-gray-600">
            High efficiency crushing solution for mining applications.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
          <h2 className="text-xl font-bold text-blue-700">
            Concrete Equipment
          </h2>
          <p className="mt-3 text-gray-600">
            Reliable machinery for modern construction needs.
          </p>
        </div>

      </div>

    </div>
  );
};

export default Products;