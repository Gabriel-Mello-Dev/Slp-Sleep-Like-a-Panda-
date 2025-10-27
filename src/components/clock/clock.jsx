// src/components/Clock/Clock.jsx
import { useContext, useState, useRef } from "react";
import styles from "./clock.module.css";
import { AppContext } from "../../contexts/AppContext";

const Clock = ({ type = "inline" }) => {
  const { timeLeft, alarmPlaying, stopAlarm, alarmType } =
    useContext(AppContext);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // --- Estado do drag ---
  const [position, setPosition] = useState({ x: 100, y: 100 }); // posição inicial
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
        {formatTime(timeLeft)}
        <br />
        {alarmPlaying && (
          <button onClick={stopAlarm} className={styles.stopButton}>
            ⏹️ Parar Alarme
          </button>
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
            {formatTime(timeLeft)}
          </div>

          {alarmPlaying ? (
            <button onClick={stopAlarm} className={styles.stopButton}>
              ⏹️ Parar Alarme
            </button>
          ) : (
            <div style={{ textAlign: "center" }}>Próximo tipo: {alarmType}</div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export { Clock };
