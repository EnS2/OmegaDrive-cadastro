// RegistroCard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const RegistroCard = () => {
    const [registros, setRegistros] = useState([]);

    useEffect(() => {
        const buscarRegistros = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/registros");

                const dados = response.data.map((item) => ({
                    veiculo: item.veiculo,
                    data: new Date(item.dataMarcada).toLocaleDateString("pt-BR"),
                    nome: item.condutor,
                    rg: item.rgCondutor,
                    kmInicial: item.kmIda,
                    kmFinal: item.kmVolta,
                }));

                setRegistros(dados);
            } catch (error) {
                console.error("Erro ao buscar registros:", error);
            }
        };

        buscarRegistros();
    }, []);

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
                            <p>
                                📄 Registrado por: <strong>{registro.nome}</strong>
                            </p>
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


