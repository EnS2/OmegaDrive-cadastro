import './TripCard.css'; // opcional se quiser estilização separada

const TripCard = ({ trip }) => {
    const totalKm = trip.endKm - trip.startKm;

    return (
        <div className="trip-card">
            <h3>{trip.car}</h3>
            <p><strong>{trip.driver}</strong> - RG: {trip.rg}</p>
            <p>{trip.destination}</p>
            <p>{trip.startTime} - {trip.endTime}</p>
            <p>
                Inicial: {trip.startKm} km | Final: {trip.endKm} km | <strong>Total: {totalKm} km</strong>
            </p>
        </div>
    );
};

export default TripCard;
