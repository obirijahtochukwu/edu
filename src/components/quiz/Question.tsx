/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../Context";
import axios from "axios";
import Endpoints from "../Endpoints";

interface QuizQuestion {
  question: string;
  choices: string[];
  correct_answer: string;
}

const getStoredBgColors = () => {
  const storedBgColors = localStorage.getItem("bgColors");
  return storedBgColors ? JSON.parse(storedBgColors) : {};
};

const storeBgColors = (bgColors: any) => {
  localStorage.setItem("bgColors", JSON.stringify(bgColors));
};

const Question: React.FC<{
  quizData: { quiz: QuizQuestion[] };
  setPages: any;
  pages: any;
}> = ({ quizData, setPages, pages }) => {
  
  const [selectedAnswers, setSelectedAnswers] = useState<
    { question: string; choice: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [bgColors, setBgColors] = useState(getStoredBgColors());

  const { loginDetails } = useAuthContext();
  let authorizationHeader = "";

  if (loginDetails) {
    authorizationHeader = `Basic ${btoa(
      `${loginDetails.email}:${loginDetails.password}`
    )}`;
  } else {
    authorizationHeader = "Basic " + btoa("default-email:default-password");
  }

  const AnswerQuizFn = async (question: any) => {
    const response = await axios.post(Endpoints.answer_quiz, question, {
      headers: {
        Authorization: authorizationHeader,
      },
    });
    return response.data;
  };

  const SubmitQuizFn = async (answer: any) => {
    const response = await axios.post(Endpoints.submit_quiz, answer, {
      headers: {
        Authorization: authorizationHeader,
      },
    });
    return response.data;
  };

  useEffect(() => {
    const initialBgColors = getStoredBgColors();

    quizData.quiz.forEach((page, pageIndex) => {
      if (page && page.choices) {
        page.choices.forEach((_, choiceIndex) => {
          const key = `${pageIndex}-${choiceIndex}`;
          initialBgColors[key] = initialBgColors[key] || "";
        });
      }
    });

    setBgColors(initialBgColors);
  }, [quizData, currentPage]);

  useEffect(() => {
    storeBgColors(bgColors);
  }, [bgColors]);

  useEffect(() => {
    localStorage.removeItem('bgColors');
  }, []);

  const handleSelectAnswer = (
    question: string,
    choiceIndex: number,
    choice: string,
    correct_ans:string,
  ) => {
    const isAlreadySelected = selectedAnswers.some(
      (answer) => answer.question === question
    );

    if (!isAlreadySelected) {
      const selectedChoice: any = quizData.quiz.find(
        (q) => q.question === question
      )?.choices[choiceIndex];

      setSelectedAnswers((prevSelectedAnswers: any) => {
        const updatedSelectedAnswers = prevSelectedAnswers.filter(
          (ans: { question: string }) => ans.question !== question
        );
        return [
          ...updatedSelectedAnswers,
          { question, answer: selectedChoice.trim() },
        ];
      });

      const isCorrect =
        choice === correct_ans;

      const newBgColors = { ...bgColors };
      newBgColors[`${currentPage}-${choiceIndex}`] = isCorrect
        ? "#2FAC66"
        : "#E30613";
      setBgColors(newBgColors);

      mutate({
        question: question.trim(),
        choice: selectedChoice.trim(),
      });
    }
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const pageCount = Math.ceil(quizData?.quiz.length);
  const hidePrevious = currentPage === 0;
  const hideNext = currentPage === pageCount - 1;

  const { mutate } = useMutation({
    mutationFn: AnswerQuizFn,

    onSuccess: (data) => {
      console.log(data, "data");
    },
    onError: (err: Error) => {
      console.error(err);
      // toast.error(err.message);
    },
  });

  const { mutate: submitAnswer } = useMutation({
    mutationFn: SubmitQuizFn,
    onMutate() {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      toast.success("successful!");
      setIsLoading(false);
      console.log(data);
      localStorage.setItem("score", JSON.stringify(data));
      navigate("/result");
    },
    onError: (err: Error) => {
      console.error(err);
      toast.error(err.message);
      setIsLoading(false);
    },
    onSettled() {
      setIsLoading(false);
    },
  });

  const handleSubmitAnswer = () => {
    const data = {
      answers: selectedAnswers,
    };
    submitAnswer(data);
    console.log(data, "handleSubmitAnswer");
  };

  return (
    <div className="pt-24 container mx-auto xl:min-h-screen flex flex-col justify-center">
      <div className="flex items-center w-full text-[#F9B17A] gap-4 py-4">
        <hr className="w-full border-[#F9B17A]" />
        <h1 className="text-5xl font-bold">Quiz</h1>
        <hr className="w-full border-[#F9B17A]" />
      </div>
      <section className="lg:flex items-center lg:my-[4%] relative z-20">
        <div className="lg:w-2/3 text-white lg:px-[8%] px-3">
          {quizData?.quiz[currentPage] && (
            <div key={quizData?.quiz[currentPage]?.question}>
              <h1 className="lg:text-3xl text-xl">
                {quizData?.quiz[currentPage]?.question}
              </h1>
              <div className="flex flex-col gap-4 mt-8">
                {quizData?.quiz[currentPage]?.choices.map(
                  (choice: string, choiceIndex: number) => (
                    <button
                      key={choice}
                      className="text-left rounded-full w-full h-16 px-4 text-xl"
                      style={{
                        backgroundColor:
                          bgColors[`${currentPage}-${choiceIndex}`],
                      }}
                      onClick={() =>
                        handleSelectAnswer(
                          quizData?.quiz[currentPage]?.question,
                          choiceIndex,
                          choice,
                          quizData?.quiz[currentPage]?.correct_answer
                        )
                      }
                    >
                      {choice}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {currentPage === pageCount - 1 && (
            <button
              className="bg-[#F9B17A] text-[#2E3352] px-12 py-2 rounded-full w-fit mt-8"
              onClick={handleSubmitAnswer}
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          )}

          {quizData?.quiz.length <= 0 && (
            <div className="flex flex-col justify-center items-center gap-6">
              <p>Something went wrong, try generating quiz again</p>
              <button
                className="bg-[#F9B17A] text-[#2E3352] px-12 py-2 rounded-full w-fit"
                onClick={() =>
                  setPages({ ...pages, generateQuiz: true, question: false })
                }
              >
                Go back
              </button>
            </div>
          )}
        </div>

        <div className="lg:w-2/5 w-1/2 mx-auto lg:mt-0 mt-4">
          <img
            src="/assets/talking_mascot.svg"
            alt="talking mascot"
            width="350"
            className=""
          />
          {/* {selectedAnswer === "" && (
            <img
              src="/assets/talking_mascot.svg"
              alt="talking mascot"
              width="350"
              className=""
            />
          )}
          {selectedAnswer !== "" && selectedAnswer === "strawberry" && (
            <img
              src="/assets/correct_answer.svg"
              alt="talking mascot"
              width="350"
              className=""
            />
          )}
          {selectedAnswer !== "" && selectedAnswer !== "strawberry" && (
            <img
              src="/assets/wrong_answer.svg"
              alt="talking mascot"
              width="350"
              className=""
            />
          )} */}
        </div>
      </section>
      <ReactPaginate
        breakLabel={"..."}
        pageCount={pageCount}
        pageRangeDisplayed={1}
        onPageChange={handlePageChange}
        containerClassName="flex text-white justify-center items-center gap-8 z-20"
        activeClassName="text-[#F9B17A]"
        pageClassName="p-2"
        nextLabel={hideNext ? null : "Next"}
        previousLabel={hidePrevious ? null : "Previous"}
      />
      <div className="flex items-center w-full text-[#F9B17A] gap-4 py-4">
        <hr className="w-full border-[#F9B17A]" />
        <h1 className="text-xl whitespace-pre">Select all correct answers</h1>
        <hr className="w-full border-[#F9B17A]" />
      </div>
    </div>
  );
};

export default Question;
