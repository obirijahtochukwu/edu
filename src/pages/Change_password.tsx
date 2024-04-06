/* eslint-disable react-refresh/only-export-components */
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import FormInputs from "../components/FormInputs";
import { useAuthContext } from "../Context";
import Endpoints from "../components/Endpoints";
import axios from "axios";

const PasswordSchema = object({
  current_password: string()
    .min(1, "Current password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  new_password: string()
    .min(1, "New password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  confirm_password: string().min(1, "Please confirm your password"),
}).refine((data) => data.new_password === data.confirm_password, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});
export type PasswordInput = TypeOf<typeof PasswordSchema>;

export default function Change_password() {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<PasswordInput>({
    resolver: zodResolver(PasswordSchema),
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

  const ChangePasswordFn = async (password: PasswordInput) => {
    const response = await axios.post(Endpoints.change_password, password, {
      headers: {
        Authorization: authorizationHeader,
      },
    });
    return response.data;
  };

  const { handleSubmit } = methods;

  const { mutate } = useMutation({
    mutationFn: ChangePasswordFn,
    onMutate() {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      toast.success("Password update successful!");
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

  const onSubmitHandler: SubmitHandler<PasswordInput> = (values) => {
    mutate(values);
  };

  return (
    <>
      <Layout isProfile={true}>
        <main className="bg-black min-h-screen h-full relative pt-4 pl-72 pr-8 flex flex-col justify-between overflow-hidden">
          <div className="pt-24 pb-4 mx-auto w-full h-full flex flex-col gap-y-8 justify-between relative z-10">
            <section className="relative flex flex-col justify-center items-center rounded-[7rem] bg-[#4A5076] h-96">
              <span className="absolute top-20 z-10">
                <img
                  src="/assets/icons/profile.svg"
                  alt="profile image"
                  width="182"
                  height="182"
                  className="rounded-full"
                />
                <p className="text-white text-3xl pt-2">Jennifer Anna</p>
              </span>
              <div className="bg-[#676D9D] rounded-full absolute bottom-0 w-full h-1/2"></div>
            </section>
            <section className="bg-[#676D9D] rounded-[7rem] text-white lg:px-16 pt-8 pb-12">
              <p className="text-center">Here you can set your new password</p>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                  <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-8 gap-y-16 pt-8">
                    <div className="flex flex-col gap-y-4">
                      Old Password
                      <FormInputs
                        label="Old Password"
                        name="current_password"
                        type="password"
                        className="border border-solid border-[#2E3352] rounded-full bg-transparent h-14 pl-6 outline-none"
                      />
                    </div>
                    <div></div>
                    <div className="flex flex-col gap-y-4">
                      New Password
                      <FormInputs
                        label="New Password"
                        name="new_password"
                        type="password"
                        className="border border-solid border-[#2E3352] rounded-full bg-transparent h-14 pl-6 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-y-4">
                      New Password Confirmation
                      <FormInputs
                        label="New Password Confirmation"
                        name="confirm_password"
                        type="password"
                        className="border border-solid border-[#2E3352] rounded-full bg-transparent h-14 pl-6 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center pt-16">
                    <button className="bg-[#F9B17A] text-[#2E3352] px-12 py-1 h-14 rounded-full w-fit">
                      {isLoading ? "Loading..." : "Change password"}
                    </button>
                  </div>
                </form>
              </FormProvider>
            </section>
          </div>
          <img
            src="/assets/ellipse3.svg"
            alt="ellipse"
            className="absolute rotate-[121deg] top-40 w-1/2"
          />
          <Footer />
        </main>
      </Layout>
    </>
  );
}
