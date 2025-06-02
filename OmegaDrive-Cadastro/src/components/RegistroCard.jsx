const RegistroCard = ({ registros }) => {
    return (
        <div className="registros-do-dia">
            {registros.map((registro, index) => (
                <div key={index} className="registro-card">
                    <div className="registro-header">
                        <span>🚗 {registro.veiculo}</span>
                        <span>📅 {registro.data}</span>
                    </div>

                    <div className="registro-body">
                        <div className="dados-condutor">
                            <p>📄 Registrado por: <strong>{registro.nome}</strong></p>
                            <p>RG: {registro.rg}</p>
                        </div>

                        <div className="dados-km">
                            <div>
                                <strong>Inicial</strong>
                                <p>{registro.kmInicial} km</p>
                            </div>
                            <div>
                                <strong>Final</strong>
                                <p>{registro.kmFinal} km</p>
                            </div>
                            <div>
                                <strong>Total</strong>
                                <p>{registro.kmFinal - registro.kmInicial} km</p>
                            </div>
                        </div>

                        <div className="botoes">
                            <button className="editar">Editar</button>
                            <button className="excluir">Excluir</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RegistroCard;
