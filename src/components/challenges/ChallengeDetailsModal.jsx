import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

import {
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "../../firebase";


export default function ChallengeDetailsModal({
  challenge,
  onClose,
}) {


  const [questions, setQuestions] = useState(
    challenge.questions || []
  );


  const [loading, setLoading] = useState(false);



  const [newQuestion, setNewQuestion] = useState({

    question: "",
    type: "MCQ",
    options: ["", "", "", ""],
    answer: "",
    points: ""

  });





  const updateOption = (index, value) => {

    const updatedOptions = [
      ...newQuestion.options
    ];

    updatedOptions[index] = value;


    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });

  };






  const addQuestion = () => {


    if (
      !newQuestion.question ||
      !newQuestion.answer ||
      !newQuestion.points
    ) {

      alert("Complete question details");

      return;

    }



    const questionData = {

      question: newQuestion.question,

      type: newQuestion.type,

      options:
        newQuestion.type === "MCQ"
          ? newQuestion.options
          : [],

      answer: newQuestion.answer,

      points: Number(newQuestion.points)

    };



    setQuestions((prev) => [

      ...prev,

      questionData

    ]);



    setNewQuestion({

      question: "",
      type: "MCQ",
      options: ["", "", "", ""],
      answer: "",
      points: ""

    });


  };







  const removeQuestion = (index) => {


    setQuestions((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );


  };







  const saveChallenge = async () => {


    try {

      setLoading(true);



      const totalPoints =
        questions.reduce(
          (sum, q) =>
            sum + q.points,
          0
        );



      await updateDoc(

        doc(
          db,
          "challenges",
          challenge.id
        ),

        {

          questions,

          totalPoints,

          updatedAt:
            Timestamp.now()

        }

      );



      alert("Challenge saved");


    } catch (error) {

      console.log(
        "Save error:",
        error
      );


    } finally {

      setLoading(false);

    }


  };







  const activateChallenge = async () => {


    if (questions.length === 0) {

      alert(
        "Add questions before activating"
      );

      return;

    }



    await updateDoc(

      doc(
        db,
        "challenges",
        challenge.id
      ),

      {

        status: "Active",

        updatedAt:
          Timestamp.now()

      }

    );


    onClose();


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

      onClick={onClose}
    >


      <div
        className="
          max-h-[90vh]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-3xl
          bg-white
          p-6
          shadow-xl
          dark:bg-gray-900
        "

        onClick={(e)=>e.stopPropagation()}
      >


        <div className="
          mb-6
          flex
          items-center
          justify-between
        ">


          <h2 className="
            text-xl
            font-bold
            dark:text-white
          ">

            {challenge.title}

          </h2>


          <button
            onClick={onClose}
            className="
              rounded-lg
              p-1
              text-gray-500
              hover:bg-gray-100
              dark:hover:bg-gray-800
            "
          >

            <X size={22}/>

          </button>


        </div>

        {/* Challenge Info */}

        <div className="
          mb-6
          rounded-xl
          bg-gray-100
          p-4
          dark:bg-gray-800
        ">

          <p className="dark:text-white">
            Course: {challenge.courseCode}
          </p>

          <p className="dark:text-white">
            Status: {challenge.status}
          </p>

          <p className="dark:text-white">
            Questions: {questions.length}
          </p>

        </div>





        {/* Existing Questions */}

        <h3 className="
          mb-3
          font-semibold
          dark:text-white
        ">
          Questions
        </h3>




        {
          questions.map((q,index)=>(

            <div
              key={index}
              className="
                mb-3
                rounded-xl
                border
                p-4
                dark:border-gray-700
              "
            >

              <div className="
                flex
                items-start
                justify-between
                gap-3
              ">


                <div>

                  <p className="
                    font-medium
                    dark:text-white
                  ">
                    {index + 1}. {q.question}
                  </p>


                  <p className="text-sm text-gray-500">
                    Type: {q.type}
                  </p>


                  <p className="text-sm text-gray-500">
                    Points: {q.points}
                  </p>


                </div>




                <button
                  onClick={() => removeQuestion(index)}
                  className="text-red-500"
                >

                  <Trash2 size={18}/>

                </button>


              </div>


            </div>

          ))

        }








        {/* Add Question */}

        <div className="
          mt-6
          space-y-3
        ">


          <input
            value={newQuestion.question}
            onChange={(e)=>
              setNewQuestion({
                ...newQuestion,
                question:e.target.value
              })
            }
            placeholder="Question"
            className="
              w-full
              rounded-xl
              border
              p-3
              dark:border-gray-700
              dark:bg-gray-800
              dark:text-white
            "
          />





          <select
            value={newQuestion.type}
            onChange={(e)=>
              setNewQuestion({
                ...newQuestion,
                type:e.target.value
              })
            }
            className="
              w-full
              rounded-xl
              border
              p-3
              dark:border-gray-700
              dark:bg-gray-800
              dark:text-white
            "
          >

            <option value="MCQ">
              Multiple Choice
            </option>

            <option value="Short Answer">
              Short Answer
            </option>


          </select>








          {
            newQuestion.type === "MCQ" && (

              newQuestion.options.map((option,index)=>(

                <input
                  key={index}
                  value={option}

                  onChange={(e)=>
                    updateOption(
                      index,
                      e.target.value
                    )
                  }

                  placeholder={`Option ${index + 1}`}

                  className="
                    w-full
                    rounded-xl
                    border
                    p-3
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-white
                  "

                />

              ))

            )
          }








          <input
            value={newQuestion.answer}

            onChange={(e)=>
              setNewQuestion({
                ...newQuestion,
                answer:e.target.value
              })
            }

            placeholder="Correct Answer"

            className="
              w-full
              rounded-xl
              border
              p-3
              dark:border-gray-700
              dark:bg-gray-800
              dark:text-white
            "

          />







          <input

            type="number"

            value={newQuestion.points}

            onChange={(e)=>
              setNewQuestion({
                ...newQuestion,
                points:e.target.value
              })
            }

            placeholder="Question Points"

            className="
              w-full
              rounded-xl
              border
              p-3
              dark:border-gray-700
              dark:bg-gray-800
              dark:text-white
            "

          />







          <button

            onClick={addQuestion}

            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-gray-200
              px-4
              py-2
              dark:bg-gray-700
              dark:text-white
            "

          >

            <Plus size={18}/>

            Add Question

          </button>



        </div>








        {/* Footer Buttons */}

        <div className="
          mt-6
          flex
          gap-3
        ">


          <button

            onClick={saveChallenge}

            disabled={loading}

            className="
              flex-1
              rounded-xl
              bg-[#3D78DA]
              py-3
              font-medium
              text-white
              hover:bg-blue-700
            "

          >

            {
              loading
              ?
              "Saving..."
              :
              "Save Changes"
            }

          </button>






          {
            challenge.status === "Draft" && (

              <button

                onClick={activateChallenge}

                className="
                  flex-1
                  rounded-xl
                  bg-green-600
                  py-3
                  font-medium
                  text-white
                  hover:bg-green-700
                "

              >

                Activate

              </button>

            )
          }



        </div>



      </div>


    </div>

  );

}
