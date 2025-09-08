import { useState } from "react";
import axios from "axios";
import styles from "./alarmes.module.css";

const Alarmes = () => {
  const [tempo, setTempo] = useState("");
  const [msg, setMsg] = useState("");

  const salvarTempo = async () => {
    if (!tempo) return setMsg("⚠️ Digite um tempo!");

    try {
      await axios.put("http://localhost:3000/User", {
        nome: "oi", // se precisar manter o nome
        tempo: { horario: Number(tempo) }
      });
      setMsg("✅ Tempo salvo com sucesso!");
      setTempo("");
    } catch (error) {
      setMsg("❌ Erro ao salvar tempo");
      console.error(error);
    }
  };

  const desativarAlarmes = async () => {
    try {
      await axios.put("http://localhost:3000/User", {
        nome: "oi", // se precisar manter
        tempo: { horario: 0 }
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
    </div>
  );
};

export { Alarmes };
