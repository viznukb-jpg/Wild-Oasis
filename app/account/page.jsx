import { auth } from "@/app/_lib/auth";

export const metadata = {
  title: "Account",
};

export default async function page() {
  const { user } = await auth();

  return (
    <div className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome, {user?.name}!
    </div>
  );
}
