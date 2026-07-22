import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  Target,
  Trophy,
  CheckCircle2,
} from "lucide-react";


import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

import StudentChallengeModal from "../components/challenges/StudentChallengeModal";



export default function MyChallenges() {


  const { user } = useAuth();


  const [challenges,setChallenges] = useState([]);

  const [submissions,setSubmissions] = useState([]);

  const [loading,setLoading] = useState(true);

  const [selectedChallenge,setSelectedChallenge] = useState(null);







  useEffect(()=>{


    if(!user) return;



    const challengeQuery = query(

      collection(db,"challenges"),

      where(
        "status",
        "==",
        "Active"
      )

    );



    const unsubscribe = onSnapshot(

      challengeQuery,

      async(snapshot)=>{


        const challengeData =
        snapshot.docs.map(doc=>({

          id:doc.id,

          ...doc.data()

        }));


        setChallenges(challengeData);




        // Load student submissions

        const submissionQuery = query(

          collection(
            db,
            "challengeSubmissions"
          ),

          where(
            "studentId",
            "==",
            user.uid
          )

        );



        const submissionSnapshot =
        await getDocs(submissionQuery);



        const submissionData =
        submissionSnapshot.docs.map(doc=>({

          id:doc.id,

          ...doc.data()

        }));



        setSubmissions(submissionData);


        setLoading(false);


      },

      (error)=>{

        console.log(error);

        setLoading(false);

      }

    );



    return unsubscribe;


  },[user]);







  const completed =
  submissions.length;







  const totalPoints =
  submissions.reduce(

    (sum,item)=>
    sum + (item.score || 0),

    0

  );







  const hasCompleted=(challengeId)=>{

    return submissions.find(

      submission =>
      submission.challengeId === challengeId

    );

  };







return (

<div className="space-y-8 p-4 sm:p-6">



<section>

<h1 className="
text-3xl
font-bold
text-gray-900
dark:text-white
">

My Challenges

</h1>


<p className="
mt-2
text-gray-600
dark:text-gray-400
">

Complete challenges and earn points.

</p>


</section>








<section className="
grid
gap-5
sm:grid-cols-3
">



<div className="
rounded-2xl
bg-white
p-5
shadow
dark:bg-gray-900
">

<Target className="text-blue-600"/>


<p className="mt-3 text-sm text-gray-500">
Available Challenges
</p>


<h2 className="
text-3xl
font-bold
dark:text-white
">

{challenges.length}

</h2>


</div>







<div className="
rounded-2xl
bg-white
p-5
shadow
dark:bg-gray-900
">


<Trophy className="text-yellow-500"/>


<p className="mt-3 text-sm text-gray-500">
Points Earned
</p>


<h2 className="
text-3xl
font-bold
dark:text-white
">

{totalPoints}

</h2>


</div>







<div className="
rounded-2xl
bg-white
p-5
shadow
dark:bg-gray-900
">


<CheckCircle2 className="text-green-600"/>


<p className="mt-3 text-sm text-gray-500">
Completed
</p>


<h2 className="
text-3xl
font-bold
dark:text-white
">

{completed}

</h2>


</div>


</section>









<section>


<h2 className="
mb-4
text-xl
font-semibold
dark:text-white
">

Available Challenges

</h2>






{
loading ?


<p className="text-gray-500">
Loading challenges...
</p>


:

<div className="
grid
gap-5
md:grid-cols-3
">


{

challenges.map(challenge=>{


const submission =
hasCompleted(challenge.id);



return (

<div

key={challenge.id}

className="
rounded-2xl
bg-white
p-5
shadow
dark:bg-gray-900
"

>



<div className="
flex
justify-between
gap-3
">


<div>

<h3 className="
font-semibold
dark:text-white
">

{challenge.title}

</h3>


<p className="
mt-1
text-sm
text-gray-500
">

{challenge.courseCode}

</p>


</div>




<span className="
rounded-full
bg-blue-100
px-3
py-1
text-xs
font-medium
text-blue-700
">

+{challenge.totalPoints} pts

</span>


</div>








<div className="
mt-5
grid
grid-cols-2
gap-4
text-sm
">


<div>

<p className="text-gray-500">
Type
</p>

<p className="font-medium dark:text-white">
{challenge.challengeType}
</p>

</div>





<div>

<p className="text-gray-500">
Questions
</p>

<p className="font-medium dark:text-white">
{challenge.questions?.length || 0}
</p>

</div>



</div>








{
submission && (

<div className="
mt-4
rounded-xl
bg-green-50
p-3
text-sm
text-green-700
">

Completed - Score: {submission.score}/{submission.totalPoints}

</div>

)

}







<button

disabled={!!submission}

onClick={()=>setSelectedChallenge(challenge)}

className={`
mt-5
w-full
rounded-xl
py-2
text-white

${
submission

?

"bg-gray-400 cursor-not-allowed"

:

"bg-[#3D78DA] hover:bg-blue-700"

}

`}

>

{

submission

?

"Completed"

:

"Start Challenge"

}


</button>




</div>


)

})

}


</div>

}



</section>









{
selectedChallenge &&

<StudentChallengeModal

challenge={selectedChallenge}

onClose={()=>
setSelectedChallenge(null)
}

/>

}



</div>

);


}
