const RegistroCard = ({ registros, onEditar, onExcluir }) => {
    return (
        <div className="registros-do-dia">
            {registros.map((registro, index) => {
                const dataValida =
                    registro.data instanceof Date && !isNaN(registro.data)
                        ? registro.data.toLocaleDateString("pt-BR")
                        : "Data inválida";

                const kmInicial = parseFloat(registro.kmInicial ?? registro.kmIda ?? 0);
                const kmFinal = parseFloat(registro.kmFinal ?? registro.kmVolta ?? 0);
                const kmTotal = !isNaN(kmFinal - kmInicial) ? kmFinal - kmInicial : "--";

                return (
                    <div key={registro.id || index} className="registro-card">
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
                                    <strong>RG:</strong> {registro.rgCondutor || registro.rg || "N/A"}
                                </p>

                                {registro.destino && (
                                    <p>
                                        <strong>Destino:</strong> {registro.destino}
                                    </p>
                                )}

                                {(registro.horaSaida || registro.horaRetorno) && (
                                    <p>
                                        <strong>Horário:</strong>{" "}
                                        {registro.horaSaida || "--"} → {registro.horaRetorno || "--"}
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
                                    <p>{isNaN(kmInicial) ? "--" : `${kmInicial} km`}</p>
                                </div>
                                <div>
                                    <strong>Final</strong>
                                    <p>{isNaN(kmFinal) ? "--" : `${kmFinal} km`}</p>
                                </div>
                                <div>
                                    <strong>Total</strong>
                                    <p>{isNaN(kmTotal) ? "--" : `${kmTotal} km`}</p>
                                </div>
                            </div>

                            <div className="botoes">
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
            })}
        </div>
    );
};

export default RegistroCard;
