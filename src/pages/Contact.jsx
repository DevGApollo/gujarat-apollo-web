const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-blue-900 text-white py-20 text-center">
        <h1 className="text-5xl font-bold">Contact Us</h1>
        <p className="mt-4 text-gray-200">
          We are here to help you
        </p>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto bg-white p-8 mt-10 rounded-xl shadow">

        <form className="grid gap-6">

          <input
            type="text"
            placeholder="Your Name"
            className="border p-3 rounded"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="border p-3 rounded"
          />

          <textarea
            placeholder="Your Message"
            className="border p-3 rounded h-32"
          ></textarea>

          <button
            type="submit"
            className="bg-blue-700 text-white py-3 rounded hover:bg-blue-800"
          >
            Send Message
          </button>

        </form>

      </div>

    </div>
  );
};

export default Contact;