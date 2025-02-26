import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Stock.css"; // Import du CSS

const Stock = () => {
  const { boiteId } = useParams();
  const [materiel, setMateriel] = useState([]);
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const [quantiteMin, setQuantiteMin] = useState("");
  const [quantiteMax, setQuantiteMax] = useState("");
  const [quantitesARetirer, setQuantitesARetirer] = useState({});
  const [quantitesAAjouter, setQuantitesAAjouter] = useState({});

  useEffect(() => {
    const storedMateriel = JSON.parse(localStorage.getItem(`stock-boite-${boiteId}`)) || [];
    setMateriel(storedMateriel);
  }, [boiteId]);

  const ajouterMateriel = () => {
    if (!nom || !quantite || !quantiteMin || !quantiteMax) {
      return alert("Veuillez remplir tous les champs !");
    }
    
    const nouveauMateriel = { 
      id: Date.now(), 
      nom, 
      quantite: parseInt(quantite), 
      quantiteMin: parseInt(quantiteMin), 
      quantiteMax: parseInt(quantiteMax),
      recommander: false 
    };
    const nouveauStock = [...materiel, nouveauMateriel];

    setMateriel(nouveauStock);
    localStorage.setItem(`stock-boite-${boiteId}`, JSON.stringify(nouveauStock));
    
    setNom("");
    setQuantite("");
    setQuantiteMin("");
    setQuantiteMax("");
  };

  const supprimerMateriel = (id) => {
    const nouveauStock = materiel.filter(item => item.id !== id);
    setMateriel(nouveauStock);
    localStorage.setItem(`stock-boite-${boiteId}`, JSON.stringify(nouveauStock));
  };

  const handleQuantiteChange = (id, value) => {
    setQuantitesARetirer((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const retirerQuantite = (id) => {
    const quantiteRetiree = parseInt(quantitesARetirer[id]) || 0;

    const nouveauStock = materiel.map(item => {
      if (item.id === id) {
        const nouvelleQuantite = Math.max(item.quantite - quantiteRetiree, 0);
        return { ...item, quantite: nouvelleQuantite };
      }
      return item;
    });

    setMateriel(nouveauStock);
    localStorage.setItem(`stock-boite-${boiteId}`, JSON.stringify(nouveauStock));

    setQuantitesARetirer((prev) => ({
      ...prev,
      [id]: ""
    }));
  };

  const ajouterQuantite = (id) => {
    const quantiteAjoutee = parseInt(quantitesAAjouter[id]) || 0;

    const nouveauStock = materiel.map(item => {
      if (item.id === id) {
        const nouvelleQuantite = item.quantite + quantiteAjoutee;
        return { ...item, quantite: nouvelleQuantite };
      }
      return item;
    });

    setMateriel(nouveauStock);
    localStorage.setItem(`stock-boite-${boiteId}`, JSON.stringify(nouveauStock));

    setQuantitesAAjouter((prev) => ({
      ...prev,
      [id]: ""
    }));
  };

  const toggleRecommander = async (id) => {
    const nouveauStock = materiel.map(item => 
      item.id === id ? { ...item, recommander: !item.recommander } : item
    );

    setMateriel(nouveauStock);
    localStorage.setItem(`stock-boite-${boiteId}`, JSON.stringify(nouveauStock));

    const item = nouveauStock.find(item => item.id === id);
    if (item.recommander) {
      await envoyerNotificationDiscord(item);
    }
  };

  const envoyerNotificationDiscord = async (item) => {
    const webhookUrl = "https://discord.com/api/webhooks/1307841725942988920/2-aclLCHff2shcYwf3eDDvTWUJHt53a_1eDybwwzsO1xfLPQkMYRtvCTMxqGZ-Imzw7r";
    const message = {
      content: `📢 **Alerte Stock** 📢\n🔹 **Boîte**: ${boiteId}\n🔹 **Matériel**: ${item.nom}\n🔢 **Quantité actuelle**: ${item.quantite}\n⚠️ **Minimum**: ${item.quantiteMin} | 🔝 **Maximum**: ${item.quantiteMax}\n🚨 **À recommander !**`,
    };
  
    try {
      await axios.post(webhookUrl, message);
      alert(`Notification envoyée pour "${item.nom}" dans la boîte ${boiteId}`);
    } catch (error) {
      console.error("Erreur en envoyant la notification Discord:", error);
    }
  };

  return (
    <div className="stock-container">
      <h1 className="stock-title">Stock de la Boîte {boiteId}</h1>

      <div className="stock-form">
        <input type="text" placeholder="Nom du matériel" value={nom} onChange={(e) => setNom(e.target.value)} className="stock-input"/>
        <input type="number" placeholder="Quantité actuelle" value={quantite} onChange={(e) => setQuantite(e.target.value)} className="stock-input"/>
        <input type="number" placeholder="Quantité min" value={quantiteMin} onChange={(e) => setQuantiteMin(e.target.value)} className="stock-input"/>
        <input type="number" placeholder="Quantité max" value={quantiteMax} onChange={(e) => setQuantiteMax(e.target.value)} className="stock-input"/>
        <button onClick={ajouterMateriel} className="stock-button bg-green-500 hover:bg-green-700">Ajouter</button>
      </div>

      <table className="stock-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Quantité (Min / Max)</th>
            <th>Retirer</th>
            <th>Ajouter</th>
            <th>Recommander</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {materiel.map((item) => (
            <tr key={item.id}>
              <td>{item.nom}</td>
              <td>{item.quantite} (Min: {item.quantiteMin} / Max: {item.quantiteMax})</td>

              <td>
                <input type="number" value={quantitesARetirer[item.id] || ""} onChange={(e) => handleQuantiteChange(item.id, e.target.value)} className="stock-input-small" placeholder="Qté"/>
                <button onClick={() => retirerQuantite(item.id)} className="stock-button bg-yellow-500 hover:bg-yellow-700 ml-2">Retirer</button>
              </td>

              <td>
                <input type="number" value={quantitesAAjouter[item.id] || ""} onChange={(e) => setQuantitesAAjouter((prev) => ({ ...prev, [item.id]: e.target.value }))} className="stock-input-small" placeholder="Qté"/>
                <button onClick={() => ajouterQuantite(item.id)} className="stock-button bg-green-500 hover:bg-green-700 ml-2">Ajouter</button>
              </td>

              <td className="text-center"><input type="checkbox" checked={item.recommander} onChange={() => toggleRecommander(item.id)} /></td>

              <td><button onClick={() => supprimerMateriel(item.id)} className="stock-button bg-red-500 hover:bg-red-700">Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stock;
