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

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <h3>Calendário</h3>
        <span className="calendar-date-info">
          {formatarData(selectedDate)}
        </span>
      </div>

      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        locale="pt-BR"
      />
    </div>
  );
};

export default CalendarComponent;
