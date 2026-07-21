import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Menu,
  ChevronDown,
  User,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import colorlogo from "../assets/colorlogo.png";


const Topbar = ({ sidebarOpen, setSidebarOpen }) => {

  const { profile, logout } = useAuth();

  const navigate = useNavigate();

  const dropdownRef = useRef(null);


  const [dropdownOpen, setDropdownOpen] = useState(false);


  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });



  const userName = profile?.fullName || "User";


  const role =
    profile?.role === "lecturer"
      ? "Lecturer Portal"
      : "Student Portal";



  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
      ? "Good afternoon"
      : "Good evening";





  useEffect(() => {

    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

  }, [isDark]);





  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }

    };


    const handleEscape = (event) => {

      if (event.key === "Escape") {
        setDropdownOpen(false);
      }

    };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };


  }, []);





  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };





  const handleLogout = async () => {

    try {

      await logout();

    } catch(error) {

      console.error(error);

    }

  };







  return (

    <header
      className="
      h-20
      flex
      items-center
      md:pl-72
      px-4
      sm:px-6
      bg-white
      dark:bg-[#1E293B]
      border-b
      border-gray-200
      dark:border-gray-700
      shadow-sm
      "
    >




      {/* LEFT SIDE */}

      <div
        className="
        flex
        items-center
        gap-3
        flex-1
        min-w-0
        "
      >


        <button

          aria-label="Open sidebar"

          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }

          className="
          lg:hidden
          text-gray-700
          dark:text-gray-300
          hover:text-blue-600
          transition
          "

        >

          <Menu size={26}/>

        </button>





        {/* Mobile Logo */}

        <img

          src={colorlogo}

          alt="RadX Attendance System"

          className="
          w-24
          object-contain
          md:hidden
          "

        />






        {/* Desktop Greeting */}

        <div
          className="
          hidden
          md:block
          leading-tight
          "
        >

          <p
            className="
            text-sm
            text-gray-500
            dark:text-gray-400
            "
          >
            {greeting}
          </p>


          <h1
            className="
            text-xl
            font-semibold
            text-gray-800
            dark:text-white
            "
          >
            {userName}
          </h1>


        </div>


      </div>








      {/* DESKTOP CENTER BRAND */}

      <div
        className="
        hidden
        md:flex
        flex-1
        justify-center
        "
      >

        <div className="text-center">


          <h2
            className="
            text-lg
            font-semibold
            tracking-wide
            text-gray-800
            dark:text-white
            "
          >
            RadX Attendance System
          </h2>


          <p
            className="
            text-xs
            text-gray-500
            dark:text-gray-400
            "
          >
            {role}
          </p>


        </div>


      </div>









      {/* RIGHT USER MENU */}

      <div
        ref={dropdownRef}
        className="
        relative
        flex
        justify-end
        flex-shrink-0
        "
      >



        <button

          aria-label="Open user menu"

          onClick={() =>
            setDropdownOpen(prev => !prev)
          }


          className="
          flex
          items-center
          gap-2
          text-gray-700
          dark:text-gray-200
          hover:text-blue-600
          transition
          "

        >


          <span
            className="
            hidden
            sm:block
            max-w-[120px]
            truncate
            font-medium
            "
          >
            {userName}
          </span>



          <ChevronDown

            size={18}

            className={`
            transition-transform
            ${
              dropdownOpen
                ? "rotate-180"
                : ""
            }
            `}

          />

        </button>






        {dropdownOpen && (

          <div
            className="
            absolute
            right-0
            top-10
            mt-3
            w-56
            rounded-xl
            bg-white
            dark:bg-gray-800
            shadow-lg
            border
            border-gray-200
            dark:border-gray-700
            overflow-hidden
            z-50
            "
          >


            <button

              onClick={() => {

                navigate("/profile");

                setDropdownOpen(false);

              }}

              className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              text-left
              text-gray-700
              dark:text-gray-200
              hover:bg-gray-100
              dark:hover:bg-gray-700
              "

            >

              <User size={18}/>

              Profile

            </button>






            <button

              onClick={toggleDarkMode}

              className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              text-gray-700
              dark:text-gray-200
              hover:bg-gray-100
              dark:hover:bg-gray-700
              "

            >

              {isDark
                ? <Sun size={18}/>
                : <Moon size={18}/>
              }


              {isDark
                ? "Light Mode"
                : "Dark Mode"
              }


            </button>







            <button

              onClick={handleLogout}

              className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              text-left
              text-red-600
              hover:bg-red-50
              dark:hover:bg-red-900/20
              "

            >

              <LogOut size={18}/>

              Logout


            </button>



          </div>

        )}


      </div>



    </header>

  );

};


export default Topbar;
