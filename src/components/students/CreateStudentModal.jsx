import { useState } from "react";
import { X } from "lucide-react";

export default function CreateStudentModal({
  onClose,
  onStudentCreated,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    matricNumber: "",
    department: "",
    level: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // We'll implement Firebase Auth + Firestore here next
    console.log(formData);

    setLoading(false);

    onStudentCreated?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-gray-900">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Create Student
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@email.com"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Matric Number */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Matric Number
            </label>

            <input
              type="text"
              name="matricNumber"
              value={formData.matricNumber}
              onChange={handleChange}
              required
              placeholder="CSC/2024/001"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Department */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Department
            </label>

            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              placeholder="Computer Science"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Level */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Level
            </label>

            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Level</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
              <option value="PGD">PGD</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-300 py-3 font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#3D78DA] py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}