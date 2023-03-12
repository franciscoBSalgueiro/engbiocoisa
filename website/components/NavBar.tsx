import { Session } from "next-auth";
import Link from "next/link";

function NavBar({ session }: { session: Session | null }) {
  return (
    <nav className="bg-beige shadow border-b-2 border-black sticky top-0 w-full z-20">
      <div className="flex justify-between py-2 items-center px-40">
        <Link href="/">
          <p className="font-bold text-xl">MasterMomentum.</p>
        </Link>
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-evenly gap-6 pl-20">
            <Link
              className="hover:underline hover:font-bold decoration-black decoration-2"
              href="/browse"
            >
              Browse
            </Link>

            <Link
              className="hover:underline hover:font-bold decoration-black decoration-2"
              href="/blog"
            >
              News
            </Link>
            <Link
              className="hover:underline hover:font-bold decoration-black decoration-2"
              href="/about"
            >
              About
            </Link>
          </div>
          {session ? (
            <Link href="/profile">
              <button className="bg-black text-beige px-4 py-2 rounded border-2 border-black hover:bg-beige hover:text-black">
                Profile
              </button>
            </Link>
          ) : (
            <Link href="/signin">
              <button className="bg-black text-beige px-4 py-2 rounded border-2 border-black hover:bg-beige hover:text-black">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
