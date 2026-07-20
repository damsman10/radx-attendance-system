import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../src/firebase";

export default function SignupForm() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  // Lecturer fields
  const [staffId, setStaffId] = useState("");
  const [institution, setInstitution] = useState("");
  const [phone, setPhone] = useState("");

  // Student fields
  const [matricNumber, setMatricNumber] = useState("");
  const [level, setLevel] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName,
      });

      if (role === "lecturer") {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          fullName,
          email,
          staffId,
          institution,
          department,
          phone,
          role: "lecturer",
          createdAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          fullName,
          email,
          matricNumber,
          department,
          level,
          role: "student",
          createdAt: serverTimestamp(),
        });
      }

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full px-8 md:px-12 overflow-y-auto">
      <div className="max-w-lg w-full mx-auto">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xl font-bold">R</span>
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
          Create Account
        </h1>

        <p className="text-gray-500 text-sm mt-1 mb-5">
          Register for the RadX Attendance System.
        </p>

        <form onSubmit={handleSignUp} className="space-y-3">

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Register As
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
            </select>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

                    {/* Lecturer Fields */}
          {role === "lecturer" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Staff ID
                  </label>

                  <input
                    type="text"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    placeholder="CS/LECT/001"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required={role === "lecturer"}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Institution
                  </label>

                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="University Name"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required={role === "lecturer"}
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Department
                  </label>

                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="080..."
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

              </div>
            </>
          )}

          {/* Student Fields */}
          {role === "student" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Matric Number
                  </label>

                  <input
                    type="text"
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value)}
                    placeholder="CSC/2024/001"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required={role === "student"}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Level
                  </label>

                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required={role === "student"}
                  >
                    <option value="">Select Level</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="PGD">PGD</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Department
                </label>

                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Computer Science"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {success && (
            <p className="text-green-600 text-sm">{success}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading
              ? "Creating account..."
              : `Create ${role === "lecturer" ? "Lecturer" : "Student"} Account`}
          </button>

          <p className="text-center text-sm text-gray-500 pt-2">
            Already registered?

            <a
              href="/login"
              className="text-blue-600 font-medium ml-1 hover:underline"
            >
              Login
            </a>
          </p>

        </form>

      </div>
    </div>
  );
}