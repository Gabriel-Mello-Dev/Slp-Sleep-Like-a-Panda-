// src/components/Agenda/Agenda.jsx
import { useState, useEffect, useRef } from "react";
import { api } from "../../services";
import styles from "./agenda.module.css";
import { Clock } from "../../components";

const Agenda = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [alarmTime, setAlarmTime] = useState("");
  const [message, setMessage] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [triggered, setTriggered] = useState(new Set());
  const audioRef = useRef(new Audio("/alarme.mp3"));

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

  const currentMonthName = monthNames[currentMonth];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // === Carrega apenas agendamentos do usuário logado e mês atual ===
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await api.get(`/tempos?userId=${rawUserId}`);
        const all = res.data || [];

        // Filtra por mês atual e remove passados
        const valid = all.filter((a) => {
          const monthOk = a.mes === currentMonthName;
          const dayOk =
            a.dia > currentDay ||
            (a.dia === currentDay &&
              a.horario >= today.toTimeString().slice(0, 5));
          return monthOk && dayOk;
        });

        // Remove do banco os passados
        const expired = all.filter(
          (a) => a.mes === currentMonthName && a.dia < currentDay
        );
        for (const e of expired) {
          await api.delete(`/tempos/${e.id}`).catch(() => {});
        }

        setSchedules(valid);
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
      }
    };
    fetchSchedules();
  }, [rawUserId, currentMonthName]);

  // === Selecionar dia ===
  const handleDayClick = (day) => {
    if (day < currentDay) return;
    setSelectedDay(day);

    const existing = schedules.find(
      (a) => a.dia === day && a.mes === currentMonthName
    );
    if (existing) {
      setAlarmTime(existing.horario);
      setMessage(existing.mensagem);
    } else {
      setAlarmTime("");
      setMessage("");
    }
  };

  // === Salvar ou atualizar agendamento ===
  const handleSave = async () => {
    if (!selectedDay || !alarmTime || !message) {
      alert("Preencha todos os campos!");
      return;
    }

    const newAgenda = {
      dia: selectedDay,
      mes: currentMonthName,
      horario: alarmTime,
      mensagem: message,
      userId: rawUserId,
    };

    try {
      const existing = schedules.find(
        (a) =>
          a.dia === selectedDay &&
          a.mes === currentMonthName &&
          a.userId === rawUserId
      );

      if (existing) {
        await api.put(`/tempos/${existing.id}`, newAgenda);
      } else {
        await api.post("/tempos", newAgenda);
      }

      const res = await api.get(`/tempos?userId=${rawUserId}`);
      const filtered = res.data.filter((a) => a.mes === currentMonthName);
      setSchedules(filtered);

      alert("Agendamento salvo!");
      setSelectedDay(null);
      setAlarmTime("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar no banco.");
    }
  };

  // === Excluir agendamento ===
  const handleDelete = async () => {
    if (!selectedDay) return;
    const existing = schedules.find(
      (a) =>
        a.dia === selectedDay &&
        a.mes === currentMonthName &&
        a.userId === rawUserId
    );
    if (!existing) {
      alert("Nenhum agendamento neste dia.");
      return;
    }

    if (!confirm("Deseja excluir este agendamento?")) return;

    try {
      await api.delete(`/tempos/${existing.id}`);
      setSchedules((prev) => prev.filter((a) => a.id !== existing.id));
      alert("Agendamento removido!");
      setSelectedDay(null);
      setAlarmTime("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir agendamento.");
    }
  };

  // === Verificar alarmes ===
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const currentDayNum = now.getDate();
      const currentMonthNameNow = monthNames[now.getMonth()];

      schedules.forEach((agenda) => {
        if (agenda.userId !== rawUserId) return;
        if (agenda.mes !== currentMonthNameNow) return;

        const alreadyTriggered = triggered.has(agenda.id);

        if (
          agenda.dia === currentDayNum &&
          agenda.horario === currentTime &&
          !alreadyTriggered
        ) {
          audioRef.current.loop = true;
          audioRef.current.play().catch(() => {});
          setActiveAlarm(agenda);
          setTriggered((prev) => new Set(prev).add(agenda.id));
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [schedules, triggered, rawUserId]);

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
        Agenda - {currentMonthName} {currentYear}
      </h1>

      <Clock type="popup" />

      <div className={styles.daysGrid}>
        {days.map((day) => {
          const agenda = schedules.find(
            (a) => a.dia === day && a.mes === currentMonthName
          );
          const isPast = day < currentDay;
          const isSelected = day === selectedDay;
          const isActive = Boolean(agenda);

          return (
            <div
              key={day}
              className={`${styles.dayBlock} ${
                isSelected ? styles.selected : ""
              } ${isPast ? styles.pastDay : ""} ${
                isActive ? styles.activeDay : ""
              }`}
              onClick={() => handleDayClick(day)}
            >
              <div>{day}</div>
              {agenda && (
                <>
                <div className={styles.timeLabel}>{agenda.horario}</div>
                                  <div className={styles.msgLabel}>{agenda.mensagem}</div>

                </>
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

          <div className={styles.buttonsRow}>
            <button onClick={handleSave} className={styles.saveButton}>
              Salvar
            </button>
            <button onClick={handleDelete} className={styles.deleteButton}>
              Excluir
            </button>
          </div>
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
