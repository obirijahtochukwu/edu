import Footer from "../components/Footer";
import Layout from "../components/Layout";

export default function End_of_lesson() {
  return (
    <>
      <Layout>
        <main className="bg-black min-h-screen h-full relative pt-4 lg:pl-72 pl-3 lg:pr-8 pr-3  flex flex-col justify-between">
          <div className="pt-24 mx-auto w-full h-full flex flex-col justify-between relative z-10">
            <section className="w-full lg:h-[60vh] ">
              <div className="h-full bg-[#2D3250] rounded-2xl flex flex-col">
                <div className="h-20 bg-[#4A5076] text-white rounded-2xl w-full flex flex-col justify-center items-center">
                  <h1 className="text-3xl">Congratulations!</h1>
                </div>
                <div className="lg:flex items-center justify-center h-full lg:px-0 px-3">
                  <section className="lg:w-1/2 flex justify-center">
                    <img
                      src="/assets/completed_mascot.svg"
                      alt="completed mascot"
                      width="300"
                    />
                  </section>
                  <section className="lg:w-1/3">
                    <p className="text-center text-white text-lg">
                      We have come to the end of the lesson. Do you want to take
                      the quiz now?
                    </p>
                    <div className="w-full flex gap-4 py-4 text-sm">
                      <button className="border border-solid border-white py-2 text-white w-full">
                        yes
                      </button>
                      <button className="border border-solid border-white py-2 text-white w-full">
                        not now
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            </section>
            <section className="my-8 flex flex-col gap-4 items-start">
              <input
                type="text"
                placeholder="What do you want to learn?"
                className="border border-solid border-white bg-transparent text-white opacity-60 h-10 px-2 lg:w-1/3"
              />
              <input
                type="text"
                placeholder="What is your level?"
                className="border border-solid border-white bg-transparent text-white opacity-60 h-10 px-2 lg:w-1/3"
              />
              <button className="bg-[#F9B17A] text-[#2E3352] px-12 py-1 rounded-full w-fit">
                Submit
              </button>
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
