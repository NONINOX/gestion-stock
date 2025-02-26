import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded-lg">Produits: 50</div>
        <div className="bg-white p-4 shadow rounded-lg">Réservations: 12</div>
        <div className="bg-white p-4 shadow rounded-lg">Alertes Stock: 3</div>
      </div>
    </div>
  );
}

function QRCodeGenerator() {
  const [text, setText] = useState("https://mon-site.com/alerte-stock");

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">Générer un QR Code</h2>
      <QRCodeCanvas value={text} size={200} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <nav className="bg-blue-600 text-white p-4">
          <ul className="flex gap-4">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/qr">QR Code</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/qr" element={<QRCodeGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
