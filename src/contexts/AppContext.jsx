// src/context/AppContext.js
import { createContext, useEffect, useRef, useState } from "react";
import { api } from "../services";

export const AppContext = createContext({});

export const AppContextProvider = ({ children }) => {
  // tarefas (seu código existente)
  const [tarefas, setTarefas] = useState([]);
  const [criador] = useState("Gabriel Mello");
  const [loadingCriar, setLoadingCriar] = useState(false);
  const [loadingDeletar, setLoadingDeletar] = useState(null);
  const [loadingEditar, setLoadingEditar] = useState(null);
  const [loadingCarregar, setLoadingCarregar] = useState(false);

  // --- Relógio / Alarme (centralizado)
  // timeLeft em segundos
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem("tempo");
    return saved ? Number(saved) : 0;
  });

  const dbLastValue = useRef(0); // valor em minutos vindo do DB
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const [alarmType, setAlarmType] = useState(1);
  const audioRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const CHECK_INTERVAL_MS = 5000;

  // Persistir tempo
  useEffect(() => {
    localStorage.setItem("tempo", String(timeLeft));
  }, [timeLeft]);

  // Configura/atualiza audio quando alarmType mudar
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    let src = "/alarme.mp3";
    if (alarmType === 2) src = "/alarme2.mp3";
    if (alarmType === 3) src = "/alarme3.mp3";
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
  }, [alarmType]);

  // Countdown: decrementa timeLeft a cada segundo
  useEffect(() => {
    // evita múltiplos intervals
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev > 0 ? prev - 1 : 0;
        return next;
      });
    }, 1000);

    return () => clearInterval(countdownIntervalRef.current);
  }, []);

  // Quando timeLeft chegar a zero, aciona alarme (se dbLastValue > 0)
  useEffect(() => {
    if (timeLeft === 0 && dbLastValue.current > 0 && !alarmPlaying) {
      if (audioRef.current) audioRef.current.play().catch(() => {});
      setAlarmPlaying(true);
    }
  }, [timeLeft, alarmPlaying]);

  // Função para parar alarme (resetar para dbLastValue)
  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAlarmPlaying(false);
    setTimeLeft(dbLastValue.current * 60);
  };

  // Polling do DB para buscar tempos do usuário
  useEffect(() => {
    if (!userId) return;

    const fetchUserTempo = async () => {
      try {
        const res = await api.get(`/tempos?userId=${userId}`);
        if (!res.data || res.data.length === 0) return;

        const userTempo = res.data[0];
        const dbValue = Number(userTempo.horario); // em minutos
        const dbType = Number(userTempo.tipo);

        if (dbValue !== dbLastValue.current) {
          dbLastValue.current = dbValue;
          setAlarmType(dbType);
          setTimeLeft(dbValue * 60);
        }
      } catch (err) {
        console.error("Erro ao buscar tempo do DB:", err);
      }
    };

    // fetch imediato
    fetchUserTempo();

    // interval
    pollingIntervalRef.current = setInterval(fetchUserTempo, CHECK_INTERVAL_MS);
    return () => clearInterval(pollingIntervalRef.current);
  }, [userId]);

  // Exemplo das funções de tarefas (mantive seu código)
  const carregarTarefas = async () => {
    setLoadingCarregar(true);
    try {
      const response = await api.get("/tarefas");
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
    setLoadingCarregar(false);
  };

  const adicionarTarefa = async (nomeTarefa) => {
    setLoadingCriar(true);
    const { data: tarefa } = await api.post("/tarefas", { nome: nomeTarefa });
    setTarefas((prev) => [...prev, tarefa]);
    setLoadingCriar(false);
  };

  const removerTarefa = async (idTarefa) => {
    setLoadingDeletar(idTarefa);
    await api.delete(`/tarefas/${idTarefa}`);
    setTarefas((prev) => prev.filter((t) => t.id !== idTarefa));
    setLoadingDeletar(null);
  };

  const editarTarefa = async (id, nomeTarefa) => {
    setLoadingEditar(id);
    const { data: tarefaAtulizada } = await api.put(`/tarefas/${id}`, {
      nome: nomeTarefa,
    });
    setTarefas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, nome: tarefaAtulizada.nome } : t))
    );
    setLoadingEditar(null);
  };

  useEffect(() => {
    carregarTarefas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider
      value={{
        // tarefas
        criador,
        tarefas,
        adicionarTarefa,
        removerTarefa,
        editarTarefa,
        loadingCriar,
        loadingDeletar,
        loadingEditar,
        loadingCarregar,

        // relógio / alarme (expostos)
        timeLeft,
        setTimeLeft,
        dbLastValue, // ref (se necessário)
        alarmPlaying,
        setAlarmPlaying,
        alarmType,
        setAlarmType,
        stopAlarm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
