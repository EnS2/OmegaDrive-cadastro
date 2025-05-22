import { useEffect, useState } from "react";
import { Car, Plus } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Dashboard.css";
import "@/components/CalendarComponent.css";
import "@/components/ResumoDia.css";
import "@/components/ModalRegistro.css";
import "@/components/ModalRegistro.jsx";


const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalViagens, setTotalViagens] = useState(0);
  const [kmTotal, setKmTotal] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    setTotalViagens(0);
    setKmTotal(0);
  }, [selectedDate]);

  const formatarData = (data) => {
    if (!(data instanceof Date) || isNaN(data)) return "Data inválida";
    return data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

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
          <div className="calendar-summary-card">
            <div className="calendar-wrapper">
              <div className="calendar-header">
                <h3>Calendário</h3>
                <span className="calendar-date-info">
                  {formatarData(selectedDate)}
                </span>
              </div>

              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                locale="pt-BR"
              />
            </div>

            {/* Resumo do Dia */}
            <div className="resumo-container">
              <h3 className="resumo-titulo">Resumo do Dia</h3>
              <span style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                {selectedDate instanceof Date && !isNaN(selectedDate)
                  ? selectedDate.toLocaleDateString("pt-BR")
                  : ""}
              </span>
              <div className="resumo-dados">
                <div className="resumo-card">
                  <div className="resumo-label">Viagens</div>
                  <div className="resumo-valor">{totalViagens}</div>
                </div>
                <div className="resumo-card">
                  <div className="resumo-label">KM Total</div>
                  <div className="resumo-valor">{kmTotal} km</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO */}
        <div className="records-section">
          <button
            className="new-record-button"
            onClick={() => setMostrarModal(true)}
          >
            <Plus size={16} />
            Adicionar Registro
          </button>
        </div>
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <ModalRegistro
          dataSelecionada={selectedDate}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
