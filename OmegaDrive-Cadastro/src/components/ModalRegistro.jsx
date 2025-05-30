import { useState, useEffect } from "react";
import { toast } from "sonner";
import { salvarRegistro } from "../services/api";

const ModalRegistro = ({ registro, onClose, onSalvar }) => {
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
    data: new Date().toISOString().split("T")[0],
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
        data: registro.dataMarcada
          ? new Date(registro.dataMarcada).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        editadoPor: registro.editadoPor || "",
        observacoes: registro.observacao || "",
      });
    }
  }, [registro]);

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
      condutor: formData.condutor,
      rgCondutor: formData.rg,
      dataMarcada: formData.data,
      horaInicio: formData.horaInicio,
      horaSaida: formData.horaSaida,
      destino: formData.destino,
      kmIda: parseFloat(formData.kmInicial),
      kmVolta: parseFloat(formData.kmFinal),
      observacao: formData.observacoes || null,
      editadoPor: formData.editadoPor || null,
      veiculo: formData.veiculo,
      placa: formData.placa,
    };

    try {
      console.log("Enviando payload:", payload);

      const resultado = await salvarRegistro(registro, payload);

      toast.success(registro ? "Registro atualizado com sucesso!" : "Registro salvo com sucesso!");

      if (onSalvar) onSalvar(resultado);
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
            {[
              { label: "Condutor", name: "condutor" },
              { label: "RG", name: "rg" },
              { label: "Veículo", name: "veiculo" },
              { label: "Placa", name: "placa" },
              { label: "Destino", name: "destino" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label htmlFor={name}>{label}</label>
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

            <div>
              <label htmlFor="kmInicial">Km Inicial</label>
              <input
                id="kmInicial"
                name="kmInicial"
                type="number"
                min="0"
                value={formData.kmInicial}
                onChange={handleChange}
                aria-invalid={!!erros.kmInicial}
                aria-describedby={erros.kmInicial ? "kmInicial-error" : undefined}
              />
              {erros.kmInicial && (
                <small id="kmInicial-error" className="erro" role="alert">
                  {erros.kmInicial}
                </small>
              )}
            </div>

            <div>
              <label htmlFor="kmFinal">Km Final</label>
              <input
                id="kmFinal"
                name="kmFinal"
                type="number"
                min="0"
                value={formData.kmFinal}
                onChange={handleChange}
                aria-invalid={!!erros.kmFinal}
                aria-describedby={erros.kmFinal ? "kmFinal-error" : undefined}
              />
              {erros.kmFinal && (
                <small id="kmFinal-error" className="erro" role="alert">
                  {erros.kmFinal}
                </small>
              )}
            </div>

            <div>
              <label htmlFor="horaInicio">Hora de Início</label>
              <input
                id="horaInicio"
                name="horaInicio"
                type="time"
                value={formData.horaInicio}
                onChange={handleChange}
                aria-invalid={!!erros.horaInicio}
                aria-describedby={erros.horaInicio ? "horaInicio-error" : undefined}
              />
              {erros.horaInicio && (
                <small id="horaInicio-error" className="erro" role="alert">
                  {erros.horaInicio}
                </small>
              )}
            </div>

            <div>
              <label htmlFor="horaSaida">Hora de Saída</label>
              <input
                id="horaSaida"
                name="horaSaida"
                type="time"
                value={formData.horaSaida}
                onChange={handleChange}
                aria-invalid={!!erros.horaSaida}
                aria-describedby={erros.horaSaida ? "horaSaida-error" : undefined}
              />
              {erros.horaSaida && (
                <small id="horaSaida-error" className="erro" role="alert">
                  {erros.horaSaida}
                </small>
              )}
            </div>

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
