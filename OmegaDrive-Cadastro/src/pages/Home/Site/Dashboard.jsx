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
import {
  salvarRegistro,
  buscarRegistrosDoDia,
  deletarRegistro,
} from "@/services/api";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const salva = localStorage.getItem("selectedDate");
    const d = salva ? new Date(salva) : new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

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

  const formatarData = (data) =>
    data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  const onDateChange = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    setSelectedDate(d);
  };

  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate.toISOString());
  }, [selectedDate]);

  useEffect(() => {
    const carregarRegistros = async () => {
      try {
        const dataISO = selectedDate.toISOString().split("T")[0];
        const res = await buscarRegistrosDoDia(dataISO);

        const registros = res.map((r) => ({
          ...r,
          data: new Date(r.dataMarcada || r.data),
        }));

        setTodosRegistros(registros);
      } catch (e) {
        console.error(e);
        toast.error("Erro ao carregar registros do servidor");
        setTodosRegistros([]);
      }
    };

    carregarRegistros();
  }, [selectedDate]);

  useEffect(() => {
    setTotalViagens(todosRegistros.length);

    const totalKm = todosRegistros.reduce((soma, r) => {
      const kmIda = parseFloat(r.kmIda ?? r.kmInicial ?? 0);
      const kmVolta = parseFloat(r.kmVolta ?? r.kmFinal ?? 0);
      const km = kmVolta - kmIda;
      return soma + (isNaN(km) ? 0 : km);
    }, 0);

    setKmTotal(totalKm);
  }, [todosRegistros]);

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

  const handleSalvarModal = async (registro) => {
    if (!validarRegistro(registro)) return;

    try {
      const registroSalvo = await salvarRegistro(registroEditando, {
        ...registro,
        dataMarcada: selectedDate.toISOString(),
      });

      const atualizado = {
        ...registroSalvo,
        data: new Date(registroSalvo.dataMarcada || registroSalvo.data),
      };

      if (registroEditando) {
        setTodosRegistros((prev) =>
          prev.map((r) => (r.id === atualizado.id ? atualizado : r))
        );
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
      await deletarRegistro(id);
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
                onChange={onDateChange}
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
      <span>
        📅{" "}
        {registro.data && !isNaN(new Date(registro.data))
          ? new Date(registro.data).toLocaleDateString("pt-BR")
          : "Data inválida"}
      </span>
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
            <strong>Horário:</strong> {registro.horaInicio || "--"} →{" "}
            {registro.horaSaida || "--"}
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
