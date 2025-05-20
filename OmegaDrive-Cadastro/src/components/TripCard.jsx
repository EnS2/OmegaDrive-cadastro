const TripCard = ({ trip }) => {
    return (
        <div className="trip-card">
            <h3>{trip.driver}</h3>
            <p>Carro: {trip.car}</p>
            <p>Destino: {trip.destination}</p>
            <p>Horário: {trip.startTime} - {trip.endTime}</p>
            <p>KM: {trip.startKm} - {trip.endKm}</p>
        </div>
    );
};

export default TripCard;
