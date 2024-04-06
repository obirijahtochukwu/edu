/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import FormInputs from "../components/FormInputs";
import { useAuthContext } from "../Context";
import axios from "axios";
import Endpoints from "../components/Endpoints";

const noteSchema = object({
  content: string(),
});
const lessonSchema = z.object({
  content: z.string().min(1, "Content is required"),
  topic: z.string().min(1, "Topic is required"),
  notes: z.array(noteSchema),
});

export type LessonInput = TypeOf<typeof lessonSchema>;

export default function Lesson() {
  const [isLoading, setIsLoading] = useState(false);

  const topicIntro = JSON.parse(localStorage?.getItem("topicIntro"));
  const teachInputs = JSON.parse(localStorage?.getItem("teachInputs"));

  const methods = useForm<LessonInput>({
    resolver: zodResolver(lessonSchema),
  });

  const { handleSubmit, reset } = methods;

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

  const PostLessonFn = async (lesson: LessonInput) => {
    const response = await axios.post(Endpoints.lesson, lesson, {
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

  const { mutate } = useMutation({
    mutationFn: PostLessonFn,
    onMutate() {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      toast.success("successful!");
      console.log(data, "data");
      setIsLoading(false);
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

  const onSubmitHandler: SubmitHandler<LessonInput> = (values) => {
    console.log(values, "values");
    reset();
    mutate(values);
  };

  const handleSave = () => {
    const { content, topic, notes } = methods.getValues();

    if (!content || !topic || !notes[0]?.content || !notes[1]?.content) {
      toast.warning("Please fill in all fields before saving.");
    } else {
      const savedValues = {
        content,
        topic,
        notes: [{ content: notes[0]?.content }, { content: notes[1]?.content }],
      };
      localStorage.setItem("courseNotes", JSON.stringify(savedValues));
      toast.success("Notes saved successfully!");
    }
  };

  return (
    <>
      <Layout isMascot={true}>
        <main className="bg-black min-h-screen h-full relative pt-4 lg:pl-72 pl-3 lg:pr-8 pr-3  flex flex-col justify-between">
          <div className="pt-24 mx-auto w-full h-full flex flex-col justify-between relative z-10">
            <section className="w-full min-h-[60vh] overflow-auto">
              <div className="h-full bg-[#2D3250] rounded-2xl flex flex-col justify-between mb-6">
                <div className="h-20 bg-[#4A5076] text-white rounded-2xl w-full flex flex-col justify-center items-center">
                  <h1 className="text-3xl">{teachInputs.topic}</h1>
                </div>
                <p className="text-white p-6">{topicIntro}</p>
              </div>
              {lessons?.map(
                (lesson: {
                  id: Key | null | undefined;
                  topic:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | null
                    | undefined;
                  content:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | null
                    | undefined;
                }) => (
                  <div
                    key={lesson.id}
                    className="h-full bg-[#2D3250] rounded-2xl flex flex-col justify-between mb-6"
                  >
                    <div className="h-20 bg-[#4A5076] text-white rounded-2xl w-full flex flex-col justify-center items-center">
                      <h1 className="text-3xl">{lesson.topic}</h1>
                    </div>
                    <p className="text-white p-6">{lesson.content}</p>
                  </div>
                )
              )}
            </section>
            <section className="my-8">
              <FormProvider {...methods}>
                <form
                  className="grid lg:grid-cols-3 grid-cols-1 gap-y-4 text-sm"
                  onSubmit={handleSubmit(onSubmitHandler)}
                >
                  <div className="flex flex-col gap-y-4 h-full justify-between">
                    <FormInputs
                      label="What do you want to learn?"
                      name="content"
                      type="text"
                      className="border border-solid border-white bg-transparent text-white opacity-60 h-10 px-2 lg:w-11/12"
                    />
                    <FormInputs
                      label="What is your level?"
                      name="topic"
                      type="text"
                      className="border border-solid border-white bg-transparent text-white opacity-60 h-10 px-2 lg:w-11/12"
                    />
                  </div>

                  <FormInputs
                    label="Note 1"
                    name={`notes[0].content`}
                    type="textarea"
                    className="min-h-24 border border-solid border-white bg-[#2D3250] text-white opacity-60 row-span-2 px-2"
                  />
                  <FormInputs
                    label="Note 2"
                    name={`notes[1].content`}
                    type="textarea"
                    className="min-h-24 border border-solid border-white bg-[#2D3250] text-white opacity-60 row-span-2 px-2"
                  />

                  <button
                    className="bg-[#F9B17A] text-[#2E3352] px-12 py-2 rounded-full w-fit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Submit"}
                  </button>
                  <button
                    className="bg-[#F9B17A] text-[#2E3352] px-12 py-2 rounded-full w-fit"
                    onClick={handleSave}
                    type="button"
                  >
                    Save
                  </button>
                </form>
              </FormProvider>
            </section>
          </div>

          <div>
            <img
              src="/assets/ellipse2.svg"
              alt="ellipse"
              className="absolute bottom-0 right-0"
            />
          </div>
          <Footer />
        </main>
      </Layout>
    </>
  );
}
