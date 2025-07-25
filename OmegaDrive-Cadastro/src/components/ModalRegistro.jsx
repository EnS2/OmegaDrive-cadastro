import { useState, useEffect } from "react";
import { toast } from "sonner";

const formatDateToISODateString = (dateValue) => {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (isNaN(d)) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ModalRegistro = ({ registro, onClose, onSalvar, dataSelecionada }) => {
  const [formData, setFormData] = useState({
    condutor: "",
    rg: "",
    veiculo: "",
    placa: "",
    destino: "",
    kmInicial: "",
    kmFinal: "",
    horaInicio: "",
    horaSaida: "",
    data: formatDateToISODateString(dataSelecionada),
    editadoPor: "",
    observacoes: "",
  });

  const [erros, setErros] = useState({});

  useEffect(() => {
    if (registro) {
      setFormData({
        condutor: registro.condutor || "",
        rg: registro.rg || "",
        veiculo: registro.veiculo || "",
        placa: registro.placa || "",
        destino: registro.destino || "",
        kmInicial: registro.kmIda ?? "",
        kmFinal: registro.kmVolta ?? "",
        horaInicio: registro.horaInicio || "",
        horaSaida: registro.horaSaida || "",
        data: formatDateToISODateString(registro.dataMarcada || dataSelecionada),
        editadoPor: registro.editadoPor || "",
        observacoes: registro.observacoes || registro.observacao || "",
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        data: formatDateToISODateString(dataSelecionada),
      }));
    }
  }, [registro, dataSelecionada]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const novosErros = {};

    if (!formData.condutor.trim()) novosErros.condutor = "Informe o condutor.";
    if (!formData.rg.trim()) novosErros.rg = "Informe o RG.";
    if (!formData.veiculo.trim()) novosErros.veiculo = "Informe o veículo.";
    if (!formData.placa.trim()) novosErros.placa = "Informe a placa.";
    if (!formData.destino.trim()) novosErros.destino = "Informe o destino.";
    if (!formData.kmInicial) novosErros.kmInicial = "Informe o Km inicial.";
    if (!formData.kmFinal) novosErros.kmFinal = "Informe o Km final.";
    if (
      formData.kmInicial &&
      formData.kmFinal &&
      parseFloat(formData.kmFinal) < parseFloat(formData.kmInicial)
    ) {
      novosErros.kmFinal = "Km final não pode ser menor que o inicial.";
    }
    if (!formData.horaInicio) novosErros.horaInicio = "Informe a hora de início.";
    if (!formData.horaSaida) novosErros.horaSaida = "Informe a hora de saída.";

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      toast.error("Preencha os campos obrigatórios corretamente.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    const [ano, mes, dia] = formData.data.split("-");
    const dataMarcada = new Date(ano, mes - 1, dia, 12, 0, 0); // fixa 12h

    const payload = {
      id: registro?.id || null,
      condutor: formData.condutor,
      rgCondutor: formData.rg,
      dataMarcada: dataMarcada.toISOString(),
      horaInicio: formData.horaInicio,
      horaSaida: formData.horaSaida,
      destino: formData.destino,
      kmIda: parseFloat(formData.kmInicial),
      kmVolta: parseFloat(formData.kmFinal),
      observacao: formData.observacoes || null, // ✅ campo corrigido
      editadoPor: formData.editadoPor || null,
      veiculo: formData.veiculo,
      placa: formData.placa,
    };

    try {
      if (onSalvar) await onSalvar(payload);
      toast.success(
        registro ? "Registro atualizado com sucesso!" : "Registro salvo com sucesso!"
      );
      onClose();
    } catch (error) {
      const mensagemErro = error.response?.data?.error || "Erro ao salvar registro.";
      toast.error("Erro ao salvar: " + mensagemErro);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Fechar modal">
          &times;
        </button>

        <h2 className="modal-title">{registro ? "Editar Registro" : "Novo Registro"}</h2>
        <p className="modal-subtitle">Preencha os dados da viagem</p>

        <form className="form-registro" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {["condutor", "rg", "veiculo", "placa", "destino"].map((name) => (
              <div key={name}>
                <label htmlFor={name}>{name[0].toUpperCase() + name.slice(1)}</label>
                <input
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  aria-invalid={!!erros[name]}
                  aria-describedby={erros[name] ? `${name}-error` : undefined}
                />
                {erros[name] && (
                  <small id={`${name}-error`} className="erro" role="alert">
                    {erros[name]}
                  </small>
                )}
              </div>
            ))}

            {[
              { id: "kmInicial", label: "Km Inicial", type: "number" },
              { id: "kmFinal", label: "Km Final", type: "number" },
              { id: "horaInicio", label: "Hora de Início", type: "time" },
              { id: "horaSaida", label: "Hora de Saída", type: "time" },
            ].map(({ id, label, type }) => (
              <div key={id}>
                <label htmlFor={id}>{label}</label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  value={formData[id]}
                  onChange={handleChange}
                  min={type === "number" ? "0" : undefined}
                  step={type === "number" ? "1" : undefined}
                  aria-invalid={!!erros[id]}
                  aria-describedby={erros[id] ? `${id}-error` : undefined}
                />
                {erros[id] && (
                  <small id={`${id}-error`} className="erro" role="alert">
                    {erros[id]}
                  </small>
                )}
              </div>
            ))}

            <div className="full-width">
              <label htmlFor="data">Data</label>
              <input
                id="data"
                name="data"
                type="date"
                value={formData.data}
                onChange={handleChange}
              />
            </div>

            <div className="full-width">
              <label htmlFor="editadoPor">Editado por (opcional)</label>
              <input
                id="editadoPor"
                name="editadoPor"
                value={formData.editadoPor}
                onChange={handleChange}
              />
            </div>

            <div className="full-width">
              <label htmlFor="observacoes">Observações (opcional)</label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Digite anotações ou informações adicionais..."
                rows={4}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cinza" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-roxo">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRegistro;

