import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import FormInputs from "../components/FormInputs";
import { useState } from "react";
import { loginFn } from "../components/hooks/Fetchdata";
import { useAuthContext } from "../Context";

const loginSchema = object({
  email: string()
    .min(1, "Email address is required")
    .toLowerCase()
    .trim()
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type LoginInput = TypeOf<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const { login } = useAuthContext();

  const navigate = useNavigate();

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit } = methods;

  const { mutate } = useMutation({
    mutationFn: loginFn,
    onMutate() {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      toast.success("Login successful!");
      console.log(data, "data");
      setIsLoading(false);
      navigate("/");
      localStorage.setItem("token", data.token);
    },
    onError: (err: Error) => {
      console.error(err);
      if (err.message === "Request failed with status code 400")
        {toast.error("Invalid login details");}
      toast.error(err.message)
    },
    onSettled() {
      setIsLoading(false);
    },
  });

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    login(values)
    // localStorage.setItem("userData", JSON.stringify(values));
    mutate(values);
  };

  return (
    <div className="bg-[#000000] min-h-screen ">
      <div className="container mx-auto px-3 ">
        <h1 className="border-b border-white text-white lg:text-5xl px-3 pt-8">
          LOGO
        </h1>
        <div className="lg:flex items-center">
          <section className="lg:block hidden">
            <img
              src="/assets/mascot.svg"
              alt="mascot image"
              className="lg:h-[90vh]"
            />
          </section>
          <section className="lg:w-1/2 flex flex-col items-center lg:pt-0 pt-4">
            <FormProvider {...methods}>
              <form
                className="text-white lg:w-3/5 w-full"
                onSubmit={handleSubmit(onSubmitHandler)}
              >
                <h1 className="lg:text-4xl font-bold mb-3">GET STARTED </h1>
                <p>Log in to your account</p>
                <span className="flex items-center justify-center gap-x-4 text-[#424769] h-14 bg-[#F9B17A] rounded-full my-8 font-medium cursor-pointer">
                  <img
                    src="/assets/icons/google_icon.svg"
                    alt="google icon"
                    className=""
                  />
                  <p> Continue with Google</p>
                </span>
                <div className="flex flex-col gap-y-6">
                  <FormInputs label="Email" name="email" type="email" />
                  <FormInputs
                    label="Password"
                    name="password"
                    type="password"
                  />
                </div>
                <label className="flex items-center w-fit gap-x-4 my-4">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                  />
                  Remember me
                </label>
                <button className="text-[#424769] h-14 bg-[#F9B17A] rounded-full px-8 font-medium">
                  {isLoading ? "Loading..." : "Log in"}
                </button>
                <span className="flex items-center text-sm pt-4 gap-2">
                  Don't have an account?{" "}
                  <p
                    onClick={() => navigate("/create-account")}
                    className="font-bold cursor-pointer"
                  >
                    Create free account
                  </p>
                </span>
              </form>
            </FormProvider>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;
