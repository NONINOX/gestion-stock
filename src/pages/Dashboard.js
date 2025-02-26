import { Link } from "react-router-dom";
import "./Dashboard.css"; // ✅ Import du CSS

const Dashboard = () => {
  const boites = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📦 Matériel Filot</h1>
      <div className="boite-grid">
        {boites.map((boiteId) => (
          <Link 
            key={boiteId} 
            to={`/stock/${boiteId}`}
            className="boite-item"
          >
            <img 
              src="./images/boites/default.jpg" 
              alt={`Boîte ${boiteId}`} 
              className="boite-image"
            />
            <div className="boite-label">Boîte {boiteId}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
