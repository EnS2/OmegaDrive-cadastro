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
  const [registroEditando, setRegistroEditando] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [totalViagens, setTotalViagens] = useState(0);
  const [kmTotal, setKmTotal] = useState(0);

  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate.toISOString());
  }, [selectedDate]);

  useEffect(() => {
    const carregarRegistros = async () => {
      try {
        if (!selectedDate || isNaN(selectedDate.getTime())) {
          toast.error("Data inválida selecionada.");
          return;
        }

        const dataFormatada = selectedDate.toISOString().split("T")[0];
        const resposta = await buscarRegistrosDoDia(dataFormatada);

        const registrosConvertidos = resposta.map((r) => ({
          ...r,
          data: new Date(r.dataMarcada || r.data || selectedDate),
        }));

        setRegistros(registrosConvertidos);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar registros do servidor");
        setRegistros([]);
      }
    };

    carregarRegistros();
  }, [selectedDate]);

  useEffect(() => {
    setTotalViagens(registros.length);

    const somaKm = registros.reduce((total, r) => {
      const inicio = parseFloat(r.kmIda ?? r.kmInicial ?? 0);
      const fim = parseFloat(r.kmVolta ?? r.kmFinal ?? 0);
      const diferenca = fim - inicio;
      return total + (isNaN(diferenca) ? 0 : diferenca);
    }, 0);

    setKmTotal(somaKm);
  }, [registros]);

  const formatarDataExtensa = (data) =>
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

  const validarRegistro = (registro) => {
    const { veiculo, rgCondutor, kmIda, kmVolta, horaSaida } = registro;
    if (!veiculo || !rgCondutor || !kmIda || !kmVolta || !horaSaida) {
      toast.error("Preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  };

  const handleSalvarRegistro = async (registro) => {
    if (!validarRegistro(registro)) return;

    try {
      const salvo = await salvarRegistro(registro.id, {
        ...registro,
        dataMarcada: selectedDate.toISOString().split("T")[0],
      });

      const novoRegistro = {
        ...salvo,
        data: new Date(salvo.dataMarcada || salvo.data),
      };

      if (registroEditando) {
        setRegistros((prev) =>
          prev.map((r) => (r.id === novoRegistro.id ? novoRegistro : r))
        );
        toast.success("Registro atualizado.");
      } else {
        setRegistros((prev) => [...prev, novoRegistro]);
        toast.success("Registro adicionado.");
      }

      setMostrarModal(false);
      setRegistroEditando(null);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar o registro.");
    }
  };

  const handleExcluirRegistro = async (id) => {
    const confirmar = window.confirm("Deseja excluir este registro?");
    if (!confirmar) return;

    try {
      await deletarRegistro(id);
      setRegistros((prev) => prev.filter((r) => r.id !== id));
      toast.success("Registro excluído.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir o registro.");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="top-bar">
        <div className="branding-left">
          <Car className="car-icon" />
          <div className="branding-texts">
            <h1 className="title">Grupo Ômega</h1>
            <p className="subtitle">Controle de KM</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        <aside className="sidebar">
          <div className="calendar-summary-card">
            <div className="calendar-wrapper">
              <h3>Calendário</h3>
              <span>{formatarDataExtensa(selectedDate)}</span>
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

            {registros.length === 0 ? (
              <p>Nenhum registro encontrado.</p>
            ) : (
              registros.map((r) => (
                <RegistroCard
                  key={r.id}
                  registro={r}
                  onEditar={() => {
                    setRegistroEditando(r);
                    setMostrarModal(true);
                  }}
                  onExcluir={() => handleExcluirRegistro(r.id)}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {mostrarModal && (
        <ModalRegistro
          dataSelecionada={selectedDate}
          onClose={() => {
            setMostrarModal(false);
            setRegistroEditando(null);
          }}
          onSalvar={handleSalvarRegistro}
          registro={registroEditando}
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
      <span>🚗 {registro.veiculo || "Veículo não informado"}</span>
      <span>
        📅 {registro.data ? new Date(registro.data).toLocaleDateString("pt-BR") : "Data inválida"}
      </span>
    </div>

    <div className="registro-body">
      <div className="dados-condutor">
        <small>🧑 {registro.condutor || "Condutor não informado"}</small>
        <small>🆔 RG: {registro.rgCondutor || "Não informado"}</small>

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

        {registro.observacoes && (
          <p>
            <strong>Observações:</strong> {registro.observacoes}
          </p>
        )}
      </div>

      <div className="dados-km">
        <div>
          <strong>Inicial</strong>
          <p>{registro.kmIda || registro.kmInicial || 0} km</p>
        </div>
        <div>
          <strong>Final</strong>
          <p>{registro.kmVolta || registro.kmFinal || 0} km</p>
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

