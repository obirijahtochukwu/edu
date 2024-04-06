import { useQuery } from "@tanstack/react-query";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { useAuthContext } from "../Context";
import axios from "axios";
import Endpoints from "../components/Endpoints";

export default function Profile() {
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

  return (
    <>
      <Layout isProfile={true}>
        <main className="bg-black min-h-screen h-full relative pt-4 lg:pl-72 pl-3 lg:pr-8 pr-3 flex flex-col justify-between overflow-hidden">
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
            <form className="bg-[#676D9D] lg:rounded-[7rem] rounded-3xl text-white grid lg:grid-cols-2 grid-cols-1 gap-x-8 gap-y-16 lg:px-16 px-4 pt-8 pb-24">
              <label className="flex flex-col gap-y-4">
                Username
                <input
                  type="text"
                  value={profiles?.username}
                  readOnly
                  placeholder="@annajennifer123"
                  className="border border-solid border-[#2E3352] rounded-full bg-transparent h-14 pl-6 outline-none"
                />
              </label>
              <label className="flex flex-col gap-y-4">
                Email Address
                <input
                  type="email"
                  value={profiles?.email}
                  readOnly
                  placeholder="Email Address"
                  className="border border-solid border-[#2E3352] rounded-full bg-transparent h-14 pl-6 outline-none"
                />
              </label>
              <label className="flex flex-col gap-y-4">
                First Name
                <input
                  type="text"
                  value={profiles?.first_name}
                  readOnly
                  placeholder="Jennifer"
                  className="border border-solid border-[#2E3352] rounded-full bg-transparent h-14 pl-6 outline-none"
                />
              </label>
              <label className="flex flex-col gap-y-4">
                Last Name
                <input
                  type="text"
                  value={profiles?.last_name}
                  readOnly
                  placeholder="Anna"
                  className="border border-solid border-[#2E3352] rounded-full bg-transparent h-14 pl-6 outline-none"
                />
              </label>
            </form>
          </div>
          <img
            src="/assets/ellipse3.svg"
            alt=""
            className="absolute rotate-[121deg] top-40 w-1/2"
          />
          <Footer />
        </main>
      </Layout>
    </>
  );
}
