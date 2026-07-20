import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

export default function LocationTest() {

  const [lecturerLocation, setLecturerLocation] = useState(null);
  const [studentLocation, setStudentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState("");



  // Fetch active lecturer session location
  useEffect(() => {

    const unsubscribe = onSnapshot(
      query(
        collection(db, "attendanceSessions"),
        where("status", "==", "Active")
      ),

      (snapshot) => {

        if (!snapshot.empty) {

          const session = snapshot.docs[0].data();

          setLecturerLocation({

            latitude: session.latitude,
            longitude: session.longitude,
            radius: session.radius,
            venue: session.venue,
            courseCode: session.courseCode,

          });

        } else {

          setLecturerLocation(null);

        }

      },

      (err) => {
        console.log(err);
        setError("Unable to fetch lecturer location.");
      }

    );


    return unsubscribe;

  }, []);




  // Calculate distance between two GPS points
  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {

    const toRad = (value) =>
      (value * Math.PI) / 180;


    const R = 6371000;


    const dLat =
      toRad(lat2 - lat1);

    const dLon =
      toRad(lon2 - lon1);


    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);


    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );


    return R * c;

  };




  // Get student's current location
  const getStudentLocation = () => {

    setError("");

    if (!navigator.geolocation) {

      setError(
        "Geolocation is not supported."
      );

      return;

    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const location = {

          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,

          accuracy:
            position.coords.accuracy,

        };


        setStudentLocation(location);



        if (lecturerLocation) {

          const calculatedDistance =
            calculateDistance(

              lecturerLocation.latitude,
              lecturerLocation.longitude,

              location.latitude,
              location.longitude

            );


          setDistance(calculatedDistance);

        }

      },


      (err) => {

        console.log(err);

        setError(
          "Please allow location permission."
        );

      },


      {
        enableHighAccuracy: true,
        timeout: 10000,
      }

    );

  };




  return (

    <div className="space-y-6 p-6">

      <h1 className="text-3xl font-bold">
        Location Test
      </h1>


      {error && (

        <div className="rounded-xl bg-red-100 p-4 text-red-700">

          {error}

        </div>

      )}



      <button

        onClick={getStudentLocation}

        className="rounded-xl bg-blue-600 px-5 py-3 text-white"

      >

        Get My Location

      </button>




      <div className="rounded-2xl bg-white p-6 shadow">

        <h2 className="text-xl font-bold mb-4">
          Lecturer Location
        </h2>


        {lecturerLocation ? (

          <div className="space-y-2">

            <p>
              Course: {lecturerLocation.courseCode}
            </p>

            <p>
              Venue: {lecturerLocation.venue}
            </p>

            <p>
              Latitude:
              {lecturerLocation.latitude}
            </p>

            <p>
              Longitude:
              {lecturerLocation.longitude}
            </p>

            <p>
              Allowed Radius:
              {lecturerLocation.radius}m
            </p>

          </div>

        ) : (

          <p>
            No active session found.
          </p>

        )}

      </div>




      <div className="rounded-2xl bg-white p-6 shadow">

        <h2 className="text-xl font-bold mb-4">
          Student Location
        </h2>


        {studentLocation ? (

          <div className="space-y-2">

            <p>
              Latitude:
              {studentLocation.latitude}
            </p>

            <p>
              Longitude:
              {studentLocation.longitude}
            </p>

            <p>
              GPS Accuracy:
              {studentLocation.accuracy}m
            </p>

          </div>

        ) : (

          <p>
            Click the button to get your location.
          </p>

        )}

      </div>




      <div className="rounded-2xl bg-white p-6 shadow">

        <h2 className="text-xl font-bold mb-4">
          Distance Check
        </h2>


        {distance !== null ? (

          <>

            <p>
              Distance:
              {Math.round(distance)}m
            </p>


            <p>

              Status:

              {
                distance <= lecturerLocation?.radius

                ? " Inside Radius ✅"

                : " Outside Radius ❌"

              }

            </p>

          </>

        ) : (

          <p>
            Distance not calculated yet.
          </p>

        )}

      </div>


    </div>

  );

}