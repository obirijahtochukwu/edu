import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import axios from "axios";
import Endpoints from "../components/Endpoints";
import { useAuthContext } from "../Context";

export default function Results() {
  const { loginDetails } = useAuthContext();
  let authorizationHeader = "";

  if (loginDetails) {
    authorizationHeader = `Basic ${btoa(
      `${loginDetails.email}:${loginDetails.password}`
    )}`;
  } else {
    authorizationHeader = "Basic " + btoa("default-email:default-password");
  }
  const ProfilesFn = async () => {
    const response = await axios.get(Endpoints.profile, {
      headers: {
        Authorization: authorizationHeader,
      },
    });
    return response.data;
  };

  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: ProfilesFn,
  });
  const score = JSON.parse(localStorage.getItem("score") || "{}");

  return (
    <div>
      <Navbar />
      <main className="bg-black xl:min-h-screen h-full relative overflow-hidden flex flex-col justify-between">
        <div className="pt-24 container mx-auto min-h-screen flex flex-col justify-center relative z-20">
          <div className="flex items-center w-full text-[#F9B17A] gap-4">
            <hr className="w-full border-[#F9B17A]" />
            <h1 className="text-5xl font-bold">Results</h1>
            <hr className="w-full border-[#F9B17A]" />
          </div>
          <section className="lg:flex items-start gap-x-8 mx-auto lg:my-[4%] relative z-20">
            <div>
              <img
                src="/assets/completed_mascot.svg"
                alt="completed mascot"
                width="500"
                className="lg:w-auto w-1/2 lg:mx-0 mx-auto"
              />
            </div>
            <div>
              <div className="flex lg:flex-row flex-col-reverse lg:items-start items-center gap-x-8">
                <span className="w-48">
                  <h1 className="text-white text-5xl text-right lg:mt-20 my-8">
                    {profiles?.first_name} <br /> {profiles?.last_name}
                  </h1>
                </span>
                <span className="flex flex-col gap-y-2">
                  <h1 className="lg:text-8xl text-4xl text-[#2FAC66] font-bold">
                    {score?.passing_score}
                  </h1>
                </span>
              </div>
            </div>
          </section>
          <hr className="w-full border-[#F9B17A]" />
        </div>
        <img
          src="/assets/ellipse3.svg"
          alt="ellipse"
          className="absolute top-0 left-0 mt-24"
        />
      </main>
    </div>
  );
}
