import { useState, useEffect } from "react";
import { toast } from "sonner";

const parseDate = (dateValue) => {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  return isNaN(d) ? "" : d.toISOString().split("T")[0];
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
    data: parseDate(dataSelecionada),
    editadoPor: "",
    observacoes: "",
  });

  const [erros, setErros] = useState({});

  useEffect(() => {
    if (registro) {
      setFormData({
        condutor: registro.condutor || "",
        rg: registro.rgCondutor || "",
        veiculo: registro.veiculo || "",
        placa: registro.placa || "",
        destino: registro.destino || "",
        kmInicial: registro.kmIda !== undefined ? registro.kmIda : "",
        kmFinal: registro.kmVolta !== undefined ? registro.kmVolta : "",
        horaInicio: registro.horaInicio || "",
        horaSaida: registro.horaSaida || "",
        data: parseDate(registro.dataMarcada || dataSelecionada),
        editadoPor: registro.editadoPor || "",
        observacoes: registro.observacoes || "",
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        data: parseDate(dataSelecionada),
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

    const payload = {
      id: registro?.id || null,
      condutor: formData.condutor,
      rgCondutor: formData.rg,
      dataMarcada: formData.data, // ✅ Correção aplicada aqui
      horaInicio: formData.horaInicio,
      horaSaida: formData.horaSaida,
      destino: formData.destino,
      kmIda: parseFloat(formData.kmInicial),
      kmVolta: parseFloat(formData.kmFinal),
      observacoes: formData.observacoes || null,
      editadoPor: formData.editadoPor || null,
      veiculo: formData.veiculo,
      placa: formData.placa,
    };

    try {
      if (onSalvar) await onSalvar(payload);
      toast.success(registro ? "Registro atualizado com sucesso!" : "Registro salvo com sucesso!");
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

            {[{ id: "kmInicial", label: "Km Inicial" },
            { id: "kmFinal", label: "Km Final" },
            { id: "horaInicio", label: "Hora de Início", type: "time" },
            { id: "horaSaida", label: "Hora de Saída", type: "time" }].map(
              ({ id, label, type = "number" }) => (
                <div key={id}>
                  <label htmlFor={id}>{label}</label>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    min="0"
                    value={formData[id]}
                    onChange={handleChange}
                    aria-invalid={!!erros[id]}
                    aria-describedby={erros[id] ? `${id}-error` : undefined}
                  />
                  {erros[id] && (
                    <small id={`${id}-error`} className="erro" role="alert">
                      {erros[id]}
                    </small>
                  )}
                </div>
              )
            )}

            <div className="full-width">
              <label htmlFor="data">Data</label>
              <input
                id="data"
                name="data"
                type="date"
                value={formData.data || ""}
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

