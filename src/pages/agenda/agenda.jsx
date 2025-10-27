import { useState, useEffect, useRef } from "react";
import { api } from "../../services";
import styles from "./agenda.module.css";

const Agenda = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [alarmTime, setAlarmTime] = useState("");
  const audioRef = useRef(null);

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth(); // 0 = Janeiro
  const currentYear = today.getFullYear();

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDayClick = (day) => {
    if (day < currentDay) return; // não permite selecionar dias passados
    setSelectedDay(day);
  };

  const handleTimeChange = (e) => setAlarmTime(e.target.value);

  const handleSave = async () => {
    if (!selectedDay || !alarmTime) {
      alert("Selecione um dia e horário antes de salvar!");
      return;
    }

    const data = {
      User: {
        nome: "oi",
        tempo: {
          horario: 0,
          tipo: 0,
          agenda: {
            dia: selectedDay,
            mes: monthNames[currentMonth],
            horario: alarmTime,
          },
        },
      },
    };

    try {
      await api.post("/User", data);
      alert("Agenda salva com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar a agenda");
    }
  };

  // Checa a hora a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      if (!selectedDay || !alarmTime) return;

      const now = new Date();
      const dayMatches =
        now.getDate() === selectedDay &&
        now.getMonth() === currentMonth &&
        now.getFullYear() === currentYear;
      const timeMatches = now.toTimeString().slice(0, 5) === alarmTime;

      if (dayMatches && timeMatches && audioRef.current) {
        audioRef.current.play();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedDay, alarmTime]);

  return (
    <div className={styles.agendaContainer}>
      <h1 className={styles.title}>
        Agenda - {monthNames[currentMonth]} {currentYear}
      </h1>
      <div className={styles.daysGrid}>
        {days.map((day) => (
          <div
            key={day}
            className={`${styles.dayBlock} 
              ${selectedDay === day ? styles.selected : ""} 
              ${day < currentDay ? styles.pastDay : ""}`}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className={styles.alarmContainer}>
          <label>Horário do alarme:</label>
          <input
            type="time"
            value={alarmTime}
            onChange={handleTimeChange}
            className={styles.timeInput}
          />
          <button onClick={handleSave} className={styles.saveButton}>
            Salvar Agenda
          </button>
        </div>
      )}

      <audio ref={audioRef} src="/alarm.mp3" />
      {selectedDay && (
        <p className={styles.selectedText}>Dia selecionado: {selectedDay}</p>
      )}
    </div>
  );
};

export { Agenda };
