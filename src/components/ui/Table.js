import React from "react";

const Table = ({ children }) => {
  return (
    <table className="border border-gray-300 w-full text-left">
      {children}
    </table>
  );
};

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-100">{children}</thead>
);

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableRow = ({ children }) => (
  <tr className="border-b border-gray-300">{children}</tr>
);

export const TableCell = ({ children }) => (
  <td className="p-2 border-r border-gray-300">{children}</td>
);

export default Table;
