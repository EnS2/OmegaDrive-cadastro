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

const formatarDataBR = (data) =>
  data ? new Date(data).toLocaleDateString("pt-BR") : "Data inválida";

const formatarDataExtensa = (data) =>
  data
    .toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    .toLowerCase();

const getKm = (a, b) => (a != null ? a : b != null ? b : 0);

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

  const onDateChange = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    setSelectedDate(d);
  };

  const validarRegistro = (registro) => {
    const { veiculo, condutor, rgCondutor, kmIda, kmVolta, horaSaida } = registro;
    if (!veiculo || !condutor || !rgCondutor || !kmIda || !kmVolta || !horaSaida) {
      toast.error("Preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  };

  const handleSalvarRegistro = async (registro) => {
    if (!validarRegistro(registro)) return;

    try {
      let salvo;
      if (registroEditando) {
        salvo = await salvarRegistro(registro.id, {
          ...registro,
          dataMarcada: selectedDate.toISOString().split("T")[0],
        });
      } else {
        salvo = await salvarRegistro(null, {
          ...registro,
          dataMarcada: selectedDate.toISOString().split("T")[0],
        });
      }

      const novoRegistro = {
        ...salvo,
        data: new Date(salvo.dataMarcada || salvo.data),
      };

      if (registroEditando) {
        setRegistros((prev) => prev.map((r) => (r.id === novoRegistro.id ? novoRegistro : r)));
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
        <div className="branding-left flex items-center gap-2">
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
              <Calendar onChange={onDateChange} value={selectedDate} locale="pt-BR" />
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
            className="new-record-button flex items-center gap-1"
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
  <div className="resumo-card text-center bg-white p-2 rounded-md shadow-sm">
    <div className="resumo-label font-medium text-gray-600">{label}</div>
    <div className="resumo-valor font-bold text-lg text-gray-800">{valor}</div>
  </div>
);

const RegistroCard = ({ registro, onEditar, onExcluir }) => (
  <div className="registro-card border p-4 rounded-lg shadow-sm bg-white space-y-2">
    <div className="registro-header flex justify-between items-center">
      <span>🚗 {registro.veiculo || "Veículo não informado"}</span>
      <span>📅 {formatarDataBR(registro.data)}</span>
    </div>

    <div className="registro-body space-y-1 text-sm text-gray-700">
      <div className="dados-condutor flex flex-col gap-1">
        <small>🧑 {registro.condutor || "Condutor não informado"}</small>
        <small>🆔 RG: {registro.rgCondutor || registro.rg || "Não informado"}</small>
        {registro.editadoPor && (
          <small className="text-xs text-blue-500">✏️ {registro.editadoPor}</small>
        )}
        {registro.destino && (
          <p>
            <strong>Destino:</strong> {registro.destino}
          </p>
        )}
        {(registro.horaSaida || registro.horaRetorno) && (
          <p>
            <strong>Horário:</strong> {registro.horaSaida || "--"} → {registro.horaRetorno || "--"}
          </p>
        )}
        {registro.observacao && (
          <p>
            <strong>Observações:</strong> {registro.observacao}
          </p>
        )}
      </div>

      <div className="dados-km flex justify-between mt-2 text-center text-xs">
        <div>
          <strong>Inicial</strong>
          <p>{getKm(registro.kmIda, registro.kmInicial)} km</p>
        </div>
        <div>
          <strong>Final</strong>
          <p>{getKm(registro.kmVolta, registro.kmFinal)} km</p>
        </div>
      </div>
    </div>

    <div className="registro-actions flex justify-end gap-2 mt-2">
      <button
        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
        onClick={onEditar}
      >
        ✏️ Editar
      </button>
      <button
        className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
        onClick={onExcluir}
      >
        🗑️ Excluir
      </button>
    </div>
  </div>
);

export default Dashboard;
