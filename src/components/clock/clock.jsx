import { useContext, useState, useRef, useEffect } from "react";
import styles from "./clock.module.css";
import { AppContext } from "../../contexts/AppContext";

const Clock = ({ type = "inline" }) => {
  const context = useContext(AppContext);
  const [msg, setMsg] = useState("");
  const [incentivo, setIncentivo] = useState("");

  // Frases aleatórias de incentivo
  const frases = [
    "🌿 Saia um pouco da tela e respire fundo.",
    "💧 Vá tomar um copo d’água!",
    "🌞 Dê uma olhada pela janela, relaxe a mente.",
    "🧘 Alongue-se por 2 minutinhos.",
    "🐾 Levante, caminhe um pouco pela casa.",
    "☕ Faça uma pausa rápida e recarregue as energias.",
    "📵 Feche os olhos e respire por 10 segundos.",
    "🌻 Estique os braços e sorria!",
    "🎧 Coloque uma música leve e relaxe.",
    "🍎 Aproveite para comer algo saudável.",
  ];

  // Verifica se está logado
  const isLogged = localStorage.getItem("userId");

  // ---- Se logado ----
  const timeLeft = isLogged ? context.timeLeft : null;
  const alarmPlaying = isLogged ? context.alarmPlaying : false;
  const stopAlarm = isLogged ? context.stopAlarm : () => {};
  const alarmType = isLogged ? context.alarmType : null;

  // ---- Se não logado ----
  const [localTime, setLocalTime] = useState(() => {
    const saved = localStorage.getItem("localTimeLeft");
    return saved ? parseInt(saved) : 0;
  });
  const [running, setRunning] = useState(false);
  const audioRef = useRef(new Audio("/sounds/alarm1.mp3")); // Alarme 1 padrão

  // Reproduz alarme
  const playAlarm = () => {
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.volume = 0.8;
    audio.play().catch((err) => console.log("Erro ao tocar alarme:", err));
  };

  useEffect(() => {
    if (!running) return;
    if (localTime <= 0) {
      setRunning(false);
      setMsg("⏰ Tempo finalizado!");
      const random = frases[Math.floor(Math.random() * frases.length)];
      setIncentivo(random);
      playAlarm();
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
    if (running) {
      setMsg("⚠️ O cronômetro já está em andamento!");
      return;
    }

    setLocalTime(5 * 60);
    localStorage.setItem("localTimeLeft", 5 * 60);
    setMsg("⏳ Contagem regressiva iniciada!");
    setIncentivo("");
    setRunning(true);
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // --- Drag popup ---
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

  // === INLINE ===
  if (type === "inline") {
    return (
      <div className={styles.clock}>
        {isLogged ? (
          <>
            {formatTime(timeLeft)}
            <br />
            {alarmPlaying && (
              <>
                <button onClick={stopAlarm} className={styles.stopButton}>
                  ⏹️ Parar Alarme
                </button>
                <p className={styles.incentivo}>
                  {frases[Math.floor(Math.random() * frases.length)]}
                </p>
              </>
            )}
          </>
        ) : (
          <>
            <p>⚠️ Você não está logado.</p>
            <p>Tempo restante: {formatTime(localTime)}</p>
            {msg && <p className={styles.msg}>{msg}</p>}
            {incentivo && <p className={styles.incentivo}>{incentivo}</p>}
            <button onClick={startLocal5Min}>Iniciar 5 minutos</button>
          </>
        )}
      </div>
    );
  }

  // === POPUP ===
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
          <strong>Relógio</strong>
          <div style={{ fontSize: 36, textAlign: "center", margin: "12px 0" }}>
            {isLogged ? formatTime(timeLeft) : formatTime(localTime)}
          </div>

          {isLogged ? (
            alarmPlaying ? (
              <>
                <button onClick={stopAlarm} className={styles.stopButton}>
                  ⏹️ Parar Alarme
                </button>
                <p className={styles.incentivo}>
                  {frases[Math.floor(Math.random() * frases.length)]}
                </p>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                Próximo tipo: {alarmType}
              </div>
            )
          ) : (
            <div style={{ textAlign: "center" }}>
              <p>⚠️ Não logado</p>
              {msg && <p className={styles.msg}>{msg}</p>}
              {incentivo && <p className={styles.incentivo}>{incentivo}</p>}
              <button onClick={startLocal5Min}>
                Iniciar 5 minutos em outras telas
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export { Clock };
