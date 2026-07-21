import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 md:pl-72">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-6 text-center">

        <p>
          Geolocation-Based Smart Attendance Management System
        </p>

        {/* <p>
          Developed by <strong>ONI Damilola Olagoke</strong>
        </p> */}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/privacy"
            className="transition hover:text-blue-600 hover:underline"
          >
            Privacy Policy
          </Link>

          <Link
            to="/help"
            className="transition hover:text-blue-600 hover:underline"
          >
            Help
          </Link>

          <Link
            to="/release-notes"
            className="transition hover:text-blue-600 hover:underline"
          >
            Release Notes
          </Link>

          <Link
            to="/system-status"
            className="transition hover:text-blue-600 hover:underline"
          >
            System Status
          </Link>

          <Link
            to="/about"
            className="transition hover:text-blue-600 hover:underline"
          >
            About
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span>
            © {new Date().getFullYear()} Syndeco Technologies.
          </span>

          <span>
            All rights reserved.
          </span>

          <span>•</span>

          <span>
            RadX v2.5.2
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;