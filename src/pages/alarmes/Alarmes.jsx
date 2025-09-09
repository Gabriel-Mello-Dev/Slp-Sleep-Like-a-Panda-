import { useState } from "react";
import axios from "axios";
import styles from "./alarmes.module.css";

const Alarmes = () => {
  const [tempo, setTempo] = useState("");
  const [msg, setMsg] = useState(""); // faltava isso 👈
  const [checks, setChecks] = useState({
    alarme1: false,
    alarme2: false,
    alarme3: false,
  });

  const salvarTempo = async () => {
    if (!tempo) {
      setMsg("⚠️ Digite um tempo!");
      return;
    }

    let tipo = 0;
    if (checks.alarme1) tipo = 1;
    else if (checks.alarme2) tipo = 2;
    else if (checks.alarme3) tipo = 3;

    if (tipo === 0) {
      setMsg("⚠️ Escolha um alarme!");
      return;
    }

    try {
      await axios.put("http://localhost:3000/User", {
        nome: "oi",
        tempo: {
          horario: Number(tempo),
          tipo: tipo,
        },
      });

      setMsg(`✅ Alarme ${tipo} salvo com sucesso!`);
      setTempo("");
    } catch (error) {
      setMsg("❌ Erro ao salvar tempo");
      console.error(error);
    }
  };

  const desativarAlarmes = async () => {
    try {
      await axios.put("http://localhost:3000/User", {
        nome: "oi",
        tempo: { horario: 0, tipo: 0 },
      });
      setMsg("⏹️ Alarmes desativados!");
      setTempo("");
    } catch (error) {
      setMsg("❌ Erro ao desativar alarmes");
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Configurar Alarme</h2>

      <input
        type="number"
        placeholder="Digite o tempo (segundos)"
        value={tempo}
        onChange={(e) => setTempo(e.target.value)}
        className={styles.input}
      />
      <button onClick={salvarTempo} className={styles.button}>
        Salvar
      </button>

      <br />

      <button
        onClick={desativarAlarmes}
        className={`${styles.button} ${styles.stopButton}`}
      >
        Desativar Alarmes
      </button>

      {msg && (
        <p
          className={
            msg.includes("✅") || msg.includes("⏹️")
              ? styles.success
              : styles.error
          }
        >
          {msg}
        </p>
      )}

      {/* Escolher alarme */}
      <div className={styles.alarmesLista}>
        <label className={styles.alarmeItem}>
          <input
            type="checkbox"
            checked={checks.alarme1}
            onChange={() =>
              setChecks({ alarme1: true, alarme2: false, alarme3: false })
            }
          />
          <span>Alarme 1</span>
          <audio controls src="/alarme.mp3"></audio>
        </label>

        <label className={styles.alarmeItem}>
          <input
            type="checkbox"
            checked={checks.alarme2}
            onChange={() =>
              setChecks({ alarme1: false, alarme2: true, alarme3: false })
            }
          />
          <span>Alarme 2</span>
          <audio controls src="/alarme2.mp3"></audio>
        </label>

        <label className={styles.alarmeItem}>
          <input
            type="checkbox"
            checked={checks.alarme3}
            onChange={() =>
              setChecks({ alarme1: false, alarme2: false, alarme3: true })
            }
          />
          <span>Alarme 3</span>
          <audio controls src="/alarme3.mp3"></audio>
        </label>
      </div>
    </div>
  );
};

export { Alarmes };
