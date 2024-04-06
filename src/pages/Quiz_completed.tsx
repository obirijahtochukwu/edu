import Navbar from "../components/Navbar";

export default function Quiz_completed() {
  return (
    <div>
      <Navbar />
      <main className="bg-black min-h-screen h-full relative flex flex-col justify-between">
        <div className="pt-24 container mx-auto xl:min-h-screen flex flex-col justify-center relative z-20">
          <div className="flex items-center w-full text-[#F9B17A] gap-4 py-4">
            <hr className="w-full border-[#F9B17A]" />
            <h1 className="text-5xl font-bold">Quiz</h1>
            <hr className="w-full border-[#F9B17A]" />
          </div>
          <section className="flex items-center my-[4%] relative z-20">
            <div className="relative w-full h-full flex justify-center">
              <img
                src="/assets/congrats.svg"
                alt="congrats image"
                className="mx-auto"
              />
              <img
                src="/assets/calculating_mascot.svg"
                alt="calculating mascot"
                className="absolute top-0"
              />
            </div>
          </section>
          <hr className="w-full border-[#F9B17A] py-4" />
        </div>
        <img
          src="/assets/ellipse_right.svg"
          alt="ellipse"
          className="absolute left-0 bottom-0"
        />
        <img
          src="/assets/ellipse_left.svg"
          alt="ellipse"
          className="absolute bottom-0 right-0"
        />
      </main>
    </div>
  );
}
