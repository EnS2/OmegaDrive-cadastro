import { useState, useEffect } from "react";
import { toast } from "sonner";

const ModalRegistro = ({ dataSelecionada, onClose, onSalvar }) => {
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
    data: dataSelecionada,
    editadoPor: "",
  });

  const [erros, setErros] = useState({});

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      data: dataSelecionada,
    }));
  }, [dataSelecionada]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "data" ? new Date(value) : value,
    }));
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

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      toast.error("Preencha os campos obrigatórios corretamente.");
    }

    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // ← impede recarregamento da página
    if (!validar()) return;

    onSalvar(formData);
    toast.success("Registro salvo com sucesso!");

    setFormData({
      condutor: "",
      rg: "",
      veiculo: "",
      placa: "",
      destino: "",
      kmInicial: "",
      kmFinal: "",
      horaInicio: "",
      horaSaida: "",
      data: dataSelecionada,
      editadoPor: "",
    });

    setErros({});
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Impede fechamento ao clicar dentro do modal
      >
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Novo Registro</h2>
        <p className="modal-subtitle">Preencha os dados da viagem</p>

        <form className="form-registro" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Campos de texto */}
            {[
              { label: "Condutor", name: "condutor" },
              { label: "RG", name: "rg" },
              { label: "Veículo", name: "veiculo" },
              { label: "Placa", name: "placa" },
              { label: "Destino", name: "destino" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label>{label}</label>
                <input name={name} value={formData[name]} onChange={handleChange} />
                {erros[name] && <small className="erro">{erros[name]}</small>}
              </div>
            ))}

            {/* Km */}
            <div>
              <label>Km Inicial</label>
              <input name="kmInicial" type="number" value={formData.kmInicial} onChange={handleChange} />
              {erros.kmInicial && <small className="erro">{erros.kmInicial}</small>}
            </div>
            <div>
              <label>Km Final</label>
              <input name="kmFinal" type="number" value={formData.kmFinal} onChange={handleChange} />
              {erros.kmFinal && <small className="erro">{erros.kmFinal}</small>}
            </div>

            {/* Horários */}
            <div>
              <label>Hora de Início</label>
              <input name="horaInicio" type="time" value={formData.horaInicio} onChange={handleChange} />
            </div>
            <div>
              <label>Hora de Saída</label>
              <input name="horaSaida" type="time" value={formData.horaSaida} onChange={handleChange} />
            </div>

            {/* Data */}
            <div className="full-width">
              <label>Data</label>
              <input
                name="data"
                type="date"
                value={
                  formData.data instanceof Date
                    ? formData.data.toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
              />
            </div>

            {/* Editado por */}
            <div className="full-width">
              <label>Editado por (opcional)</label>
              <input name="editadoPor" value={formData.editadoPor} onChange={handleChange} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cinza" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-roxo"
              onClick={(e) => e.stopPropagation()}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRegistro;
