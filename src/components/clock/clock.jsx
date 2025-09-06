import { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./clock.module.css";

const Clock = ({ dbUrl, checkInterval = 2000 }) => {
  const savedTime = localStorage.getItem("tempo");
  const [timeLeft, setTimeLeft] = useState(savedTime ? Number(savedTime) : 0);
  const dbLastValue = useRef(null);

  // COUNTDOWN constante
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

  // POLLING do DB
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(dbUrl);
        const dbValue = res.data.horario;

        // Atualiza apenas se o DB mudou
        if (dbLastValue.current !== dbValue) {
          dbLastValue.current = dbValue;

          // Atualiza timeLeft somente se for diferente do valor atual mostrado
          setTimeLeft(prev => (prev !== dbValue ? dbValue : prev));
        }
      } catch (err) {
        console.error("Erro ao buscar tempo do DB:", err);
      }
    }, checkInterval);

    return () => clearInterval(interval);
  }, [dbUrl, checkInterval]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return <div className={styles.clock}>{formatTime(timeLeft)}</div>;
};

export { Clock };
