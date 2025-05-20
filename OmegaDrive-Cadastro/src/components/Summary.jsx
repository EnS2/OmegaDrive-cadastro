// Summary.jsx
const Summary = ({ trips }) => {
    const totalKm = trips.reduce((acc, t) => acc + (t.endKm - t.startKm), 0);

    return (
        <div className="summary">
            <h3>Resumo</h3>
            <p>Total de viagens: {trips.length}</p>
            <p>Total de KM rodados: {totalKm} km</p>
        </div>
    );
};

export default Summary;
