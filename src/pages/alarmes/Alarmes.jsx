import { useState, useEffect } from "react";
import styles from "./alarmes.module.css";
import { api } from "../../services";

const Alarmes = () => {
  const [tempo, setTempo] = useState("");
  const [msg, setMsg] = useState("");
  const [checks, setChecks] = useState({
    alarme1: false,
    alarme2: false,
    alarme3: false,
  });
  const [tempoId, setTempoId] = useState(null);

  // 🔑 Pega o userId do localStorage e garante que seja number
  const rawUserId = localStorage.getItem("userId");
  const userId = rawUserId ? parseInt(rawUserId, 10) : null;

  // Busca o tempo do usuário
  useEffect(() => {
    const fetchTempo = async () => {
      if (!userId) return;
      try {
        const res = await api.get(`/tempos?userId=${userId}`);
        if (res.data.length > 0) {
          const userTempo = res.data[0];
          setTempo(userTempo.horario || "");
          setTempoId(Number(userTempo.id)); // garante number
          setChecks({
            alarme1: userTempo.tipo === 1,
            alarme2: userTempo.tipo === 2,
            alarme3: userTempo.tipo === 3,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };
    fetchTempo();
  }, [userId]);

  // Salvar ou atualizar tempo
  const salvarTempo = async () => {
    if (!userId) {
      setMsg("⚠️ Faça login para salvar um alarme!");
      return;
    }

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
      // 🔎 Verifica se já existe um tempo cadastrado pra esse usuário
      const res = await api.get(`/tempos?userId=${userId}`);
      if (res.data.length > 0) {
        // Já existe → atualizar
        const userTempo = res.data[0];
        await api.put(`/tempos/${userTempo.id}`, {
          id: Number(userTempo.id),
          userId,
          horario: Number(tempo),
          tipo,
        });
        setTempoId(Number(userTempo.id));
        setMsg(`✅ Alarme ${tipo} atualizado com sucesso!`);
      } else {
        // Não existe → criar
        const allTempos = await api.get("/tempos");
        let nextId = 1;
        if (allTempos.data.length > 0) {
          const ids = allTempos.data.map((t) => Number(t.id));
          nextId = Math.max(...ids) + 1;
        }

        const newTempo = await api.post("/tempos", {
          id: nextId, // 👈 força id numérico sequencial
          userId,
          horario: Number(tempo),
          tipo,
        });
        setTempoId(newTempo.data.id);
        setMsg(`✅ Alarme ${tipo} criado com sucesso!`);
      }

      setTempo("");
    } catch (error) {
      setMsg("❌ Erro ao salvar tempo");
      console.error(error);
    }
  };

  // Desativar alarmes
  const desativarAlarmes = async () => {
    if (!tempoId) {
      setMsg("⚠️ Nenhum alarme ativo para desativar");
      return;
    }

    try {
      await api.put(`/tempos/${tempoId}`, {
        id: String(tempoId),
        userId,
        horario: 0,
        tipo: 0,
      });
      setMsg("⏹️ Alarmes desativados!");
      setTempo("");
      setChecks({ alarme1: false, alarme2: false, alarme3: false });
    } catch (error) {
      setMsg("❌ Erro ao desativar alarmes");
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Configurar Alarme</h2>

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

      <input
        type="number"
        placeholder="Digite o tempo (minutos)"
        value={tempo}
        onChange={(e) => setTempo(e.target.value)}
        className={styles.input}
      />

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

      <br />

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
    </div>
  );
};

export { Alarmes };
