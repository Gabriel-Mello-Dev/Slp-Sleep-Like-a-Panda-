// src/components/Agenda/Agenda.jsx
import { useState, useEffect, useRef } from "react";
import { api } from "../../services";
import styles from "./agenda.module.css";

const Agenda = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [alarmTime, setAlarmTime] = useState("");
  const [message, setMessage] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [triggered, setTriggered] = useState(new Set());
  const audioRef = useRef(new Audio("/alarme.mp3")); // <--- 1 único audio

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const rawUserId = localStorage.getItem("userId");

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

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await api.get("/tempos");
        setSchedules(res.data || []);
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
      }
    };
    fetchSchedules();
  }, []);

  const handleDayClick = (day) => {
    if (day < currentDay) return;
    setSelectedDay(day);
    const existing = schedules.find((a) => a.dia === day);
    if (existing) {
      setAlarmTime(existing.horario);
      setMessage(existing.mensagem);
    } else {
      setAlarmTime("");
      setMessage("");
    }
  };

  const handleSave = async () => {
    if (!selectedDay || !alarmTime || !message) {
      alert("Preencha todos os campos!");
      return;
    }

    const newAgenda = {
      dia: selectedDay,
      mes: monthNames[currentMonth],
      horario: alarmTime,
      mensagem: message,
      userId: rawUserId,
    };

    try {
      const existing = schedules.find(
        (a) => a.dia === selectedDay && a.userId === rawUserId
      );
      if (existing) {
        await api.put(`/tempos/${existing.id}`, newAgenda);
      } else {
        await api.post("/tempos", newAgenda);
      }

      const res = await api.get("/tempos");
      setSchedules(res.data);
      alert("Agendamento salvo!");
      setSelectedDay(null);
      setAlarmTime("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar no banco.");
    }
  };

  // === Verifica alarmes ===
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const currentDayNum = now.getDate();

      schedules.forEach((agenda) => {
        const alreadyTriggered = triggered.has(agenda.id);

        if (
          agenda.dia === currentDayNum &&
          agenda.horario === currentTime &&
          !alreadyTriggered
        ) {
          // Toca apenas 1 vez usando audioRef
          audioRef.current.loop = true;
          audioRef.current.play().catch(() => {});

          setActiveAlarm(agenda);
          setTriggered((prev) => new Set(prev).add(agenda.id));
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [schedules, triggered]);

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setActiveAlarm(null);
  };

  return (
    <div className={styles.agendaContainer}>
      <h1 className={styles.title}>
        Agenda - {monthNames[currentMonth]} {currentYear}
      </h1>

      <div className={styles.daysGrid}>
        {days.map((day) => {
          const agenda = schedules.find((a) => a.dia === day);
          const isPast = day < currentDay;
          const isSelected = day === selectedDay;
          const isActive = Boolean(agenda);

          return (
            <div
              key={day}
              className={`${styles.dayBlock}
                ${isSelected ? styles.selected : ""}
                ${isPast ? styles.pastDay : ""}
                ${isActive ? styles.activeDay : ""}`}
              onClick={() => handleDayClick(day)}
            >
              <div>{day}</div>
              {agenda && (
                <div className={styles.timeLabel}>{agenda.horario}</div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className={styles.alarmContainer}>
          <h3>Agendar lembrete para o dia {selectedDay}</h3>
          <label>Horário:</label>
          <input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            className={styles.timeInput}
          />

          <label>Mensagem:</label>
          <input
            type="text"
            placeholder="Ex: reunião, aula, etc"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={styles.messageInput}
          />

          <button onClick={handleSave} className={styles.saveButton}>
            Salvar
          </button>
        </div>
      )}

      {/* Pop-up do alarme */}
      {activeAlarm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h2>⏰ Lembrete</h2>
            <p>
              <strong>{activeAlarm.mensagem}</strong>
            </p>
            <p>
              {activeAlarm.dia} de {activeAlarm.mes} às {activeAlarm.horario}
            </p>
            <button onClick={stopAlarm} className={styles.stopButton}>
              Parar Alarme
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { Agenda };
