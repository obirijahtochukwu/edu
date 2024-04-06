import React, { ChangeEvent, FormEvent, useState } from "react";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../Context";
import axios from "axios";
import Endpoints from "../components/Endpoints";

export interface TopicInput {
  topic: string;
  level: string;
}

export interface TeachInput {
  topic: string;
  level: string;
  subtopic: string;
}

const Home: React.FC = () => {
  const teachInputs = JSON.parse(localStorage.getItem("teachInputs") || "{}");

  const { loginDetails } = useAuthContext();
  let authorizationHeader = "";

  if (loginDetails) {
    authorizationHeader = `Basic ${btoa(
      `${loginDetails.email}:${loginDetails.password}`
    )}`;
  } else {
    authorizationHeader = "Basic " + btoa("default-email:default-password");
  }

  const [isLoading, setIsLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({
    topic: teachInputs ? teachInputs.topic : "",
    level: teachInputs ? teachInputs.level : "",
    subtopic: teachInputs ? teachInputs.subtopic : "",
  });

  const navigate = useNavigate();

  const topics = JSON.parse(localStorage.getItem("topics") || "{}");

  const TopicFn = async (topic: TopicInput) => {
    const response = await axios.post(Endpoints.topic, topic, {
      headers: {
        Authorization: authorizationHeader,
      },
    });
    return response.data;
  };

  const PostTeachFn = async (teach: TeachInput) => {
    const response = await axios.post(Endpoints.teach, teach, {
      headers: {
        Authorization: authorizationHeader,
      },
    });
    console.log(response);
    localStorage.setItem("topicIntro", JSON.stringify(response.data.response));
    return response.data;
  };

  const { mutate } = useMutation({
    mutationFn: TopicFn,
    onMutate() {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      if (data.response.length <= 0) {
        toast.error("Unable to generate topic, please try again!");
      } else {
        toast.success("successful!");
        localStorage.setItem("topics", JSON.stringify(data));
      }
      console.log(data);
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

  const { mutate: mutateTeach } = useMutation({
    mutationFn: PostTeachFn,
    onMutate() {
      setIsLoading(true);
    },
    onSuccess: () => {
      toast.success("successful!");
      setIsLoading(false);
      navigate("/course");
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
    localStorage.setItem("teachInputs", JSON.stringify(formInputs));
  };

  const handleSubmitTeach = (word: string) => {
    mutateTeach({
      ...formInputs,
      subtopic: word,
    });
  };

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      topic: formInputs.topic,
      level: formInputs.level,
    };
    localStorage.setItem("level", JSON.stringify(formInputs.level));
    mutate(data);
  };

  return (
    <Layout isMascot={false}>
      <main className="bg-black min-h-screen h-full relative pt-4 lg:pl-72 lg:pr-8 flex flex-col justify-between overflow-hidden">
        <div className="pt-24 lg:w-fit mx-auto">
          <h1 className="text-[#F9B17A] lg:text-5xl text-2xl text-center font-bold">
            What do you want to learn ?
          </h1>
          <form
            className="flex lg:flex-row flex-col items-center gap-4 pt-12 lg:px-0 px-6 relative z-20"
            onSubmit={onSubmitHandler}
          >
            <input
              type="text"
              id="topic"
              placeholder="What do you want to learn?"
              className="rounded-full bg-transparent text-white text-sm border border-white w-full h-10 px-3"
              onChange={handleOnChange}
            />
            <input
              type="text"
              id="level"
              placeholder="What is your level?"
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
          {topics?.response?.length > 0 && (
            <ul className="mt-8 relative z-20 flex flex-col gap-2">
              {topics?.response?.map((word: string, id: number) => (
                <button
                  key={id}
                  className="text-left rounded-full bg-transparent text-white text-sm border border-white w-full h-10 px-3 hover:bg-[#4A5076] transition-bg"
                  onClick={() => {
                    handleSubmitTeach(word);
                  }}
                >
                  {word}
                </button>
              ))}
            </ul>
          )}
        </div>
        <div className="max-w-[80rem] mx-auto w-full lg:px-0 px-3">
          <Footer />
        </div>
        <div className="flex items-center absolute bottom-[10%] lg:right-8 z-10 lg:w-auto w-1/2">
          <div className="relative flex items-center lg:px-0 px-3">
            <img
              src="/assets/mascotTalking.svg"
              alt=""
              className="lg:right-[14rem] right-32 top-[35%]"
            />

            <img
              src="/assets/mascot2.svg"
              alt="mascot"
              className="xl:w-auto lg:w-[200px]"
            />
          </div>
        </div>
        <img
          src="/assets/ellipse.svg"
          alt=""
          className="absolute bottom-0 right-0 xl:h-[90%] h-4/5"
        />
      </main>
    </Layout>
  );
};

export default Home;
