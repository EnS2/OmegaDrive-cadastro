
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

const API_BASE = "/api/registrar";  // <-- usando proxy para API

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mostrarModal, setMostrarModal] = useState(false);
  const [todosRegistros, setTodosRegistros] = useState([]);
  const [totalViagens, setTotalViagens] = useState(0);
  const [kmTotal, setKmTotal] = useState(0);
  const [registroEditando, setRegistroEditando] = useState(null);

  // Ajusta background só uma vez
  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Função para formatar data para yyyy-mm-dd
  const formatISODate = (data) =>
    `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;

  // Função para formatar data para exibição tipo "quinta-feira, 9 de junho"
  const formatarData = (data) =>
    data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  // Carrega registros da API toda vez que selectedDate muda
  useEffect(() => {
    const carregarRegistros = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Usuário não autenticado");
          setTodosRegistros([]);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_BASE}`, config);

        if (!Array.isArray(res.data)) {
          toast.error("Erro ao carregar registros: resposta inválida.");
          setTodosRegistros([]);
          return;
        }

        // Mapeia datas para objetos Date
        const registros = res.data.map((r) => ({
          ...r,
          data: new Date(r.dataMarcada || r.data),
        }));

        const dataSelecionadaISO = formatISODate(selectedDate);

        // Filtra registros para a data selecionada (comparação yyyy-mm-dd)
        const registrosFiltrados = registros.filter(
          (r) => formatISODate(new Date(r.data)) === dataSelecionadaISO
        );

        setTodosRegistros(registrosFiltrados);
      } catch (e) {
        console.error(e);
        toast.error("Erro ao carregar registros do servidor");
        setTodosRegistros([]);
      }
    };

    carregarRegistros();
  }, [selectedDate]);

  // Atualiza totais quando registros mudam
  useEffect(() => {
    setTotalViagens(todosRegistros.length);

    const totalKm = todosRegistros.reduce((soma, r) => {
      const kmIda = parseFloat(r.kmIda || r.kmInicial);
      const kmVolta = parseFloat(r.kmVolta || r.kmFinal);
      const km = kmVolta - kmIda;
      return soma + (isNaN(km) ? 0 : km);
    }, 0);

    setKmTotal(totalKm);
  }, [todosRegistros]);

  // Validação simples antes de salvar
  const validarRegistro = (registro) => {
    const { veiculo, rgCondutor, kmIda, kmVolta, horaSaida } = registro;
    if (!veiculo || !rgCondutor || !kmIda || !kmVolta || !horaSaida) {
      toast.error("Preencha todos os campos obrigatórios: veículo, condutor, km, hora de saída.");
      return false;
    }
    return true;
  };

  // Salva registro (POST ou PUT)
  const salvarRegistro = async (registro) => {
    const dataMarcada = new Date(registro.data);
    dataMarcada.setHours(0, 0, 0, 0);

    const registroFinal = {
      dataMarcada: dataMarcada.toISOString(),
      horaInicio: registro.horaInicio || null,
      horaSaida: registro.horaSaida,
      destino: registro.destino || null,
      kmIda: parseFloat(registro.kmIda || registro.kmInicial),
      kmVolta: parseFloat(registro.kmVolta || registro.kmFinal),
      observacao: registro.observacao || registro.observacoes || null,
      veiculo: registro.veiculo,
      placa: registro.placa,
      rgCondutor: registro.rgCondutor || registro.rg || "",
    };

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (registroEditando) {
      return await axios.put(`${API_BASE}/${registro.id}`, registroFinal, config);
    } else {
      return await axios.post(`${API_BASE}`, registroFinal, config);
    }
  };

  // Handler ao salvar pelo modal
  const handleSalvarModal = async (registro) => {
    if (!validarRegistro(registro)) return;

    try {
      const res = await salvarRegistro(registro);
      const atualizado = { ...res.data, data: new Date(res.data.dataMarcada) };

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

  // Excluir registro
  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este registro?")) return;

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`${API_BASE}/${id}`, config);
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
              <Calendar onChange={setSelectedDate} value={selectedDate} locale="pt-BR" />
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
          <button
            className="new-record-button"
            onClick={() => {
              setRegistroEditando(null);
              setMostrarModal(true);
            }}
          >
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
        <small>📝 {registro.rgCondutor || registro.condutor}</small>
        {registro.editadoPor && <small>✏️ {registro.editadoPor}</small>}
        {registro.destino && <p><strong>Destino:</strong> {registro.destino}</p>}
        {(registro.horaInicio || registro.horaSaida) && (
          <p>
            <strong>Horário:</strong> {registro.horaInicio || "--"} → {registro.horaSaida || "--"}
          </p>
        )}
        {registro.observacao && <p><strong>Observações:</strong> {registro.observacao}</p>}
      </div>

      <div className="dados-km">
        <div>
          <strong>Inicial</strong>
          <p>{registro.kmIda || registro.kmInicial} km</p>
        </div>
        <div>
          <strong>Final</strong>
          <p>{registro.kmVolta || registro.kmFinal} km</p>
        </div>
      </div>
    </div>

    <div className="registro-actions">
      <button className="editar-btn" onClick={onEditar}>
        Editar
      </button>
      <button className="excluir-btn" onClick={onExcluir}>
        Excluir
      </button>
    </div>
  </div>
);

export default Dashboard;
