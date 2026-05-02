import Spinner from "@/app/_components/Spinner";

export default function CabinSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Spinner />
      <p className="tetx-xl text-primary-200">Loading cabin data...</p>
    </div>
  );
}
