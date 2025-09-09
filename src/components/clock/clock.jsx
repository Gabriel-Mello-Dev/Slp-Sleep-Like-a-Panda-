import { useEffect, useState, useRef } from "react";
import styles from "./clock.module.css";
import { api } from "../../services";

const Clock = ({ checkInterval = 2000 }) => {
  const savedTime = localStorage.getItem("tempo");
  const [timeLeft, setTimeLeft] = useState(savedTime ? Number(savedTime) : 0);
  const dbLastValue = useRef(null);
  const audioRef = useRef(null);
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const [alarmType, setAlarmType] = useState(1); 
  const [msg, setMsg] = useState(false);

  // Configura o som do alarme
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

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Polling do DB usando api
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get(""); // usa a baseURL do api.js
        const dbValue = Number(res.data.tempo.horario);
        const dbType = Number(res.data.tempo.tipo);

        dbLastValue.current = dbValue;
        setAlarmType(dbType);

        if (dbValue === 0) {
          setTimeLeft(0);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          setAlarmPlaying(false);
          setMsg(false);
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
  }, [checkInterval, timeLeft]);

  // toca alarme quando chega a 0
  useEffect(() => {
    if (timeLeft === 0 && dbLastValue.current > 0 && !alarmPlaying) {
      if (audioRef.current) audioRef.current.play().catch(() => {});
      setAlarmPlaying(true);
      setMsg(true);
    }
  }, [timeLeft, alarmPlaying]);

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAlarmPlaying(false);
    setMsg(false);
    setTimeLeft(dbLastValue.current);
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
      {msg ? (
        <p>Saia para tomar uma água!🚰</p>
      ) : (
        <div className={styles.nextAlarm}>
          <div>Proximo </div>
          {" Alarme".split("").map((char, i) => (
            <span key={i}>{char}</span>
          ))}
        </div>
      )}
    </>
  );
};

export { Clock };
