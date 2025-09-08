import { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./clock.module.css";

const Clock = ({ dbUrl, checkInterval = 2000 }) => {
  const savedTime = localStorage.getItem("tempo");
  const [timeLeft, setTimeLeft] = useState(savedTime ? Number(savedTime) : 0);
  const dbLastValue = useRef(null);
  const audioRef = useRef(null);
  const [alarmPlaying, setAlarmPlaying] = useState(false);

  // carrega som
  useEffect(() => {
    audioRef.current = new Audio("/alarme.mp3");
    audioRef.current.loop = true;
  }, []);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return; // se o tempo for 0, não continua

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Polling do DB
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(dbUrl);
        const dbValue = Number(res.data.tempo.horario);

        dbLastValue.current = dbValue;

        if (dbValue === 0) {
          setTimeLeft(0);

          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }

          setAlarmPlaying(false);
          return;
        }

        if (dbValue > 0 && dbValue !== timeLeft) {
          setTimeLeft(dbValue);
        }
      } catch (err) {
        console.error("Erro ao buscar tempo do DB:", err);
      }
    }, checkInterval);

    return () => clearInterval(interval);
  }, [dbUrl, checkInterval, timeLeft]);

  // toca alarme quando o timer chega a 0
  useEffect(() => {
    if (timeLeft === 0 && dbLastValue.current > 0 && !alarmPlaying) {
      if (audioRef.current) audioRef.current.play().catch(() => {});
      setAlarmPlaying(true);
    }
  }, [timeLeft, alarmPlaying]);

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAlarmPlaying(false);
    setTimeLeft(dbLastValue.current);
  };

  const formatTime = seconds => {
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
