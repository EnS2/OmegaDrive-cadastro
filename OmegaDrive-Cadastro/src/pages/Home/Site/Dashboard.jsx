import React, { useState } from 'react';
import CalendarComponent from '@components/CalendarComponent';
import TripCard from '@components/TripCard';
import Summary from '@components/Summary';
import '@components/TripCard.css';
import './Dashboard.css';

const Dashboard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [trips] = useState([
        {
            date: '2025-05-15',
            car: 'Toyota Corolla',
            driver: 'Carlos Oliveira',
            rg: '12.345.678-9',
            destination: 'Centro de Distribuição - São Paulo',
            startTime: '08:00',
            endTime: '10:30',
            startKm: 15000,
            endKm: 15150,
        },
        {
            date: '2025-05-15',
            car: 'Honda Civic',
            driver: 'Ana Silva',
            rg: '23.456.789-0',
            destination: 'Escritório Regional - Campinas',
            startTime: '13:00',
            endTime: '15:30',
            startKm: 22500,
            endKm: 22650,
        }
    ]);

    // Função para formatar a data localmente como "YYYY-MM-DD"
    const formatDateLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // meses começam em 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const selectedDateFormatted = formatDateLocal(selectedDate);

    const tripsOfDay = trips.filter(trip => trip.date === selectedDateFormatted);

    return (
        <div className="dashboard-container">
            <div className="calendar-section">
                <CalendarComponent value={selectedDate} onChange={setSelectedDate} />
                <Summary trips={tripsOfDay} />
            </div>
            <div className="records-section">
                <h2>Registros de {selectedDate.toLocaleDateString('pt-BR')}</h2>
                {tripsOfDay.map((trip, index) => (
                    <TripCard key={index} trip={trip} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
