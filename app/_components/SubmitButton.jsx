"use client";

import { useFormStatus } from "react-dom";
import SpinnerMini from "@/app/_components/SpinnerMini";

const buttonStyle =
  "bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300";

export default function SubmitButton({ children, disabled = false }) {
  const { pending } = useFormStatus();
  if (pending)
    return (
      <div className="flex flex-col items-center">
        <SpinnerMini />
        <span>Updating...</span>
      </div>
    );

  return (
    <button disabled={disabled} className={buttonStyle}>
      {children}
    </button>
  );
}
