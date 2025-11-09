import { useState, useEffect, useRef } from "react";
import style from "./sono.module.css";

const Sono = () => {
  const isLogged = localStorage.getItem("userId"); // ✅ verifica login
  const [hours, setHours] = useState(isLogged ? 8 : 1);
  const [timeLeft, setTimeLeft] = useState(hours * 3600);
  const [isRunning, setIsRunning] = useState(false);
  const [msg, setMsg] = useState("");
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isLogged) {
      setHours(1);
      setMsg("⚠️ Usuários não logados só podem usar até 1 hora.");
    } else {
      setMsg("");
    }
    setTimeLeft(hours * 3600);
  }, [hours, isLogged]);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      desligar();
      return;
    }

    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((err) => console.log(err));
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
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
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
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
    if (!isLogged) {
      setMsg("⚠️ Faça login para aumentar o tempo de sono acima de 1 hora.");
    }
    setTimeLeft(hours * 3600);
    setIsRunning(true);
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>😴 Modo Sono</h1>
      <h2>Informe quantas horas deseja dormir</h2>

      <div className={style.controls}>
        {!isLogged && (
          <div className={style.alertBox}>
            ⚠️ Modo limitado — usuários não logados só podem usar 1 hora.
          </div>
        )}

        <input
          type="number"
          min="1"
          max={isLogged ? "24" : "1"}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          disabled={!isLogged || isRunning} // 🚫 bloqueia se não logado
          className={style.input}
        />

        <div>
          <button
            onClick={iniciar}
            disabled={isRunning}
            className={style.button}
          >
            Iniciar
          </button>

          <button onClick={desligar} className={style.buttonRed}>
            Desligar
          </button>
        </div>
      </div>

      {msg && <p className={style.msg}>{msg}</p>}

      <h2>⏳ Tempo restante: {formatTime(timeLeft)}</h2>

      <audio ref={audioRef} src="/rain.mp3" loop />

      {isRunning && (
        <div className={style.dimmingOverlay}>
          <img
            src="https://juststickers.in/wp-content/uploads/2021/01/sleeping-panda.png"
            alt="Panda dormindo"
          />
        </div>
      )}
    </div>
  );
};

export { Sono };
