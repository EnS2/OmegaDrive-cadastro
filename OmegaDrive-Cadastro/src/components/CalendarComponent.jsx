import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarComponent.css";

const CalendarComponent = ({ selectedDate, onDateChange }) => {
  const formatarData = (data) => {
    return data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  // Ajusta a hora para 12:00 para evitar problemas com fuso horário
  const ajustarDataParaMeioDia = (data) => {
    const novaData = new Date(data);
    novaData.setHours(12, 0, 0, 0);
    return novaData;
  };

  const handleDateChange = (data) => {
    const corrigida = ajustarDataParaMeioDia(data);
    onDateChange(corrigida);
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <h3>Calendário</h3>
        <span className="calendar-date-info">
          {formatarData(selectedDate)}
        </span>
      </div>

      <Calendar
        onChange={handleDateChange}
        value={ajustarDataParaMeioDia(selectedDate)}
        locale="pt-BR"
      />
    </div>
  );
};

export default CalendarComponent;
