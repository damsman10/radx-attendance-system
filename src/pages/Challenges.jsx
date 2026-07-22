import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { Plus } from "lucide-react";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

import CreateChallengeModal from "../components/challenges/CreateChallengeModal";
import ChallengeDetailsModal from "../components/challenges/ChallengeDetailsModal";
import ChallengeResultsModal from "../components/challenges/ChallengeResultsModal";



const Challenges = () => {


  const { user } = useAuth();


  const [challenges, setChallenges] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const [resultChallenge, setResultChallenge] = useState(null);





  useEffect(() => {

    if (!user) return;


    const q = query(
      collection(db, "challenges"),
      where(
        "lecturerId",
        "==",
        user.uid
      )
    );



    const unsubscribe = onSnapshot(

      q,

      (snapshot)=>{


        const data = snapshot.docs.map(doc=>({

          id: doc.id,

          ...doc.data()

        }));


        setChallenges(data);

        setLoading(false);


      },


      (error)=>{

        console.log(error);

        setLoading(false);

      }

    );


    return unsubscribe;


  },[user]);








  const handleDeleteChallenge = async(id)=>{


    const confirmDelete =
      window.confirm(
        "Delete this challenge?"
      );


    if(!confirmDelete) return;



    try{


      await deleteDoc(

        doc(
          db,
          "challenges",
          id
        )

      );


    }
    catch(error){

      console.log(error);

    }


  };









  // const stats = useMemo(()=>{


  //   return {


  //     total:
  //     challenges.length,


  //     active:
  //     challenges.filter(
  //       item =>
  //       item.status === "Active"
  //     ).length,


  //     participants:
  //     challenges.reduce(
  //       (sum,item)=>
  //       sum + (item.participants || 0),
  //       0
  //     ),


  //     points:
  //     challenges.reduce(
  //       (sum,item)=>
  //       sum + (item.totalPoints || 0),
  //       0
  //     )


  //   };


  // },[challenges]);









return (

<div className="space-y-8 p-4 sm:p-6">



<div className="
flex
flex-col
gap-4
md:flex-row
md:items-center
md:justify-between
">


<div>

<h1 className="
text-3xl
font-bold
text-gray-800
dark:text-white
">

Quiz Challenges

</h1>


<p className="
mt-2
text-gray-600
dark:text-gray-300
">

Create and manage student engagement challenges.

</p>


</div>





<button

onClick={()=>
setShowModal(true)
}

className="
flex
items-center
justify-center
gap-2
rounded-xl
bg-[#3D78DA]
px-5
py-3
font-medium
text-white
hover:bg-blue-700
"

>

<Plus size={18}/>

Create Challenge

</button>



</div>









{/* <div className="
grid
gap-5
sm:grid-cols-2
lg:grid-cols-4
">


<StatCard
title="Total Challenges"
value={stats.total}
/>


<StatCard
title="Active Challenges"
value={stats.active}
/>


<StatCard
title="Participants"
value={stats.participants}
/>


<StatCard
title="Total Points"
value={stats.points}
/>


</div> */}








{
loading ? (

<p className="text-gray-500">
Loading challenges...
</p>


) : challenges.length === 0 ? (


<div className="
rounded-2xl
bg-white
p-8
text-center
shadow
dark:bg-gray-900
">

<h2 className="
text-xl
font-semibold
dark:text-white
">

No Challenges Created

</h2>


<p className="mt-2 text-gray-500">
Create your first challenge for students.
</p>


</div>


) : (


<div className="
grid
gap-5
md:grid-cols-3
">

{
challenges.map((challenge)=>(


<div
key={challenge.id}
className="
rounded-2xl
bg-white
p-5
shadow-sm
dark:bg-gray-900
"
>


<div className="
flex
items-start
justify-between
gap-3
">


<div>

<h2 className="
text-lg
font-bold
dark:text-white
">

{challenge.title}

</h2>


<p className="
mt-1
text-sm
text-gray-500
">

{challenge.courseCode}

</p>


</div>



<span
className={`
rounded-full
px-3
py-1
text-xs
font-medium

${
challenge.status==="Active"
?
"bg-green-100 text-green-700"
:
challenge.status==="Completed"
?
"bg-blue-100 text-blue-700"
:
"bg-gray-100 text-gray-700"
}

`}
>

{challenge.status}

</span>


</div>




<div className="
mt-4
grid
grid-cols-2
gap-3
">


<Info
label="Type"
value={challenge.challengeType}
/>


<Info
label="Participants"
value={challenge.participants || 0}
/>


<Info
label="Points"
value={challenge.totalPoints || 0}
/>


<Info
label="Deadline"
value={
challenge.deadline
?
challenge.deadline.toDate
?
challenge.deadline.toDate().toLocaleDateString()
:
challenge.deadline
:
"-"
}
/>


</div>






<div className="
mt-5
flex
gap-2
">


<button

onClick={() =>
setSelectedChallenge(challenge)
}

className="
flex-1
rounded-xl
bg-[#3D78DA]
py-2
text-sm
font-medium
text-white
hover:bg-blue-700
"

>

Manage

</button>





<button

onClick={() =>
setResultChallenge(challenge)
}

className="
flex-1
rounded-xl
bg-green-600
py-2
text-sm
font-medium
text-white
hover:bg-green-700
"

>

Results

</button>





<button

onClick={() =>
handleDeleteChallenge(challenge.id)
}

className="
rounded-xl
border
border-red-300
px-3
py-2
text-sm
font-medium
text-red-600
hover:bg-red-50
"

>

Delete

</button>



</div>





</div>


))

}


</div>


)

}










{
showModal && (

<CreateChallengeModal

onClose={() =>
setShowModal(false)
}

onChallengeCreated={() =>
setShowModal(false)
}

/>

)

}







{
selectedChallenge && (

<ChallengeDetailsModal

challenge={selectedChallenge}

onClose={() =>
setSelectedChallenge(null)
}

/>

)

}







{
resultChallenge && (

<ChallengeResultsModal

challenge={resultChallenge}

onClose={() =>
setResultChallenge(null)
}

/>

)

}






</div>

);


};









function StatCard({
title,
value
}){


return (

<div className="
rounded-2xl
bg-white
p-5
shadow
dark:bg-gray-900
">


<p className="text-gray-500">
{title}
</p>


<h2 className="
mt-2
text-3xl
font-bold
dark:text-white
">

{value}

</h2>


</div>

);


}









function Info({
label,
value
}){


return (

<div>

<p className="text-sm text-gray-500">
{label}
</p>


<p className="
font-semibold
dark:text-white
">

{value}

</p>


</div>

);


}





export default Challenges;
