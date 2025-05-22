import { useEffect, useState } from "react";
import { Car, Plus } from "lucide-react";
import CalendarComponent from "@/components/CalendarComponent";
import ResumoDia from "@/components/ResumoDia";
import "@/pages/Home/Site/Dashboard.css";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viagens, setViagens] = useState(0);
  const [totalKm, setTotalKm] = useState(0);

  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Zera os dados ao mudar o dia
    setViagens(0);
    setTotalKm(0);
  };

  return (
    <div className="dashboard-container">
      <div className="top-bar">
        <div className="branding-left">
          <Car className="car-icon" />
          <div className="branding-texts">
            <h1 className="title">Grupo Ômega</h1>
            <p className="subtitle">Controle de Km</p>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <div className="calendar-summary-card">
            <CalendarComponent
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />
            <ResumoDia
              selectedDate={selectedDate}
              viagens={viagens}
              totalKm={totalKm}
            />
          </div>
        </div>

        <div className="records-section">
          <h2 className="records-title"></h2>
          <button className="new-record-button">
            <Plus size={16} />
            Adicionar Registro
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
