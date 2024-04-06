import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface Props {
  isMascot?: boolean;
  isProfile?: boolean;
  children: ReactNode;
}

export default function Layout({ isMascot, isProfile, children }: Props) {
  return (
    <>
      <Navbar />
      <Sidebar isMascot={isMascot} isProfile={isProfile} />
      <main>{children}</main>
    </>
  );
}
