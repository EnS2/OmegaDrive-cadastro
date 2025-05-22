import { useEffect } from "react";
import { Car } from "lucide-react";
import CalendarComponent from "@/components/CalendarComponent";
import ResumoDia from "@/components/ResumoDia";
import "@/pages/Home/Site/Dashboard.css";

const Dashboard = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="dashboard-container">
      {/* TOPO */}
      <div className="top-bar">
        <div className="branding-left">
          <Car className="car-icon" />
          <div className="branding-texts">
            <h1 className="title">Grupo Ômega</h1>
            <p className="subtitle">Controle de Km</p>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="main-content">
        {/* LADO ESQUERDO */}
        <div className="sidebar">
          <CalendarComponent />
          <ResumoDia />
        </div>

        {/* LADO DIREITO */}
        <div className="records-section">
          <h2 className="records-title"></h2>
          <button className="new-record-button">Adicionar Registro</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
