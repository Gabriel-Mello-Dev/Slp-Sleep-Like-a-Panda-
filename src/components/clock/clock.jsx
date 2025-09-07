import { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./clock.module.css";

const Clock = ({ dbUrl, checkInterval = 2000 }) => {
  const savedTime = localStorage.getItem("tempo");
  const [timeLeft, setTimeLeft] = useState(savedTime ? Number(savedTime) : 0);
  const dbLastValue = useRef(null);
  const audioRef = useRef(null);

  // carrega som uma vez
  useEffect(() => {
    audioRef.current = new Audio("/alarme.mp3"); // ou .wav
    audioRef.current.loop = true; // toca em loop até parar
  }, []);

  // COUNTDOWN constante
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          if (dbLastValue.current) {
            // dispara alarme
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch((err) =>
                console.error("Erro ao tocar som:", err)
              );
            }

            // mostra mensagem com botão
            const parar = window.confirm("⏰ Alarme disparou! Deseja parar?");
            if (parar && audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }

            return Number(dbLastValue.current); // reseta
          }
          return 0;
        }
      });
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

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return <div className={styles.clock}>{formatTime(timeLeft)}</div>;
};

export { Clock };
