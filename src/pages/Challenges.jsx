const Challenges = () => {
  const challenges = [
    {
      title: "Software Engineering Quiz Challenge",
      course: "CSC401",
      participants: 68,
      points: 100,
      status: "Active",
      deadline: "20 July 2026",
    },
    {
      title: "Network Security Challenge",
      course: "CSC405",
      participants: 52,
      points: 80,
      status: "Completed",
      deadline: "15 July 2026",
    },
    {
      title: "Database Concepts Challenge",
      course: "CSC410",
      participants: 40,
      points: 50,
      status: "Draft",
      deadline: "25 July 2026",
    },
  ];

  return (
    <div className="space-y-8 p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Quiz Challenges
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Create and manage student engagement challenges.
          </p>
        </div>

        <button className="rounded-xl bg-[#3D78DA] px-5 py-3 font-medium text-white hover:bg-blue-700">
          + Create Challenge
        </button>

      </div>


      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Total Challenges
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            12
          </h2>
        </div>


        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Active Challenges
          </p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            4
          </h2>
        </div>


        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Participants
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            160
          </h2>
        </div>


        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Points Awarded
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            4,500
          </h2>
        </div>

      </div>


      {/* Challenges List */}
      <div className="grid gap-6 md:grid-cols-2">

        {challenges.map((challenge) => (

          <div
            key={challenge.title}
            className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900"
          >

            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {challenge.title}
                </h2>

                <p className="mt-1 text-gray-500">
                  {challenge.course}
                </p>
              </div>


              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  challenge.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : challenge.status === "Completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {challenge.status}
              </span>

            </div>


            <div className="mt-6 grid grid-cols-2 gap-4">

              <div>
                <p className="text-sm text-gray-500">
                  Participants
                </p>

                <p className="font-semibold">
                  {challenge.participants}
                </p>
              </div>


              <div>
                <p className="text-sm text-gray-500">
                  Reward Points
                </p>

                <p className="font-semibold">
                  {challenge.points}
                </p>
              </div>


              <div>
                <p className="text-sm text-gray-500">
                  Deadline
                </p>

                <p className="font-semibold">
                  {challenge.deadline}
                </p>
              </div>

            </div>


            <div className="mt-6 flex gap-3">

              <button className="flex-1 rounded-xl bg-[#3D78DA] py-2 text-white hover:bg-blue-700">
                View
              </button>

              <button className="flex-1 rounded-xl border border-gray-300 py-2 hover:bg-gray-50 dark:border-gray-700">
                Edit
              </button>

            </div>


          </div>

        ))}

      </div>

    </div>
  );
};

export default Challenges;