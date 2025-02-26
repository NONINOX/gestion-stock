import React from "react";

export function Card({ children }) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      {children}
    </div>
  );
}
