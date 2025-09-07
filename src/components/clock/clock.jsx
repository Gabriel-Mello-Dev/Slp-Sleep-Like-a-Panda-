import { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./clock.module.css";

const Clock = ({ dbUrl, checkInterval = 2000 }) => {
  const savedTime = localStorage.getItem("tempo");
  const [timeLeft, setTimeLeft] = useState(savedTime ? Number(savedTime) : 0);
  const dbLastValue = useRef(null);
  const audioRef = useRef(null);
  const [alarmPlaying, setAlarmPlaying] = useState(false);

  // carrega som uma vez
  useEffect(() => {
    audioRef.current = new Audio("/alarme.mp3"); 
    audioRef.current.loop = true;
  }, []);

  // COUNTDOWN constante
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;

        if (dbLastValue.current && audioRef.current && !alarmPlaying) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((err) =>
            console.error("Erro ao tocar som:", err)
          );
          setAlarmPlaying(true);

                    alert("Saia do computador");

        }

        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [alarmPlaying]);

  // Salva no localStorage
  useEffect(() => {
    localStorage.setItem("tempo", timeLeft);
  }, [timeLeft]);

  // POLLING do DB
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(dbUrl);
        const dbValue = res.data.horario;

        if (dbLastValue.current !== dbValue) {
          dbLastValue.current = dbValue;
          setTimeLeft((prev) => (prev !== dbValue ? dbValue : prev));
        }
      } catch (err) {
        console.error("Erro ao buscar tempo do DB:", err);
      }
    }, checkInterval);

    return () => clearInterval(interval);
  }, [dbUrl, checkInterval]);

  // função para parar o alarme e resetar timer
  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAlarmPlaying(false);

    // reseta o timer para o valor do DB
    if (dbLastValue.current) {
      setTimeLeft(Number(dbLastValue.current));
    }
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className={styles.clock}>
      {formatTime(timeLeft)}
      <br />
      {alarmPlaying && (
        <button onClick={stopAlarm} className={styles.stopButton}>
          ⏹️ Parar Alarme
        </button>
      )}
    </div>
  );
};

export { Clock };
