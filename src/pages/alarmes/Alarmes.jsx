import { useState } from "react";
import axios from "axios";
import styles from "./alarmes.module.css";

const Alarmes = () => {
  const [tempo, setTempo] = useState("");
  const [msg, setMsg] = useState("");

  const salvarTempo = async () => {
    if (!tempo) return setMsg("⚠️ Digite um tempo!");

    try {
      await axios.put("http://localhost:3000/tempo", {
        horario: Number(tempo)
      });
      setMsg("✅ Tempo salvo com sucesso!");
      setTempo("");
    } catch (error) {
      setMsg("❌ Erro ao salvar tempo");
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
      {msg && (
        <p className={msg.includes("✅") ? styles.success : styles.error}>
          {msg}
        </p>
      )}
    </div>
  );
};

export { Alarmes };
