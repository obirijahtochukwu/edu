import { useQuery, useMutation } from "@tanstack/react-query";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
// import { LessonFn, TopicFn } from "../components/hooks/Fetchdata";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "../Context";
import axios from "axios";
import Endpoints from "../components/Endpoints";
import { TopicInput } from "./Home";

export default function Weeks() {
  const { loginDetails } = useAuthContext();
  let authorizationHeader = "";

  if (loginDetails) {
    authorizationHeader = `Basic ${btoa(
      `${loginDetails.email}:${loginDetails.password}`
    )}`;
  } else {
    authorizationHeader = "Basic " + btoa("default-email:default-password");
  }

  const LessonFn = async () => {
    const response = await axios.get(Endpoints.lesson, {
      headers: {
        Authorization: authorizationHeader,
      },
    });
    return response.data;
  };

  const TopicFn = async (topic: TopicInput) => {
    const response = await axios.post(Endpoints.topic, topic, {
      headers: {
        Authorization: authorizationHeader,
      },
    });
    return response.data;
  };

  const { data: lessons } = useQuery({
    queryKey: ["lessons"],
    queryFn: LessonFn,
  });
  console.log(lessons, "lessons");

  const [isLoading, setIsLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({
    topic: "",
    level: "",
  });

  const { mutate } = useMutation({
    mutationFn: TopicFn,
    onMutate() {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      toast.success("successful!");
      setIsLoading(false);
      console.log(data, "data");
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

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormInputs({
      ...formInputs,
      [e.target.id]: e.target.value,
    });
  };

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      topic: formInputs.topic,
      level: formInputs.level,
    };
    console.log(formInputs, "formInputs2");
    mutate(data);
  };

  return (
    <Layout isMascot={false}>
      <main className="bg-black min-h-screen h-full relative pt-4 lg:pl-72 pl-3 lg:pr-8 pr-3  flex flex-col justify-between overflow-hidden">
        <div className="pt-24 mx-auto lg:max-w-[80rem] lg:pr-8 flex flex-col justify-between">
          <div className="mx-auto grid lg:grid-cols-3 grid-cols-1 gap-x-12 gap-y-8 justify-between w-fit overflow-auto">
            {lessons?.map((lesson: { content: string; id: number }) => (
              <div
                key={lesson.id}
                className="bg-[#F9B17A] rounded-xl text-center flex flex-col items-center justify-center px-8 py-4 text-white w-full"
              >
                <p>{lesson.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:max-w-[80rem] mx-auto w-full lg:pr-8 lg:pt-0 pt-4">
          <form
            className="flex lg:flex-row flex-col items-center gap-4 pt-12 relative z-20 w-full mx-auto bottom-[5vh]"
            onSubmit={onSubmitHandler}
          >
            <input
              type="text"
              placeholder="What do you want to learn?"
              required
              id="topic"
              className="rounded-full bg-transparent text-white text-sm border border-white w-full h-10 px-3"
              onChange={handleOnChange}
            />
            <input
              type="text"
              placeholder="What is your level?"
              required
              id="level"
              className="rounded-full bg-transparent text-white text-sm border border-white w-full h-10 px-3"
              onChange={handleOnChange}
            />
            <button
              className="bg-[#F9B17A] text-[#676D9D] rounded-full h-10 outline-none px-8"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </form>

          <Footer />
        </div>

        <div className="xl:flex hidden items-center absolute bottom-[10%] right-8 z-10">
          <img
            src="/assets/mascotTalking4.svg"
            alt="mascot talking"
            className="absolute right-[14rem] top-[35%]"
          />
          <img
            src="/assets/mascot2.svg"
            alt="mascot"
            height="200"
            width="250"
          />
        </div>
      </main>
    </Layout>
  );
}
