import { useState, useEffect, useRef } from "react";
import style from "./sono.module.css";
import { Clock } from "../../components";

const Sono = () => {
  const [hours, setHours] = useState(8);
  const [timeLeft, setTimeLeft] = useState(hours * 3600);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(hours * 3600);
  }, [hours]);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      desligar();
      return;
    }

    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => console.log(err));
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          desligar();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  };

  const desligar = () => {
    setIsRunning(false);
    setTimeLeft(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const iniciar = () => {
    setTimeLeft(hours * 3600);
    setIsRunning(true);
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>Modo Sono</h1>
      <h2>Indique a quantia de horas desejadas</h2>
  <Clock type="popup" />
      <div className={style.controls}>
        <input
          type="number"
          min="1"
          max="24"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          disabled={isRunning}
          className={style.input}
        />
        <div>
          <button onClick={iniciar} disabled={isRunning} className={style.button}>Iniciar</button>
          <button onClick={desligar} className={style.button}>Desligar</button>
        </div>
      </div>

      <h2>Tempo restante: {formatTime(timeLeft)}</h2>

      <audio ref={audioRef} src="/rain.mp3" loop />

      {isRunning && <div className={style.dimmingOverlay}><img src="https://juststickers.in/wp-content/uploads/2021/01/sleeping-panda.png" alt="Panda sleep" /></div>}
    </div>
  );
};

export { Sono };
