import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white pt-12 pb-6 mt-10">

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold">Gujarat Apollo</h2>
          <p className="mt-4 text-gray-300">
            Leading manufacturer of construction and mining equipment, 
            delivering quality engineering solutions across India.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold">Quick Links</h3>

          <ul className="mt-4 space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/investors" className="hover:text-white">Investors</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold">Contact</h3>

          <p className="mt-4 text-gray-300">
            Gujarat Apollo Industries Ltd.<br />
            Ahmedabad, Gujarat, India<br />
            Email: info@apollo.co.in
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="text-center text-gray-400 mt-10 border-t border-blue-800 pt-4">
        © {new Date().getFullYear()} Gujarat Apollo. All Rights Reserved.
      </div>

    </footer>
  );
};

export default Footer;