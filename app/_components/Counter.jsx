"use client";
import { useState } from "react";

const buttonStyleClass =
  "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded";

export default function Counter({ users }) {
  const [count, setCount] = useState(0);
  return (
    <>
      <p>There are {users.length} users</p>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setCount((val) => --val)}
          className={buttonStyleClass}
        >
          -
        </button>
        <span>{count}</span>
        <button
          onClick={() => setCount((val) => ++val)}
          className={buttonStyleClass}
        >
          +
        </button>
      </div>
    </>
  );
}
