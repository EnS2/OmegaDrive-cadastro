import { useEffect, useState } from "react";
import { Car, Plus } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Dashboard.css";
import "@/components/CalendarComponent.css";
import "@/components/ResumoDia.css";
import "@/components/ModalRegistro.css";
import { toast } from "sonner";
import axios from "axios";
import ModalRegistro from "@/components/ModalRegistro";

const API_BASE = "/api";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mostrarModal, setMostrarModal] = useState(false);
  const [todosRegistros, setTodosRegistros] = useState([]);
  const [totalViagens, setTotalViagens] = useState(0);
  const [kmTotal, setKmTotal] = useState(0);
  const [registroEditando, setRegistroEditando] = useState(null);

  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
    return () => { document.body.style.backgroundColor = ""; };
  }, []);

  // Formata data para ISO
  const formatISODate = (data) =>
    `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;

  // Formata data para exibição em português
  const formatarData = (data) =>
    data.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  // Carrega registros da data selecionada
  useEffect(() => {
    const carregarRegistros = async () => {
      try {
        const dataISO = formatISODate(selectedDate);
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get(`${API_BASE}/registros`, { params: { data: dataISO }, ...config });
        const registros = res.data.map((r) => ({ ...r, data: new Date(r.data) }));
        setTodosRegistros(registros);
      } catch (e) {
        console.error(e);
        toast.error("Erro ao carregar registros do servidor");
        setTodosRegistros([]);
      }
    };
    carregarRegistros();
  }, [selectedDate]);

  // Calcula total de viagens e km
  useEffect(() => {
    setTotalViagens(todosRegistros.length);
    const totalKm = todosRegistros.reduce((soma, r) => {
      const km = parseFloat(r.kmFinal) - parseFloat(r.kmInicial);
      return soma + (isNaN(km) ? 0 : km);
    }, 0);
    setKmTotal(totalKm);
  }, [todosRegistros]);

  // Valida dados obrigatórios do registro
  const validarRegistro = (registro) => {
    const { veiculo, condutor, kmInicial, kmFinal } = registro;
    if (!veiculo || !condutor || !kmInicial || !kmFinal) {
      toast.error("Preencha todos os campos obrigatórios: veículo, condutor e km.");
      return false;
    }
    return true;
  };

  // Função genérica de salvar (criar ou editar)
  const salvarRegistro = async (registro) => {
    const dataCorrigida = new Date(registro.data);
    dataCorrigida.setHours(0, 0, 0, 0);
    const registroFinal = { ...registro, data: dataCorrigida };

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (registroEditando) {
      return await axios.put(`${API_BASE}/registros/${registroFinal.id}`, registroFinal, config);
    } else {
      return await axios.post(`${API_BASE}/registros`, registroFinal, config);
    }
  };

  const handleSalvarModal = async (registro) => {
    if (!validarRegistro(registro)) return;

    try {
      const res = await salvarRegistro(registro);
      const atualizado = { ...res.data, data: new Date(res.data.data) };

      if (registroEditando) {
        setTodosRegistros((prev) => prev.map((r) => (r.id === atualizado.id ? atualizado : r)));
        toast.success("Registro editado com sucesso.");
      } else {
        setTodosRegistros((prev) => [...prev, atualizado]);
        toast.success("Registro adicionado com sucesso.");
      }

      setMostrarModal(false);
      setRegistroEditando(null);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao salvar registro.");
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este registro?")) return;

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`${API_BASE}/registros/${id}`, config);
      setTodosRegistros((prev) => prev.filter((r) => r.id !== id));
      toast.success("Registro excluído com sucesso.");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao excluir registro.");
    }
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
        <aside className="sidebar">
          <div className="calendar-summary-card">
            <div className="calendar-wrapper">
              <h3>Calendário</h3>
              <span>{formatarData(selectedDate)}</span>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                locale="pt-BR"
              />
            </div>

            <div className="resumo-container">
              <h3>Resumo do Dia</h3>
              <span>{selectedDate.toLocaleDateString("pt-BR")}</span>
              <div className="resumo-dados">
                <ResumoItem label="Viagens" valor={totalViagens} />
                <ResumoItem label="KM Total" valor={`${kmTotal} km`} />
              </div>
            </div>
          </div>
        </aside>

        <section className="records-section">
          <button className="new-record-button" onClick={() => setMostrarModal(true)}>
            <Plus size={16} /> Adicionar Registro
          </button>

          <div className="registros-do-dia">
            <h3>Registros do Dia</h3>

            {todosRegistros.length === 0 ? (
              <p>Nenhum registro para esta data.</p>
            ) : (
              todosRegistros.map((r) => (
                <RegistroCard
                  key={r.id}
                  registro={r}
                  onEditar={() => {
                    setRegistroEditando(r);
                    setMostrarModal(true);
                  }}
                  onExcluir={() => handleExcluir(r.id)}
                />
              ))
            )}
          </div>
        </section>
      </div>

      {mostrarModal && (
        <ModalRegistro
          dataSelecionada={selectedDate}
          onClose={() => {
            setMostrarModal(false);
            setRegistroEditando(null);
          }}
          onSalvar={handleSalvarModal}
          registroInicial={registroEditando}
        />
      )}
    </div>
  );
};

const ResumoItem = ({ label, valor }) => (
  <div className="resumo-card">
    <div className="resumo-label">{label}</div>
    <div className="resumo-valor">{valor}</div>
  </div>
);

const RegistroCard = ({ registro, onEditar, onExcluir }) => (
  <div className="registro-card">
    <div className="registro-header">
      <span>🚗 {registro.veiculo}</span>
      <span>📅 {new Date(registro.data).toLocaleDateString()}</span>
    </div>

    <div className="registro-body">
      <div className="dados-condutor">
        <small>📝 {registro.condutor}</small>
        {registro.editadoPor && <small>✏️ {registro.editadoPor}</small>}
        <small>RG: {registro.rg}</small>
        <p><strong>Destino:</strong> {registro.destino}</p>
        <p><strong>Horário:</strong> {registro.horaInicio} → {registro.horaSaida}</p>
        {registro.observacoes && (
          <p><strong>Observações:</strong> {registro.observacoes}</p>
        )}
      </div>

      <div className="dados-km">
        <div>
          <strong>Inicial</strong>
          <p>{registro.kmInicial} km</p>
        </div>
        <div>
          <strong>Final</strong>
          <p>{registro.kmFinal} km</p>
        </div>
        <div>
          <strong>Total</strong>
          <p style={{ fontWeight: "bold", color: "#4a00e0" }}>
            {parseFloat(registro.kmFinal) - parseFloat(registro.kmInicial)} km
          </p>
        </div>
      </div>

      <div className="botoes">
        <button className="editar" onClick={onEditar}>✏️ Editar</button>
        <button className="excluir" onClick={onExcluir}>🗑️ Excluir</button>
      </div>
    </div>
  </div>
);

export default Dashboard;
