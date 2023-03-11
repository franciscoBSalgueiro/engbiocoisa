import { Session } from "next-auth";
import NavBar from "./NavBar";

function BaseLayout({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar session={session} />
      {children}
    </>
  );
}

export default BaseLayout;
