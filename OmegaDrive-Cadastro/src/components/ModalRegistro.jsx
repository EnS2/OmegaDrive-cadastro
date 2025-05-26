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
    observacoes: "",
  });

  const [erros, setErros] = useState({});

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("registroTemporario");
    if (dadosSalvos) {
      const dadosParseados = JSON.parse(dadosSalvos);
      setFormData({
        ...dadosParseados,
        data: new Date(dataSelecionada),
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        data: dataSelecionada,
      }));
    }
  }, [dataSelecionada]);

  useEffect(() => {
    localStorage.setItem("registroTemporario", JSON.stringify(formData));
  }, [formData]);

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

    if (!formData.horaInicio) novosErros.horaInicio = "Informe a hora de início.";
    if (!formData.horaSaida) novosErros.horaSaida = "Informe a hora de saída.";

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      toast.error("Preencha os campos obrigatórios corretamente.");
    }

    return Object.keys(novosErros).length === 0;
  };

  const handleClose = () => {
    localStorage.removeItem("registroTemporario");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    onSalvar({
      ...formData,
      data: new Date(formData.data),
      kmInicial: Number(formData.kmInicial),
      kmFinal: Number(formData.kmFinal),
    });

    toast.success("Registro salvo com sucesso!");
    localStorage.removeItem("registroTemporario");

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
      observacoes: "",
    });

    setErros({});
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <h2 className="modal-title">Novo Registro</h2>
        <p className="modal-subtitle">Preencha os dados da viagem</p>

        <form className="form-registro" onSubmit={handleSubmit}>
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
                />
                {erros[name] && <small className="erro">{erros[name]}</small>}
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
              />
              {erros.kmInicial && <small className="erro">{erros.kmInicial}</small>}
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
              />
              {erros.kmFinal && <small className="erro">{erros.kmFinal}</small>}
            </div>

            <div>
              <label htmlFor="horaInicio">Hora de Início</label>
              <input
                id="horaInicio"
                name="horaInicio"
                type="time"
                value={formData.horaInicio}
                onChange={handleChange}
              />
              {erros.horaInicio && <small className="erro">{erros.horaInicio}</small>}
            </div>
            <div>
              <label htmlFor="horaSaida">Hora de Saída</label>
              <input
                id="horaSaida"
                name="horaSaida"
                type="time"
                value={formData.horaSaida}
                onChange={handleChange}
              />
              {erros.horaSaida && <small className="erro">{erros.horaSaida}</small>}
            </div>

            <div className="full-width">
              <label htmlFor="data">Data</label>
              <input
                id="data"
                name="data"
                type="date"
                value={
                  formData.data
                    ? new Date(formData.data).toISOString().split("T")[0]
                    : ""
                }
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
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cinza" onClick={handleClose}>
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
