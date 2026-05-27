const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow w-96">

        <h2 className="text-2xl font-bold text-center text-blue-800">
          Admin Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mt-6 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mt-4 rounded"
        />

        <button className="w-full bg-blue-700 text-white py-2 mt-6 rounded hover:bg-blue-800">
          Login
        </button>

      </div>

    </div>
  );
};

export default Login;
