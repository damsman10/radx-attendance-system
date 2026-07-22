import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);


    try {

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );


      const user = userCredential.user;


      const userDoc = await getDoc(
        doc(db, "users", user.uid)
      );


      if (!userDoc.exists()) {
        setError("User profile not found.");
        return;
      }


      const userData = userDoc.data();


      if (userData.role === "lecturer") {

        navigate("/lecturer-dashboard");

      } 
      else if (userData.role === "student") {

        navigate("/student-dashboard");

      } 
      else {

        setError("Invalid user role.");

      }


    } catch (err) {

      console.log("LOGIN ERROR:", err);


      switch (err.code) {
      case "auth/invalid-credential":
        setError("Invalid email or password.");
        break;

      case "auth/invalid-email":
        setError("Please enter a valid email address.");
        break;

      case "auth/user-disabled":
        setError("This account has been disabled.");
        break;

      case "auth/user-not-found":
        setError("No account was found with this email address.");
        break;

      case "auth/wrong-password":
        setError("Incorrect password.");
        break;

      case "auth/too-many-requests":
        setError("Too many failed login attempts. Please try again later.");
        break;

      case "auth/network-request-failed":
        setError("Network error. Please check your internet connection.");
        break;

      default:
        setError("Unable to sign in. Please try again.");
    }


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="flex flex-col justify-center h-full px-8 md:px-14">

      <div className="max-w-md w-full mx-auto">


        {/* Logo */}
        <div className="flex items-center gap-3 mb-5">

          <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center">

            <span className="text-white text-xl font-bold">
              R
            </span>

          </div>


          <div>

            <h2 className="text-xl font-bold text-blue-600">
              RadX
            </h2>

            <p className="text-xs text-gray-500">
              Smart Attendance System
            </p>

          </div>

        </div>



        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back!
        </h1>


        <p className="text-gray-500 mt-2 mb-6">
          Sign in to continue to your account
        </p>



        <form onSubmit={handleLogin} className="space-y-5">


          <div>

            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email
            </label>


            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

          </div>



          <div>

            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>


            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

          </div>



          <div className="flex justify-between items-center text-sm">

            <label className="flex items-center gap-2 text-gray-600">

              <input type="checkbox" />

              Remember me

            </label>


            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </a>

          </div>



          {error && (

            <p className="text-red-500 text-sm">
              {error}
            </p>

          )}



          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-3 font-semibold text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >

            {loading ? "Logging in..." : "Login"}

          </button>



          <div className="mt-6 rounded-xl bg-blue-50 border border-blue-100 p-4">

            <p className="text-center text-sm text-gray-600">
              Don't have an account?

              <a
                href="/signup"
                className="ml-1 font-semibold text-blue-600 hover:underline"
              >
                Create one here.
              </a>

            </p>

          </div>


        </form>


      </div>

    </div>

  );

}