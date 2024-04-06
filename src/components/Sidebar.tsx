import { BsClock } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { NavLink } from 'react-router-dom';

interface Props {
  isMascot?: boolean;
  isProfile?: boolean;
}

const Sidebar = ({ isMascot, isProfile }: Props) => {
  return (
    <div className="lg:block hidden fixed pt-28 pb-4 z-10 left-4 lg:h-screen">
      <main className="bg-[#4A5076] text-white h-full w-60 rounded-xl pt-8 flex flex-col justify-between">
        <div className="w-full flex flex-col items-center">
          <span className="flex items-center gap-x-2 border-b border-white w-full justify-center pb-4 text-2xl">
            {isProfile ? (
              <>
                <img src="/assets/icons/user.svg" alt="icon of a user" />
                <p>Profile</p>
              </>
            ) : (
              <>
                <img src="/assets/icons/hug.svg" alt="hug icon" />
                <p>My Lessons</p>
              </>
            )}
          </span>
          <div className="pt-8 flex flex-col gap-4 text-sm font-light">
            {isProfile ? (
              <>
                <span className="flex items-center gap-x-2 cursor-pointer">
                  <FiSettings />
                  <NavLink to='/change-password'>Change my password</NavLink>
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-x-2 cursor-pointer">
                  <BsClock />
                  <p>Recent Lesson</p>
                </span>
                <span className="flex items-center gap-x-2 cursor-pointer">
                  <BsClock />
                  <p>Week 5</p>
                </span>
                <span className="flex items-center gap-x-2 cursor-pointer">
                  <BsClock />
                  <p>Week 17</p>
                </span>
              </>
            )}
          </div>
        </div>
        {isMascot && (
          <div className="mx-auto pb-2">
            <img
              src="/assets/mascot2.svg"
              alt="mascot"
              width="200"
              className=""
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Sidebar;
