const RegistroCard = ({ registros, onEditar, onExcluir }) => {
    return (
        <div className="registros-do-dia">
            {registros.map((registro, index) => (
                <div key={registro.id || index} className="registro-card">
                    <div className="registro-header">
                        <span>🚗 {registro.veiculo || "Veículo não informado"}</span>
                        <span>
                            📅{" "}
                            {registro.data
                                ? new Date(registro.data).toLocaleDateString("pt-BR")
                                : "Data inválida"}
                        </span>
                    </div>

                    <div className="registro-body">
                        <div className="dados-condutor">
                            <p>
                                📄 Registrado por: <strong>{registro.nome || "Desconhecido"}</strong>
                            </p>
                            <p>RG: {registro.rg || registro.rgCondutor || "N/A"}</p>
                        </div>

                        <div className="dados-km">
                            <div>
                                <strong>Inicial</strong>
                                <p>{registro.kmInicial ?? registro.kmIda ?? "--"} km</p>
                            </div>
                            <div>
                                <strong>Final</strong>
                                <p>{registro.kmFinal ?? registro.kmVolta ?? "--"} km</p>
                            </div>
                            <div>
                                <strong>Total</strong>
                                <p>
                                    {(registro.kmFinal ?? registro.kmVolta ?? 0) -
                                        (registro.kmInicial ?? registro.kmIda ?? 0)}{" "}
                                    km
                                </p>
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
            ))}
        </div>
    );
};

export default RegistroCard;
