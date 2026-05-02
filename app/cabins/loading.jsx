import Spinner from "@/app/_components/Spinner";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Spinner />
    </div>
  );
}
