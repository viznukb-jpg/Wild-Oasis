import Link from "next/link";
import { auth } from "../_lib/auth";
import Image from "next/image";

const linkStyle =
  "hover:text-gray-400 hover:scale-105 transition-colors transition-transform duration-300";

export default async function Navigation() {
  const session = await auth();
  console.log(session);

  return (
    <ul className="flex items-center gap-12 z-1">
      <li>
        <Link className={linkStyle} href="/cabins">
          Cabins
        </Link>
      </li>

      <li>
        <Link className={linkStyle} href="/about">
          About
        </Link>
      </li>

      <li>
        {session?.user?.image ? (
          <Link
            className={`${linkStyle} flex gap-4 items-center`}
            href="/account"
          >
            <Image
              src={session.user.image}
              alt="avatar"
              width={35}
              height={35}
              className="rounded-full"
              referrerPolicy="no-referrer"
            />
            <p>Account</p>
          </Link>
        ) : (
          <Link className={linkStyle} href="/account">
            Guest area
          </Link>
        )}
      </li>
    </ul>
  );
}
