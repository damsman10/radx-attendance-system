import { useEffect, useMemo, useState } from "react";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import {
  Trophy,
  Medal,
} from "lucide-react";

import { db } from "../firebase";



export default function Leaderboard(){


  const [submissions,setSubmissions] = useState([]);

  const [loading,setLoading] = useState(true);

  const [selectedCourse,setSelectedCourse] = useState("");

  const [selectedChallenge,setSelectedChallenge] = useState("");





  useEffect(()=>{


    const unsubscribe = onSnapshot(

      collection(
        db,
        "challengeSubmissions"
      ),


      (snapshot)=>{


        const data =
        snapshot.docs.map(doc=>({

          id:doc.id,

          ...doc.data()

        }));


        setSubmissions(data);

        setLoading(false);


      },


      (error)=>{

        console.log(error);

        setLoading(false);

      }

    );



    return unsubscribe;


  },[]);







  const courses = useMemo(()=>{


    return [

      ...new Set(

        submissions.map(
          item=>item.courseCode
        )

      )

    ];


  },[submissions]);






  useEffect(()=>{


    if(!selectedCourse && courses.length){

      setSelectedCourse(
        courses[0]
      );

    }


  },[
    courses,
    selectedCourse
  ]);








  const challenges = useMemo(()=>{


    return [

      ...new Map(

        submissions

        .filter(
          item =>
          item.courseCode === selectedCourse
        )

        .map(item=>[

          item.challengeId,

          {

            id:item.challengeId,

            title:item.challengeTitle

          }

        ])

      ).values()


    ];


  },[
    submissions,
    selectedCourse
  ]);







  useEffect(()=>{


    if(challenges.length){

      setSelectedChallenge(
        challenges[0].id
      );

    }
    else{

      setSelectedChallenge("");

    }


  },[
    selectedCourse,
    challenges
  ]);









  const leaderboard = useMemo(()=>{


    const students = {};



    submissions

    .filter(
      item =>
      item.courseCode === selectedCourse &&
      item.challengeId === selectedChallenge
    )

    .forEach(item=>{


      const id =
      item.studentId;



      if(!students[id]){


        students[id]={

          studentId:id,

          name:
          item.studentName || "Student",

          points:0,

          totalPoints:
          item.totalPoints || 0

        };


      }



      students[id].points +=
      item.score || 0;



    });





    return Object.values(students)

    .sort(
      (a,b)=>
      b.points-a.points
    )

    .map((student,index)=>({

      ...student,

      rank:index+1

    }));



  },[
    submissions,
    selectedCourse,
    selectedChallenge
  ]);









return (

<div className="
space-y-8
p-4
sm:p-6
">



<div>

<h1 className="
text-3xl
font-bold
dark:text-white
">

Leaderboard

</h1>


<p className="
mt-2
text-gray-500
">

Rank students by individual challenge performance.

</p>


</div>








<div className="
grid
gap-4
md:grid-cols-2
">


<div className="
rounded-2xl
bg-white
p-5
shadow
dark:bg-gray-900
">


<label className="
text-sm
text-gray-500
">

Course

</label>


<select

value={selectedCourse}

onChange={(e)=>{

setSelectedCourse(e.target.value);

}}

className="
mt-2
w-full
rounded-xl
border
p-3
dark:bg-gray-800
dark:text-white
"

>

{
courses.map(course=>(

<option
key={course}
value={course}
>

{course}

</option>

))

}


</select>


</div>








<div className="
rounded-2xl
bg-white
p-5
shadow
dark:bg-gray-900
">


<label className="
text-sm
text-gray-500
">

Challenge

</label>


<select

value={selectedChallenge}

onChange={(e)=>
setSelectedChallenge(
e.target.value
)
}

className="
mt-2
w-full
rounded-xl
border
p-3
dark:bg-gray-800
dark:text-white
"

>

{
challenges.map(challenge=>(

<option

key={challenge.id}

value={challenge.id}

>

{challenge.title}

</option>

))

}


</select>


</div>



</div>








{
loading ? (

<p>
Loading leaderboard...
</p>


)

:

leaderboard.length===0 ? (


<div className="
rounded-2xl
bg-white
p-8
text-center
shadow
dark:bg-gray-900
">

No submissions yet for this challenge.


</div>


)

:


<div className="
rounded-3xl
bg-white
shadow
dark:bg-gray-900
overflow-hidden
">


<div className="
bg-gray-50
p-5
dark:bg-gray-800
">

<h2 className="
font-bold
dark:text-white
">

{
challenges.find(
item=>item.id===selectedChallenge
)?.title
}

</h2>

</div>





{
leaderboard.map(student=>(


<div

key={student.studentId}

className="
flex
items-center
justify-between
border-b
p-5
dark:border-gray-800
"

>


<div className="
flex
items-center
gap-4
">


<div className="
flex
h-10
w-10
items-center
justify-center
rounded-full
bg-yellow-100
text-yellow-700
">

{
student.rank <=3
?
<Medal size={20}/>
:
student.rank
}

</div>



<div>

<p className="
font-semibold
dark:text-white
">

{student.name}

</p>


<p className="
text-sm
text-gray-500
">

Rank #{student.rank}

</p>


</div>


</div>






<div className="
flex
items-center
gap-2
font-bold
text-blue-600
">

<Trophy size={18}/>

{student.points}/{student.totalPoints}

</div>



</div>


))

}


</div>


}



</div>


);


}
