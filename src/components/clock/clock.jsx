import { useEffect, useState, useRef } from "react";
import styles from "./clock.module.css";
import { api } from "../../services";

const Clock = ({ checkInterval = 5000 }) => {
  const userId = localStorage.getItem("userId");
  const [timeLeft, setTimeLeft] = useState(0);
  const dbLastValue = useRef(0);
  const audioRef = useRef(null);
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const [alarmType, setAlarmType] = useState(1);

  // Configura som do alarme
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    let src = "/alarme.mp3";
    if (alarmType === 2) src = "/alarme2.mp3";
    if (alarmType === 3) src = "/alarme3.mp3";

    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
  }, [alarmType]);

  // Countdown local
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Salva no localStorage
  useEffect(() => {
    localStorage.setItem("tempo", timeLeft);
  }, [timeLeft]);

  // Zera tempo quando o usuário desloga
  useEffect(() => {
    if (!userId) {
      setTimeLeft(0);
      dbLastValue.current = 0;
      setAlarmPlaying(false);
    }
  }, [userId]);

  // Polling do DB
  useEffect(() => {
    if (!userId) return;

    const fetchUserTempo = async () => {
      try {
        const res = await api.get(`/tempos?userId=${userId}`);
        if (res.data.length === 0) return;

        const userTempo = res.data[0];
        const dbValue = Number(userTempo.horario);
        const dbType = Number(userTempo.tipo);

        // Atualiza apenas se mudou
        if (dbValue !== dbLastValue.current) {
          dbLastValue.current = dbValue;
          setAlarmType(dbType);
          setTimeLeft(dbValue * 60);
        }
      } catch (err) {
        console.error("Erro ao buscar tempo do DB:", err);
      }
    };

    // Puxa imediatamente
    fetchUserTempo();
    // E depois periodicamente
    const interval = setInterval(fetchUserTempo, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval, userId]);

  // Toca alarme quando chega a 0
  useEffect(() => {
    if (timeLeft === 0 && dbLastValue.current > 0 && !alarmPlaying) {
      if (audioRef.current) audioRef.current.play().catch(() => {});
      setAlarmPlaying(true);
    }
  }, [timeLeft, alarmPlaying]);

  // Para o alarme
  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAlarmPlaying(false);
    setTimeLeft(dbLastValue.current * 60);
  };

  const formatTime = seconds => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <>
      <div className={styles.clock}>
        {formatTime(timeLeft)}
        <br />
        {alarmPlaying && (
          <button onClick={stopAlarm} className={styles.stopButton}>
            ⏹️ Parar Alarme
          </button>
        )}
      </div>

      {alarmPlaying ? (
        <p>Saia para tomar uma água! 🚰</p>
      ) : (
        <div className={styles.nextAlarm}>
          <div>Próximo </div>
          {"Alarme".split("").map((char, i) => (
            <span key={i}>{char}</span>
          ))}
        </div>
      )}
    </>
  );
};

export { Clock };
