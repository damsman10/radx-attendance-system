import { useAuth } from "../context/AuthContext";

import {
  User,
  Mail,
  Building2,
  GraduationCap,
  IdCard,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";


export default function Profile() {

  const { profile, user } = useAuth();


  const role =
    profile?.role
      ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
      : "User";


  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";


  return (

    <div className="p-4 sm:p-6">


      <div
        className="
        max-w-4xl
        mx-auto
        space-y-6
        "
      >


        {/* Profile Header */}

        <div
          className="
          rounded-2xl
          bg-white
          dark:bg-gray-900
          shadow
          overflow-hidden
          "
        >

          <div
            className="
            bg-gradient-to-r
            from-[#3D78DA]
            to-blue-600
            p-5
            sm:p-6
            flex
            flex-col
            sm:flex-row
            items-center
            sm:items-start
            gap-4
            "
          >


            <div
              className="
              h-16
              w-16
              sm:h-20
              sm:w-20
              rounded-full
              bg-white
              text-[#3D78DA]
              flex
              items-center
              justify-center
              text-xl
              sm:text-2xl
              font-bold
              shadow
              "
            >
              {initials}
            </div>



            <div
              className="
              text-white
              text-center
              sm:text-left
              "
            >


              <h1
                className="
                text-xl
                sm:text-2xl
                font-bold
                "
              >
                {profile?.fullName || "User"}
              </h1>


              <p className="text-blue-100 text-sm sm:text-base">
                {user?.email}
              </p>



              <span
                className="
                inline-flex
                mt-3
                px-3
                py-1
                rounded-full
                bg-white/20
                text-sm
                "
              >
                {role}
              </span>


            </div>


          </div>


        </div>





        {/* Account Details */}

        <div
          className="
          rounded-2xl
          bg-white
          dark:bg-gray-900
          shadow
          p-5
          sm:p-6
          "
        >

          <h2
            className="
            text-xl
            font-semibold
            dark:text-white
            mb-5
            "
          >
            Account Information
          </h2>



          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
            sm:gap-5
            "
          >


            <InfoCard
              icon={<User size={20}/>}
              label="Full Name"
              value={profile?.fullName}
            />



            <InfoCard
              icon={<Mail size={20}/>}
              label="Email"
              value={user?.email}
            />



            <InfoCard
              icon={<Building2 size={20}/>}
              label="Department"
              value={profile?.department}
            />



            <InfoCard
              icon={<ShieldCheck size={20}/>}
              label="Role"
              value={role}
            />



            {profile?.role === "student" && (

              <>

                <InfoCard
                  icon={<IdCard size={20}/>}
                  label="Matric Number"
                  value={profile?.matricNumber}
                />


                <InfoCard
                  icon={<GraduationCap size={20}/>}
                  label="Level"
                  value={profile?.level}
                />

              </>

            )}



            <InfoCard
              icon={<CalendarDays size={20}/>}
              label="Joined"
              value={
                profile?.createdAt?.toDate
                  ? profile.createdAt
                      .toDate()
                      .toLocaleDateString()
                  : "Not available"
              }
            />


          </div>


        </div>



      </div>


    </div>

  );

}





function InfoCard({ icon, label, value }) {

  return (

    <div
      className="
      flex
      gap-3
      items-center
      p-4
      rounded-xl
      bg-gray-50
      dark:bg-gray-800
      "
    >

      <div
        className="
        text-[#3D78DA]
        "
      >
        {icon}
      </div>



      <div>

        <p
          className="
          text-sm
          text-gray-500
          dark:text-gray-400
          "
        >
          {label}
        </p>



        <p
          className="
          font-medium
          text-gray-800
          dark:text-white
          break-words
          "
        >
          {value || "Not provided"}
        </p>


      </div>


    </div>

  );

}
