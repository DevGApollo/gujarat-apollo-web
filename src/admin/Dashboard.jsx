const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-blue-800">
        Admin Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        Manage website content from here
      </p>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold text-blue-700">Products</h2>
          <p className="text-gray-500 mt-2">Add / Edit Products</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold text-blue-700">Investors</h2>
          <p className="text-gray-500 mt-2">Upload Reports</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold text-blue-700">Messages</h2>
          <p className="text-gray-500 mt-2">View Contact Queries</p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;