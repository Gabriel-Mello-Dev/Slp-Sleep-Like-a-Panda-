// src/components/Clock/Clock.jsx
import { useContext, useState, useRef, useEffect } from "react";
import styles from "./clock.module.css";
import { AppContext } from "../../contexts/AppContext";

const Clock = ({ type = "inline" }) => {
  const context = useContext(AppContext);

  // Verifica se está logado (context válido)
  const isLogged = localStorage.getItem("userId");

  // ---- Se logado ----
  const timeLeft = isLogged ? context.timeLeft : null;
  const alarmPlaying = isLogged ? context.alarmPlaying : false;
  const stopAlarm = isLogged ? context.stopAlarm : () => {};
  const alarmType = isLogged ? context.alarmType : null;

  // ---- Se não logado ----
  const [localTime, setLocalTime] = useState(() => {
    const saved = localStorage.getItem("localTimeLeft");
    console.log("saved:",saved);
    return saved ? parseInt(saved) : 0;
  });
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (localTime <= 0) {
      setRunning(false);
      alert("⏰ Tempo finalizado!");
      return;
    }

    const timer = setInterval(() => {
      setLocalTime((prev) => {
        const newTime = prev - 1;
        localStorage.setItem("localTimeLeft", newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, localTime]);

  const startLocal5Min = () => {
    setLocalTime(5 * 60);
    localStorage.setItem("localTimeLeft", 5 * 60);
    setRunning(true);
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // --- Estado do drag ---
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    const rect = dragRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    setPosition({
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    });
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  // === INLINE MODE ===
  if (type === "inline") {
    return (
      <div className={styles.clock}>
        {isLogged ? (
          <>
            {formatTime(timeLeft)}
            <br />
            {alarmPlaying && (
              <button onClick={stopAlarm} className={styles.stopButton}>
                ⏹️ Parar Alarme
              </button>
            )}
          </>
        ) : (
          <>
            <p>⚠️ Você não está logado.</p>
            <p>Tempo restante: {formatTime(localTime)}</p>
            <button onClick={startLocal5Min}>Iniciar 5 minutos</button>
          </>
        )}
      </div>
    );
  }

  // === POPUP MODE ===
  if (type === "popup") {
    return (
      <div
        ref={dragRef}
        onMouseDown={onMouseDown}
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          cursor: "grab",
          zIndex: 9999,
        }}
        className={styles.popupOverlay}
      >
        <div className={styles.popup}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>Relógio</strong>
          </div>

          <div style={{ fontSize: 36, textAlign: "center", margin: "12px 0" }}>
            {isLogged
              ? formatTime(timeLeft)
              : formatTime(localTime)}
          </div>

          {isLogged ? (
            alarmPlaying ? (
              <button onClick={stopAlarm} className={styles.stopButton}>
                ⏹️ Parar Alarme
              </button>
            ) : (
              <div style={{ textAlign: "center" }}>
                Próximo tipo: {alarmType}
              </div>
            )
          ) : (
            <div style={{ textAlign: "center" }}>
              <p>⚠️ Não logado</p>
              <button onClick={startLocal5Min}>Iniciar 5 minutos em outras telas</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export { Clock };
