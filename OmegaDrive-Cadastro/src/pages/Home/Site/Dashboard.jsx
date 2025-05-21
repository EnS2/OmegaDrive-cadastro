import { useEffect } from "react";
import Header from "@/layout/Header";
import "@/pages/Home/Site/Dashboard.css";

const Dashboard = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <>
      <Header />

      {/* Título no canto esquerdo dentro da área branca */}
      <div className="px-6 pt-4">
        <h1 className="text-2xl font-bold text-black">Grupo Ômega</h1>
      </div>

      <div className="dashboard-container">
        <div className="calendar-section">{/* ... */}</div>

        <div className="records-section">
          <div className="flex justify-between items-center mb-4">
            <h2>Registros</h2>
            <button className="new-record-button">Adicionar Registro</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
