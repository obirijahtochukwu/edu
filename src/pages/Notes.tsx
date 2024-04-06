import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import Footer from "../components/Footer";
import FormInputs from "../components/FormInputs";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthContext } from "../Context";
import axios from "axios";
import Endpoints from "../components/Endpoints";

const noteSchema = object({
  content: string().min(1, "Content is required"),
  level: string().min(1, "Level is required"),
});

export type NoteInput = TypeOf<typeof noteSchema>;

export default function Notes() {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
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

  const NotesFn = async () => {
    const response = await axios.get(Endpoints.notes, {
      headers: {
        Authorization: authorizationHeader,
      },
    });
    return response.data;
  };

  const PostNotesFn = async (note: NoteInput) => {
    const response = await axios.post(Endpoints.notes, note, {
      headers: {
        Authorization: authorizationHeader,
      },
    });
    return response.data;
  };

  const { handleSubmit, reset } = methods;

  const { data: notes } = useQuery({ queryKey: ["notes"], queryFn: NotesFn });
  console.log(notes);

  const { mutate } = useMutation({
    mutationFn: PostNotesFn,
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
    },
    onSettled() {
      setIsLoading(false);
    },
  });

  const onSubmitHandler: SubmitHandler<NoteInput> = (values) => {
    console.log(values, "values");
    reset();
    mutate(values);
  };

  return (
    <>
      <Layout isMascot={true}>
        <main className="bg-black min-h-screen h-full relative pt-4 lg:pl-72 pl-3 lg:pr-8 pr-3  flex flex-col justify-between">
          <div className="pt-24 mx-auto w-full h-full flex flex-col justify-between relative z-10">
            <section className="w-full min-h-[60vh] overflow-auto">
              {notes?.map((note: { content: string }, id: number) => (
                <div
                  key={id}
                  className="h-full bg-white rounded-2xl flex flex-col mt-4"
                >
                  <div className="h-20 bg-[#4A5076] text-white rounded-2xl w-full flex flex-col justify-center items-center">
                    <h1 className="text-3xl">Note {id + 1}</h1>
                  </div>
                  <p className="px-6 pb-6 m-4">{note.content}</p>
                </div>
              ))}
            </section>
          </div>
          <section>
            <FormProvider {...methods}>
              <form
                className="my-8 flex flex-col gap-4 items-start"
                onSubmit={handleSubmit(onSubmitHandler)}
              >
                <FormInputs
                  label="What do you want to learn?"
                  name="content"
                  type="text"
                  className="rounded-full border border-solid border-white bg-transparent text-white opacity-60 h-10 px-2 lg:w-1/3"
                />
                <FormInputs
                  label="What is your level?"
                  name="level"
                  type="text"
                  className="rounded-full border border-solid border-white bg-transparent text-white opacity-60 h-10 px-2 lg:w-1/3"
                />

                <button className="bg-[#F9B17A] text-[#2E3352] px-12 py-2 rounded-full w-fit">
                  {isLoading ? "Loading..." : "Submit"}
                </button>
              </form>
            </FormProvider>
          </section>
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
