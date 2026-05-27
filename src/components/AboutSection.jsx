const AboutSection = () => {
  return (
    <div className="py-20 px-6 bg-white">
      
      <div className="max-w-6xl mx-auto text-center">
        
        <h2 className="text-4xl font-bold text-blue-800">
          About Gujarat Apollo
        </h2>

        <p className="mt-6 text-gray-600 text-lg">
          Gujarat Apollo Industries is a leading manufacturer of construction 
          and mining equipment, delivering world-class engineering solutions 
          across India and global markets.
        </p>

      </div>

      {/* Cards Section */}
      <div className="max-w-6xl mx-auto mt-12 grid md:grid-cols-3 gap-8">
        
        <div className="p-6 shadow-lg rounded-xl bg-gray-50">
          <h3 className="text-xl font-semibold text-blue-700">
            Our Vision
          </h3>
          <p className="mt-3 text-gray-600">
            To be a global leader in engineering excellence and innovation.
          </p>
        </div>

        <div className="p-6 shadow-lg rounded-xl bg-gray-50">
          <h3 className="text-xl font-semibold text-blue-700">
            Our Mission
          </h3>
          <p className="mt-3 text-gray-600">
            Deliver high-quality, durable and efficient machinery solutions.
          </p>
        </div>

        <div className="p-6 shadow-lg rounded-xl bg-gray-50">
          <h3 className="text-xl font-semibold text-blue-700">
            Our Strength
          </h3>
          <p className="mt-3 text-gray-600">
            Strong engineering team and decades of industrial experience.
          </p>
        </div>

      </div>

    </div>
  );
};

export default AboutSection;