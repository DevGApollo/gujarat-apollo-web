const About = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-blue-900 text-white py-20 text-center">
        <h1 className="text-5xl font-bold">About Gujarat Apollo</h1>
        <p className="mt-4 text-gray-200">
          Engineering excellence in construction & mining equipment
        </p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">

        <h2 className="text-3xl font-bold text-blue-800">
          Who We Are
        </h2>

        <p className="mt-4 text-gray-600 text-lg leading-relaxed">
          Gujarat Apollo Industries is a leading manufacturer of construction,
          mining and road equipment. With decades of experience, we deliver
          world-class engineering solutions trusted across India and global markets.
        </p>

        {/* Vision Mission */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">

          <div className="p-6 shadow rounded-xl bg-gray-50">
            <h3 className="text-xl font-semibold text-blue-700">Our Vision</h3>
            <p className="mt-3 text-gray-600">
              To become a global leader in infrastructure machinery innovation.
            </p>
          </div>

          <div className="p-6 shadow rounded-xl bg-gray-50">
            <h3 className="text-xl font-semibold text-blue-700">Our Mission</h3>
            <p className="mt-3 text-gray-600">
              Deliver high-quality, durable and efficient engineering products.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default About;