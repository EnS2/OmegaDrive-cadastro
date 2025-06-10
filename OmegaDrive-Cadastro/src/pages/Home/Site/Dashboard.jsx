// Dashboard.jsx
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

const API_BASE = "/api/registrar";
const API_GET = "/registro";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mostrarModal, setMostrarModal] = useState(false);
  const [todosRegistros, setTodosRegistros] = useState([]); // todos os registros
  const [registrosDoDia, setRegistrosDoDia] = useState([]); // registros filtrados
  const [totalViagens, setTotalViagens] = useState(0);
  const [kmTotal, setKmTotal] = useState(0);
  const [registroEditando, setRegistroEditando] = useState(null);

  // Zera hora para comparar só a data
  const zerarHora = (data) => {
    const d = new Date(data);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Carrega todos os registros do backend ao montar o componente
  useEffect(() => {
    const carregarRegistros = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Usuário não autenticado");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(API_GET, config);

        if (!Array.isArray(res.data)) {
          toast.error("Erro ao carregar registros: resposta inválida.");
          setTodosRegistros([]);
          return;
        }

        // Converte data para Date e zera horas
        const registros = res.data.map((r) => {
          const dataRegistro = new Date(r.dataMarcada || r.data);
          dataRegistro.setHours(0, 0, 0, 0);
          return { ...r, dataRegistro };
        });

        setTodosRegistros(registros);
      } catch (e) {
        console.error(e);
        toast.error("Erro ao carregar registros do servidor");
      }
    };

    carregarRegistros();
  }, []);

  // Filtra os registros toda vez que mudar selectedDate ou todosRegistros
  useEffect(() => {
    const dataSelecionada = zerarHora(selectedDate);

    const filtrados = todosRegistros.filter(
      (r) => r.dataRegistro.getTime() === dataSelecionada.getTime()
    );

    setRegistrosDoDia(filtrados);
  }, [selectedDate, todosRegistros]);

  // Atualiza resumo (viagens e km) quando registros do dia mudam
  useEffect(() => {
    setTotalViagens(registrosDoDia.length);

    const totalKm = registrosDoDia.reduce((soma, r) => {
      const kmIda = parseFloat(r.kmIda ?? r.kmInicial ?? 0);
      const kmVolta = parseFloat(r.kmVolta ?? r.kmFinal ?? 0);
      const km = kmVolta - kmIda;
      return soma + (isNaN(km) ? 0 : km);
    }, 0);

    setKmTotal(totalKm);
  }, [registrosDoDia]);

  const validarRegistro = (registro) => {
    const { veiculo, rgCondutor, kmIda, kmVolta, horaSaida } = registro;
    if (!veiculo || !rgCondutor || !kmIda || !kmVolta || !horaSaida) {
      toast.error(
        "Preencha todos os campos obrigatórios: veículo, condutor, km, hora de saída."
      );
      return false;
    }
    return true;
  };

  const salvarRegistro = async (registro) => {
    let dataMarcadaObj =
      registro.data instanceof Date ? registro.data : new Date(registro.data);
    if (isNaN(dataMarcadaObj.getTime())) dataMarcadaObj = new Date();
    dataMarcadaObj.setHours(0, 0, 0, 0);
    const dataMarcadaISO = dataMarcadaObj.toISOString();

    const registroFinal = {
      dataMarcada: dataMarcadaISO,
      horaInicio: registro.horaInicio || null,
      horaSaida: registro.horaSaida,
      destino: registro.destino || null,
      kmIda: parseFloat(registro.kmIda ?? registro.kmInicial),
      kmVolta: parseFloat(registro.kmVolta ?? registro.kmFinal),
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
      return await axios.post(API_BASE, registroFinal, config);
    }
  };

  const handleSalvarModal = async (registro) => {
    if (!validarRegistro(registro)) return;

    try {
      const res = await salvarRegistro(registro);
      const atualizado = {
        ...res.data,
        dataRegistro: new Date(res.data.dataMarcada || res.data.data),
      };
      atualizado.dataRegistro.setHours(0, 0, 0, 0);

      // Atualiza o estado todosRegistros para manter a lista completa
      setTodosRegistros((prev) => {
        if (registroEditando) {
          // editar registro existente
          return prev.map((r) => (r.id === atualizado.id ? atualizado : r));
        } else {
          // adicionar novo registro
          return [...prev, atualizado];
        }
      });

      toast.success(registroEditando ? "Registro editado com sucesso." : "Registro adicionado com sucesso.");
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

      await axios.delete(`${API_BASE}/${id}`, config);
      setTodosRegistros((prev) => prev.filter((r) => r.id !== id));
      toast.success("Registro excluído com sucesso.");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao excluir registro.");
    }
  };

  const formatarData = (data) =>
    data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

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

            {registrosDoDia.length === 0 ? (
              <p>Nenhum registro para esta data.</p>
            ) : (
              registrosDoDia.map((r) => (
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
      <span>📅 {new Date(registro.dataRegistro || registro.data).toLocaleDateString()}</span>
    </div>

    <div className="registro-body">
      <div className="dados-condutor">
        <small>📝 {registro.rgCondutor || registro.condutor}</small>
        {registro.editadoPor && <small>✏️ {registro.editadoPor}</small>}
        {registro.destino && (
          <p>
            <strong>Destino:</strong> {registro.destino}
          </p>
        )}
        {(registro.horaInicio || registro.horaSaida) && (
          <p>
            <strong>Horário:</strong> {registro.horaInicio || "--"} → {registro.horaSaida || "--"}
          </p>
        )}
        {registro.observacao && (
          <p>
            <strong>Observações:</strong> {registro.observacao}
          </p>
        )}
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
      <button onClick={onEditar}>Editar</button>
      <button onClick={onExcluir}>Excluir</button>
    </div>
  </div>
);

export default Dashboard;
