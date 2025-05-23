import { useEffect, useState } from "react";
import { Car, Plus } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Dashboard.css";
import "@/components/CalendarComponent.css";
import "@/components/ResumoDia.css";
import "@/components/ModalRegistro.css";
import { toast } from "sonner";
import ModalRegistro from "@/components/ModalRegistro";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mostrarModal, setMostrarModal] = useState(false);
  const [todosRegistros, setTodosRegistros] = useState([]);
  const [totalViagens, setTotalViagens] = useState(0);
  const [kmTotal, setKmTotal] = useState(0);
  const [registroEditando, setRegistroEditando] = useState(null);

  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    const registrosFiltrados = todosRegistros.filter((r) => {
      const dataRegistro = new Date(r.data);
      return dataRegistro.toDateString() === selectedDate.toDateString();
    });

    setTotalViagens(registrosFiltrados.length);

    const totalKm = registrosFiltrados.reduce((soma, r) => {
      const km = parseFloat(r.kmFinal) - parseFloat(r.kmInicial);
      return soma + (isNaN(km) ? 0 : km);
    }, 0);

    setKmTotal(totalKm);
  }, [selectedDate, todosRegistros]);

  const formatarData = (data) => {
    if (!(data instanceof Date) || isNaN(data)) return "Data inválida";
    return data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const handleAddRegistro = (novoRegistro) => {
    const registroCorrigido = {
      ...novoRegistro,
      data: new Date(novoRegistro.data),
    };
    setTodosRegistros((prev) => [...prev, registroCorrigido]);
    setMostrarModal(false);
  };

  const handleExcluir = (index) => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este registro?");
    if (!confirmacao) return;

    const novaLista = [...todosRegistros];
    novaLista.splice(index, 1);
    setTodosRegistros(novaLista);
    toast.success("Registro excluído com sucesso.");
  };

  const registrosDoDia = todosRegistros.filter((r) => {
    const dataRegistro = new Date(r.data);
    return dataRegistro.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="dashboard-container">
      {/* Topo com marca */}
      <div className="top-bar">
        <div className="branding-left">
          <Car className="car-icon" />
          <div className="branding-texts">
            <h1 className="title">Grupo Ômega</h1>
            <p className="subtitle">Controle de Km</p>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="main-content">
        {/* Lateral esquerda - Calendário e resumo */}
        <div className="sidebar">
          <div className="calendar-summary-card">
            <div className="calendar-wrapper">
              <div className="calendar-header">
                <h3>Calendário</h3>
                <span className="calendar-date-info">{formatarData(selectedDate)}</span>
              </div>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                locale="pt-BR"
              />
            </div>

            <div className="resumo-container">
              <h3 className="resumo-titulo">Resumo do Dia</h3>
              <span className="data-formatada">{selectedDate.toLocaleDateString("pt-BR")}</span>
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

        {/* Lado direito - Registros */}
        <div className="records-section">
          <button className="new-record-button" onClick={() => setMostrarModal(true)}>
            <Plus size={16} /> Adicionar Registro
          </button>

          <div className="registros-do-dia">
            <h3 className="text-lg font-semibold mt-4 mb-2">Registros do Dia</h3>
            {registrosDoDia.length === 0 ? (
              <p>Nenhum registro para esta data.</p>
            ) : (
              registrosDoDia.map((r, i) => (
                <div key={i} className="registro-card">
                  <div className="registro-header">
                    <span className="veiculo">🚗 {r.veiculo}</span>
                    <span className="data">📅 {new Date(r.data).toLocaleDateString()}</span>
                  </div>
                  <div className="registro-body">
                    <div className="dados-condutor">
                      <small>📝 Registrado por: <strong>{r.condutor}</strong></small>
                      {r.editadoPor && (
                        <small>✏️ Editado por: <strong>{r.editadoPor}</strong></small>
                      )}
                      <small>RG: {r.rg}</small>
                      <p><strong>Destino:</strong> {r.destino}</p>
                      <p><strong>Horário:</strong> {r.horaInicio} → {r.horaSaida}</p>
                    </div>
                    <div className="dados-km">
                      <div><strong>Inicial</strong><p>{r.kmInicial} km</p></div>
                      <div><strong>Final</strong><p>{r.kmFinal} km</p></div>
                      <div>
                        <strong>Total</strong>
                        <p style={{ fontWeight: "bold", color: "#4a00e0" }}>
                          {parseFloat(r.kmFinal) - parseFloat(r.kmInicial)} km
                        </p>
                      </div>
                    </div>
                    <div className="botoes">
                      <button
                        className="editar"
                        onClick={() => {
                          setRegistroEditando({ ...r, index: i });
                          setMostrarModal(true);
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button className="excluir" onClick={() => handleExcluir(i)}>
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Registro */}
      {mostrarModal && (
        <ModalRegistro
          dataSelecionada={selectedDate}
          onClose={() => {
            setMostrarModal(false);
            setRegistroEditando(null);
          }}
          onSalvar={(registro) => {
            if (registroEditando) {
              const novos = [...todosRegistros];
              novos[registroEditando.index] = { ...registro };
              setTodosRegistros(novos);
              toast.success("Registro editado com sucesso.");
            } else {
              handleAddRegistro(registro);
            }
            setRegistroEditando(null);
          }}
          registroInicial={registroEditando}
        />
      )}
    </div>
  );
};

export default Dashboard;

