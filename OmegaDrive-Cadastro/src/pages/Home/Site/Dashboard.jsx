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
import ModalRegistro from "@/components/ModalRegistro";
import RegistroCard from "@/components/RegistroCard";
import {
  salvarRegistro,
  buscarRegistrosDoDia,
  deletarRegistro,
} from "@/services/api";

const formatarDataBR = (data) =>
  data ? data.toLocaleDateString("pt-BR") : "Data inválida";

const formatarDataExtensa = (data) =>
  data
    .toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    .toLowerCase();

const formatarDataYYYYMMDD = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const getKm = (a, b) => {
  const valor = a ?? b;
  const num = parseFloat(valor);
  return isNaN(num) ? 0 : num;
};

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
        const dataFormatada = formatarDataYYYYMMDD(selectedDate);
        const resposta = await buscarRegistrosDoDia(dataFormatada);

        const registrosConvertidos = resposta.map((r) => ({
          ...r,
          data: r.dataMarcada ? new Date(r.dataMarcada) : null,
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
      const inicio = getKm(r.kmIda, r.kmInicial);
      const fim = getKm(r.kmVolta, r.kmFinal);
      const diferenca = fim - inicio;
      return total + (isNaN(diferenca) ? 0 : diferenca);
    }, 0);
    setKmTotal(somaKm);
  }, [registros]);

  const onDateChange = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    setSelectedDate(d);
  };

  const handleSalvarRegistro = async (registro) => {
    const dados = {
      ...registro,
      dataMarcada: formatarDataYYYYMMDD(selectedDate),
    };

    const salvo = await salvarRegistro(registroEditando?.id ?? null, dados);

    const novoRegistro = {
      ...salvo,
      data: salvo.dataMarcada ? new Date(salvo.dataMarcada) : null,
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
  };

  const handleExcluirRegistro = async (id) => {
    if (!window.confirm("Deseja excluir este registro?")) return;
    await deletarRegistro(id);
    setRegistros((prev) => prev.filter((r) => r.id !== id));
    toast.success("Registro excluído.");
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
              <span>{formatarDataBR(selectedDate)}</span>
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

export default Dashboard;
