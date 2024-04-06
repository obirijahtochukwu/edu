import { useState } from "react";
import Navbar from "../components/Navbar";
import GenerateQuiz from "../components/quiz/GenerateQuiz";
import Question from "../components/quiz/Question";

interface QuizQuestion {
  question: string;
  choices: string[];
  correct_answer: string;
}

interface QuizData {
  quiz: QuizQuestion[];
}

interface PagesState {
  generateQuiz: boolean;
  question: boolean;
}

export default function Quiz() {
  const [pages, setPages] = useState<PagesState>({
    generateQuiz: true,
    question: false,
  });

  const [quizData, setQuizData] = useState<QuizData>();

  return (
    <div>
      <Navbar />
      <main className="bg-black min-h-screen h-full relative flex flex-col justify-between pt-8">
        {pages.generateQuiz && (
          <GenerateQuiz
            setPages={setPages}
            pages={pages}
            setQuizData={setQuizData}
          />
        )}
        {quizData && pages.question && (
          <Question
            quizData={quizData}
            setPages={setPages}
            pages={pages}
          />
        )}
        <img
          src="/assets/ellipse_right.svg"
          alt="ellipse"
          className="absolute left-0 bottom-0"
        />
        <img
          src="/assets/ellipse_left.svg"
          alt="ellipse"
          className="absolute bottom-0 right-0"
        />
      </main>
    </div>
  );
}
