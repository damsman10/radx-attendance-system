import { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../firebase";


export default function ChallengeResultsModal({
  challenge,
  onClose,
}) {


  const [results,setResults] = useState([]);

  const [loading,setLoading] = useState(true);




  useEffect(()=>{


    if(!challenge?.id)
      return;



    const q = query(

      collection(
        db,
        "challengeSubmissions"
      ),

      where(
        "challengeId",
        "==",
        challenge.id
      )

    );



    const unsubscribe = onSnapshot(

      q,

      (snapshot)=>{


        const data =
        snapshot.docs.map(doc=>({

          id:doc.id,

          ...doc.data()

        }));


        setResults(data);

        setLoading(false);


      },


      (error)=>{


        console.log(
          "Results error:",
          error
        );


        setLoading(false);


      }

    );



    return unsubscribe;


  },[challenge]);






  const formatDate=(timestamp)=>{


    if(!timestamp)
      return "-";



    try{


      if(timestamp.toDate){

        return timestamp
        .toDate()
        .toLocaleDateString();

      }



      return new Date(timestamp)
      .toLocaleDateString();



    }
    catch{

      return "-";

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
max-h-[90vh]
w-full
max-w-3xl
overflow-y-auto
rounded-3xl
bg-white
p-6
shadow-xl
dark:bg-gray-900
"
>



<div
className="
mb-6
flex
items-center
justify-between
"
>


<div>


<h2
className="
text-xl
font-bold
dark:text-white
"
>

{challenge?.title || "Challenge Results"}

</h2>


<p className="text-sm text-gray-500">
Challenge Results
</p>


</div>




<button

onClick={onClose}

className="
text-gray-500
hover:text-gray-900
dark:hover:text-white
"

>

<X/>

</button>


</div>








{
loading ?

<p className="text-gray-500">
Loading results...
</p>


:

results.length === 0 ?


<div
className="
rounded-xl
bg-gray-100
p-5
text-center
dark:bg-gray-800
"
>

<p className="text-gray-500">
No submissions yet.
</p>

</div>


:


<div className="overflow-x-auto">


<table
className="
w-full
text-left
"
>


<thead
className="
border-b
dark:border-gray-700
"
>

<tr>


<th className="px-4 py-3 dark:text-white">
Student
</th>


<th className="px-4 py-3 dark:text-white">
Score
</th>


<th className="px-4 py-3 dark:text-white">
Percentage
</th>


<th className="px-4 py-3 dark:text-white">
Submitted
</th>


</tr>


</thead>





<tbody>


{
results.map(result=>(


<tr

key={result.id}

className="
border-b
dark:border-gray-700
"

>


<td
className="
px-4
py-3
font-medium
dark:text-white
"
>

{
result.studentName ||
"Student"
}

</td>




<td
className="
px-4
py-3
dark:text-white
"
>

{
result.score ?? 0
}

/

{
result.totalPoints ?? 0
}


</td>





<td
className="
px-4
py-3
dark:text-white
"
>

{
result.percentage ?? 0
}%

</td>





<td
className="
px-4
py-3
text-sm
text-gray-500
"
>

{
formatDate(
result.submittedAt
)
}


</td>



</tr>


))


}



</tbody>


</table>


</div>


}





</div>


</div>

);

}
