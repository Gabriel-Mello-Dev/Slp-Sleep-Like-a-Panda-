// src/components/Clock/Clock.jsx
import { useContext } from "react";
import styles from "./clock.module.css";
import { AppContext } from "../../contexts/AppContext";

const Clock = ({ type = "inline" }) => {
  const { timeLeft, alarmPlaying, stopAlarm, alarmType } = useContext(AppContext);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
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
      <div className={styles.popupOverlay}>
        <div className={styles.popup}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

  // === Fallback (caso type inválido) ===
  return null;
};

export { Clock };
