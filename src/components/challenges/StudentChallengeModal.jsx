import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

import ChallengeResultsModal from "./ChallengeResultsModal";


export default function StudentChallengeModal({
  challenge,
  onClose,
}) {


  const { user, profile } = useAuth();


  const questions = challenge.questions || [];


  const [currentIndex,setCurrentIndex] = useState(0);

  const [answers,setAnswers] = useState({});

  const [submitting,setSubmitting] = useState(false);

  const [result,setResult] = useState(null);



  const currentQuestion = questions[currentIndex];



  const handleAnswer = (value)=>{

    setAnswers(prev=>({
      ...prev,
      [currentIndex]: value
    }));

  };





  const nextQuestion = ()=>{

    if(currentIndex < questions.length - 1){

      setCurrentIndex(prev=>prev+1);

    }

  };





  const previousQuestion = ()=>{

    if(currentIndex > 0){

      setCurrentIndex(prev=>prev-1);

    }

  };






  const submitChallenge = async () => {

    if (!user) return;


    try {

      setSubmitting(true);



      const existingQuery = query(
        collection(db, "challengeSubmissions"),
        where("challengeId", "==", challenge.id),
        where("studentId", "==", user.uid)
      );



      const existing = await getDocs(existingQuery);



      if (!existing.empty) {

        alert("You have already attempted this challenge.");

        setSubmitting(false);

        return;

      }





      let earnedPoints = 0;

      let correctAnswers = 0;



      questions.forEach((question,index)=>{


        const studentAnswer =
        answers[index];



        if(
          studentAnswer &&
          studentAnswer.toLowerCase().trim()
          ===
          question.answer.toLowerCase().trim()
        ){

          earnedPoints += question.points;

          correctAnswers++;

        }


      });





      const percentage = challenge.totalPoints
        ?
        Math.round(
          (earnedPoints / challenge.totalPoints) * 100
        )
        :
        0;






      await addDoc(
        collection(db,"challengeSubmissions"),
        {

          challengeId: challenge.id,

          challengeTitle: challenge.title,

          courseCode: challenge.courseCode,


          studentId: user.uid,

          studentName: profile.fullName,


          answers,


          score: percentage,

          points: earnedPoints,

          correctAnswers,

          totalQuestions: questions.length,


          totalPoints: challenge.totalPoints,


          submittedAt: Timestamp.now()

        }
      );







      setResult({

        score: percentage,

        correct: correctAnswers,

        total: questions.length,

        points: earnedPoints

      });



    }

    catch(error){

      console.log(
        "Submission error:",
        error
      );

    }

    finally{

      setSubmitting(false);

    }

  };







  return (

<div
className="
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/50
px-4
"
>


<div
className="
w-full
max-w-2xl
rounded-3xl
bg-white
p-6
shadow-xl
dark:bg-gray-900
"
>


<div
className="
flex
items-center
justify-between
mb-6
"
>


<div>

<h2 className="
text-xl
font-bold
dark:text-white
">
{challenge.title}
</h2>


<p className="
text-sm
text-gray-500
">
{challenge.courseCode}
</p>

</div>


<button onClick={onClose}>
<X/>
</button>


</div>





<div className="
mb-5
rounded-xl
bg-gray-100
p-4
dark:bg-gray-800
">


<p className="dark:text-white">

Question {currentIndex + 1}/{questions.length}

</p>


</div>






<h3 className="
text-lg
font-semibold
dark:text-white
">

{currentQuestion.question}

</h3>






<div className="mt-5 space-y-3">


{
currentQuestion.type === "MCQ"

?

currentQuestion.options.map((option,index)=>(

<label
key={index}
className="
flex
cursor-pointer
items-center
gap-3
rounded-xl
border
p-3
dark:border-gray-700
dark:text-white
"
>

<input

type="radio"

name="answer"

checked={
answers[currentIndex] === option
}

onChange={()=>
handleAnswer(option)
}

/>

{option}

</label>

))


:

<input

type="text"

value={
answers[currentIndex] || ""
}

onChange={(e)=>
handleAnswer(e.target.value)
}

placeholder="Enter answer"

className="
w-full
rounded-xl
border
p-3
dark:bg-gray-800
dark:text-white
"

/>

}


</div>






<div className="
mt-8
flex
justify-between
gap-3
"
>


<button

onClick={previousQuestion}

disabled={currentIndex===0}

className="
flex
items-center
gap-2
rounded-xl
border
px-4
py-2
dark:text-white
"

>

<ChevronLeft size={18}/>

Previous

</button>





{
currentIndex < questions.length-1

?

<button

onClick={nextQuestion}

className="
flex
items-center
gap-2
rounded-xl
bg-blue-600
px-5
py-2
text-white
"

>

Next

<ChevronRight size={18}/>

</button>


:

<button

onClick={submitChallenge}

disabled={submitting}

className="
rounded-xl
bg-green-600
px-5
py-2
text-white
"

>

{
submitting
?
"Submitting..."
:
"Submit Challenge"
}

</button>

}


</div>



</div>





{
result && (

<ChallengeResultsModal

result={result}

onClose={()=>{

setResult(null);

onClose();

}}

/>

)

}



</div>

  );

}
