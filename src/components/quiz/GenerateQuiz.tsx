import { useState } from "react";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FormInputs from "../FormInputs";
import { useAuthContext } from "../../Context";
import axios from "axios";
import Endpoints from "../Endpoints";

const QuizSchema = object({
  topic: string().min(1, "Topic is required"),
  level: string().min(1, "Level is required"),
});
export type QuizInput = TypeOf<typeof QuizSchema>;

//   eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GenerateQuiz({ setPages, pages, setQuizData }: any) {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<QuizInput>({
    resolver: zodResolver(QuizSchema),
  });

  const { loginDetails } = useAuthContext();
  let authorizationHeader = "";

  if (loginDetails) {
    authorizationHeader = `Basic ${btoa(
      `${loginDetails.email}:${loginDetails.password}`
    )}`;
  } else {
    authorizationHeader = "Basic " + btoa("default-email:default-password");
  }

  const PostQuizFn = async (quiz: QuizInput) => {
    const response = await axios.post(Endpoints.generate_quiz, quiz, {
      headers: {
        Authorization: authorizationHeader,
      },
    });
    return response.data;
  };

  const { handleSubmit, reset } = methods;

  const { mutate } = useMutation({
    mutationFn: PostQuizFn,
    onMutate() {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      toast.success("successful!");
      console.log(data, "data");
      setIsLoading(false);
      setPages({ ...pages, generateQuiz: false, question: true });
      setQuizData(data);
    },
    onError: (err: Error) => {
      console.error(err);
      toast.error(err.message);
    },
    onSettled() {
      setIsLoading(false);
    },
  });

  const onSubmitHandler: SubmitHandler<QuizInput> = (values) => {
    console.log(values, "values");
    reset();
    mutate(values);
  };

  return (
    <div className="pt-24 pb-8 container mx-auto xl:h-screen flex flex-col justify-center">
      <div className="flex items-center w-full text-[#F9B17A] gap-4">
        <hr className="w-full border-[#F9B17A]" />
        <h1 className="text-5xl font-bold">Quiz</h1>
        <hr className="w-full border-[#F9B17A]" />
      </div>
      <section className="lg:flex items-center my-[4%] relative z-20">
        <FormProvider {...methods}>
          <form
            className="lg:w-2/3 text-white px-[8%]"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <div className="my-8">
              <h1 className="lg:text-3xl text-xl">
                What subject would you like to try yourself on?
              </h1>
              <FormInputs
                label="Advanced Integration Techniques"
                name="topic"
                type="text"
                className="text-left rounded-full bg-transparent w-full bg-[#424769] h-16 px-4 mt-4 opacity-70 border outline-none"
              />
            </div>
            <div className="mb-8">
              <h1 className="lg:text-3xl text-xl">What is your level ?</h1>
              <FormInputs
                label="Beginner"
                name="level"
                type="text"
                className="text-left rounded-full bg-transparent w-full bg-[#424769] h-16 px-4 mt-4 opacity-70 border outline-none"
              />
            </div>
            <button className="bg-[#F9B17A] text-[#2E3352] px-12 py-2 rounded-full w-fit">
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </form>
        </FormProvider>
        <div className="lg:w-2/5">
          <img
            src="/assets/talking_mascot.svg"
            alt="talking mascot"
            width="350"
            className="lg:w-auto w-1/2 mx-auto"
          />
        </div>
      </section>
      <hr className="w-full border-[#F9B17A]" />
    </div>
  );
}
