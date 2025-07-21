import React from "react";

const RegistroCard = ({ registro, onEditar, onExcluir }) => {
    const converterParaDataLocal = (dataUTCString) => {
        if (!dataUTCString || typeof dataUTCString !== "string") {
            return "Data não disponível";
        }

        const originalDate = new Date(dataUTCString);
        if (isNaN(originalDate.getTime())) return "Data inválida";

        // Ajusta para 12h para evitar problemas de fuso horário
        const ajustada = new Date(originalDate);
        ajustada.setHours(12, 0, 0, 0);

        return ajustada.toLocaleDateString("pt-BR");
    };

    const dataValida = converterParaDataLocal(registro.dataMarcada);


    const kmInicial = parseFloat(registro.kmInicial ?? registro.kmIda ?? 0);
    const kmFinal = parseFloat(registro.kmFinal ?? registro.kmVolta ?? 0);
    const kmTotal =
        !isNaN(kmInicial) && !isNaN(kmFinal) ? kmFinal - kmInicial : null;

    const formatarKm = (valor) =>
        typeof valor === "number" && !isNaN(valor) ? `${valor} km` : "--";

    const horarios =
        registro.horaSaida || registro.horaRetorno || registro.horaInicio
            ? `${registro.horaSaida ?? registro.horaInicio ?? "--"} → ${registro.horaRetorno ?? "--"}`
            : null;

    return (
        <div className="registro-card">
            <div className="registro-header">
                <span>🚗 {registro.veiculo || "Veículo não informado"}</span>
                <span>📅 {dataValida}</span>
            </div>

            <div className="registro-body">
                <div className="dados-condutor">
                    <p>
                        <strong>Condutor:</strong> {registro.condutor || "Desconhecido"}
                    </p>
                    <p>
                        <strong>RG:</strong> {registro.rgCondutor ?? registro.rg ?? "Não informado"}
                    </p>
                    {registro.destino && (
                        <p>
                            <strong>Destino:</strong> {registro.destino}
                        </p>
                    )}
                    {horarios && (
                        <p>
                            <strong>Horário:</strong> {horarios}
                        </p>
                    )}
                    {registro.observacao && (
                        <p>
                            <strong>Observações:</strong> {registro.observacao}
                        </p>
                    )}
                    {registro.editadoPor && (
                        <p>
                            <strong>Editado por:</strong> {registro.editadoPor}
                        </p>
                    )}
                </div>

                <div className="dados-km">
                    <div>
                        <strong>Inicial</strong>
                        <p>{formatarKm(kmInicial)}</p>
                    </div>
                    <div>
                        <strong>Final</strong>
                        <p>{formatarKm(kmFinal)}</p>
                    </div>
                    <div>
                        <strong>Total</strong>
                        <p>{kmTotal !== null ? formatarKm(kmTotal) : "--"}</p>
                    </div>
                </div>

                <div className="registro-actions">
                    <button className="editar" onClick={() => onEditar(registro)}>
                        Editar
                    </button>
                    <button className="excluir" onClick={() => onExcluir(registro.id)}>
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistroCard;



