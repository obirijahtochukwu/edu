import { useNavigate } from "react-router-dom";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import FormInputs from "../components/FormInputs";
import { createAccountFn } from "../components/hooks/Fetchdata";

const registerSchema = object({
  first_name: string().min(1, "First name is required").max(100),
  last_name: string().min(1, "Last name is required").max(100),
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

export type RegisterInput = TypeOf<typeof registerSchema>;

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

  // const queryClient = useQueryClient();

  const { handleSubmit } = methods;

  const { mutate } = useMutation({
    mutationFn: createAccountFn,
    onMutate() {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      toast.success("Sign up successful! Please login to continue.");
      console.log(data, "data");
      setIsLoading(false);
      navigate("/login");
    },
    onError: (err: Error) => {
      console.error(err);
      toast.error(err.message);
    },
    onSettled() {
      setIsLoading(false);
    },
  });

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
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
                <p>Sign in to your account</p>
                <span className="flex items-center justify-center gap-x-4 text-[#424769] h-14 bg-[#F9B17A] rounded-full my-8 font-medium cursor-pointer">
                  <img
                    src="/assets/icons/google_icon.svg"
                    alt="google icon"
                    className=""
                  />
                  <p> Continue with Google</p>
                </span>
                <div className="flex flex-col gap-y-6">
                  <FormInputs
                    label="First Name"
                    name="first_name"
                    type="text"
                  />
                  <FormInputs label="Last Name" name="last_name" type="text" />
                  <FormInputs label="Email" name="email" type="email" />
                  <FormInputs
                    label="Password"
                    name="password"
                    type="password"
                  />
                </div>
                <button className="text-[#424769] h-14 bg-[#F9B17A] rounded-full px-8 mt-6 font-medium">
                  {isLoading ? "Loading..." : "Create Account"}
                </button>
                <span className="flex items-center text-sm pt-4 gap-2">
                  Already have an account?
                  <p
                    onClick={() => navigate("/login")}
                    className="font-bold cursor-pointer"
                  >
                    Log in
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

export default Signup;
