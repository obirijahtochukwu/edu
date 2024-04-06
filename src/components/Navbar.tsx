import { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../Context";

const Navbar = () => {
  const [dropdown, setDropdown] = useState(false);

  const showDropdown = () => {
    setDropdown(!dropdown);
  };

  const navigate = useNavigate();

  const { logout } = useAuthContext();

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("userData");
  //   window.location.href = "/login";
  // };

  return (
    <nav className="w-full pt-8 pb-4 flex flex-col justify-center items-center bg-black fixed z-50 shadow-md border-b border-white">
      <div className="container mx-auto px-3 h-[45%] flex justify-between items-center">
        <div className="flex items-center lg:w-1/3">
          <span
            className="flex items-center gap-x-1 font-bold text-2xl cursor-pointer"
            onClick={() => navigate("/")}
          >
            <h1 className=" text-white lg:text-5xl px-3 ">LOGO</h1>
          </span>
        </div>
        <div className="hidden lg:flex gap-6 items-end justify-between lg:w-2/3">
          <ul className="flex text-white text-sm gap-x-8">
            <NavLink
              to="/course"
              className="cursor-pointer hover:text-[#F9B17A]"
            >
              Course
            </NavLink>
            <NavLink to="/quiz" className="cursor-pointer hover:text-[#F9B17A]">
              Quiz
            </NavLink>
            <NavLink
              to="/weeks"
              className="cursor-pointer hover:text-[#F9B17A]"
            >
              Weeks
            </NavLink>
            <NavLink
              to="/notes"
              className="cursor-pointer hover:text-[#F9B17A]"
            >
              My Notes
            </NavLink>
          </ul>
          <div className="flex items-center gap-6">
            <span
              className="flex items-center pl-4 pr-8 gap-x-6 bg-[#F9B17A] py-3 rounded-full font-medium text-sm cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <img src="/assets/icons/profile.svg" alt="" />
              <p>My Profile</p>
            </span>
            <img
              src="/assets/icons/logout.svg"
              alt=""
              className="cursor-pointer"
              onClick={logout}
            />
          </div>
        </div>

        {dropdown ? (
          <div
            className="lg:hidden text-[22px] cursor-pointer text-white ml-[6px]"
            onClick={showDropdown}
          >
            <MdClose />
          </div>
        ) : (
          <div
            className="lg:hidden text-[22px] cursor-pointer text-white ml-[6px]"
            onClick={showDropdown}
          >
            <HiMenuAlt3 />
          </div>
        )}
      </div>

      {dropdown ? (
        <div
          className="lg:hidden bg-black w-full h-screen absolute top-20 transition ease-in-out duration-100 "
          onClick={showDropdown}
        >
          <ul className=" text-white text-sm pt-12 gap-8 h-full flex flex-col items-baseline px-3">
            <NavLink
              to="/course"
              className="cursor-pointer hover:text-[#F9B17A]"
            >
              Course
            </NavLink>
            <NavLink to="/quiz" className="cursor-pointer hover:text-[#F9B17A]">
              Quiz
            </NavLink>
            <NavLink
              to="/weeks"
              className="cursor-pointer hover:text-[#F9B17A]"
            >
              Weeks
            </NavLink>
            <NavLink
              to="/notes"
              className="cursor-pointer hover:text-[#F9B17A]"
            >
              My Notes
            </NavLink>
            <span
              className="flex items-center pl-4 pr-8 gap-x-6 bg-[#F9B17A] py-3 rounded-full font-medium text-sm"
              onClick={() => navigate("/profile")}
            >
              <img src="/assets/icons/profile.svg" alt="" />
              <p>My Profile</p>
            </span>
            <img
              src="/assets/icons/logout.svg"
              alt=""
              className="cursor-pointer"
              onClick={() => navigate("/login")}
            />
          </ul>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
