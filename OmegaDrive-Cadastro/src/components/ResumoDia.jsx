const RegistroCard = ({ registros, onEditar, onExcluir }) => {
    return (
        <div className="registros-do-dia">
            {registros.map((registro, index) => (
                <div key={registro.id || index} className="registro-card">
                    <div className="registro-header">
                        <span>🚗 {registro.veiculo}</span>
                        <span>📅 {new Date(registro.dataMarcada).toLocaleDateString("pt-BR")}</span>
                    </div>

                    <div className="registro-body">
                        <div className="dados-condutor">
                            <p>📄 Registrado por: <strong>{registro.condutor}</strong></p>
                            <p>RG: {registro.rgCondutor}</p>
                        </div>

                        <div className="dados-km">
                            <div>
                                <strong>Inicial</strong>
                                <p>{registro.kmIda} km</p>
                            </div>
                            <div>
                                <strong>Final</strong>
                                <p>{registro.kmVolta} km</p>
                            </div>
                            <div>
                                <strong>Total</strong>
                                <p>{registro.kmVolta - registro.kmIda} km</p>
                            </div>
                        </div>

                        <div className="botoes">
                            <button className="editar" onClick={() => onEditar(registro)}>Editar</button>
                            <button className="excluir" onClick={() => onExcluir(registro.id)}>Excluir</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RegistroCard;
