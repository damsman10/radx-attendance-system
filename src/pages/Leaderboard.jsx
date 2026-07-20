const Leaderboard = () => {
  const leaderboard = [
    {
      rank: 1,
      name: "John Adewale",
      points: 1250,
      badges: 8,
      challenges: 12,
      attendance: "98%",
    },
    {
      rank: 2,
      name: "Mary Okafor",
      points: 1100,
      badges: 6,
      challenges: 10,
      attendance: "95%",
    },
    {
      rank: 3,
      name: "David Ibrahim",
      points: 950,
      badges: 5,
      challenges: 9,
      attendance: "92%",
    },
    {
      rank: 4,
      name: "Sarah James",
      points: 820,
      badges: 4,
      challenges: 7,
      attendance: "89%",
    },
  ];

  return (
    <div className="space-y-8 p-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Leaderboard
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Monitor student engagement, achievements and performance rankings.
        </p>
      </div>


      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Total Participants
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            248
          </h2>
        </div>


        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Challenges Completed
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            320
          </h2>
        </div>


        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Badges Awarded
          </p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-600">
            86
          </h2>
        </div>


        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Points Distributed
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            12,450
          </h2>
        </div>

      </div>


      {/* Ranking Table */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow dark:bg-gray-900">

        <table className="w-full text-left">

          <thead className="border-b dark:border-gray-700">
            <tr>
              <th className="px-6 py-4">
                Rank
              </th>

              <th className="px-6 py-4">
                Student
              </th>

              <th className="px-6 py-4">
                Points
              </th>

              <th className="px-6 py-4">
                Badges
              </th>

              <th className="px-6 py-4">
                Challenges
              </th>

              <th className="px-6 py-4">
                Attendance
              </th>
            </tr>
          </thead>


          <tbody>

            {leaderboard.map((student) => (
              <tr
                key={student.rank}
                className="border-b last:border-none dark:border-gray-700"
              >

                <td className="px-6 py-4 font-bold">
                  #{student.rank}
                </td>


                <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">
                  {student.name}
                </td>


                <td className="px-6 py-4">
                  {student.points}
                </td>


                <td className="px-6 py-4">
                  {student.badges}
                </td>


                <td className="px-6 py-4">
                  {student.challenges}
                </td>


                <td className="px-6 py-4">
                  {student.attendance}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Leaderboard;