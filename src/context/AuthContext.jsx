import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";

import { 
  doc, 
  getDoc 
} from "firebase/firestore";

import { auth, db } from "../firebase";


const AuthContext = createContext();



export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);



  const loadProfile = async (firebaseUser) => {

    if (!firebaseUser) {
      setProfile(null);
      return;
    }


    try {

      const userRef = doc(
        db,
        "users",
        firebaseUser.uid
      );


      const userSnap = await getDoc(userRef);


      if (userSnap.exists()) {

        setProfile({
          id: userSnap.id,
          ...userSnap.data(),
        });

      } else {

        setProfile(null);

      }


    } catch (error) {

      console.error(
        "Unable to load profile:",
        error
      );

      setProfile(null);

    }

  };





  useEffect(() => {


    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {


        setUser(firebaseUser);


        await loadProfile(firebaseUser);


        setLoading(false);

      }
    );



    return unsubscribe;


  }, []);






  const logout = async () => {

    try {

      await signOut(auth);

      setUser(null);

      setProfile(null);


    } catch (error) {

      console.error(
        "Logout failed:",
        error
      );

      throw error;

    }

  };





  return (

    <AuthContext.Provider
      value={{

        user,

        profile,

        loading,

        logout,

        refreshProfile: () => loadProfile(user),

      }}
    >

      {children}

    </AuthContext.Provider>

  );

}





export function useAuth() {

  return useContext(AuthContext);

}
