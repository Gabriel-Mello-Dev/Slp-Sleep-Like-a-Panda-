// src/context/AppContext.js
import { createContext, useEffect, useRef, useState } from "react";
import { api } from "../services";

export const AppContext = createContext({});

export const AppContextProvider = ({ children }) => {
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
  const [agendamentos, setAgendamentos] = useState([]);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const CHECK_INTERVAL_MS = 5000;

  useEffect(() => {
    if (!userId) return;

    const fetchAgendamentos = async () => {
      try {
        const res = await api.get(`/agendamentos?userId=${userId}`);
        if (Array.isArray(res.data)) setAgendamentos(res.data);
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
      }
    };

    fetchAgendamentos();
  }, [userId]);

  // 💾 salvar/atualizar agendamento
  const salvarAgendamento = async ({ dia, mes, horario, mensagem }) => {
    if (!userId) return alert("⚠️ Usuário não logado.");

    try {
      const all = await api.get("/agendamentos");
      const nextId =
        all.data.length > 0
          ? Math.max(...all.data.map((a) => Number(a.id))) + 1
          : 1;

      const novo = {
        id: String(nextId),
        userId,
        dia,
        mes,
        horario,
        mensagem,
        ativo: true,
      };

      await api.post("/agendamentos", novo);
      setAgendamentos((prev) => [...prev, novo]);
      alert("✅ Alarme agendado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao salvar agendamento");
    }
  };

  // ⏰ monitorar se algum agendamento bate com o horário atual
  useEffect(() => {
    const check = setInterval(() => {
      const agora = new Date();
      agendamentos.forEach((a) => {
        if (!a.ativo) return;
        const diaMatch = a.dia === agora.getDate();
        const mesMatch =
          a.mes === agora.toLocaleString("pt-BR", { month: "long" });
        const horaMatch = a.horario === agora.toTimeString().slice(0, 5);
        if (diaMatch && mesMatch && horaMatch && !alarmPlaying) {
          if (audioRef.current) audioRef.current.play();
          setAlarmPlaying(true);
          alert(`🔔 ${a.mensagem || "Alarme disparado!"}`);
        }
      });
    }, 1000);

    return () => clearInterval(check);
  }, [agendamentos, alarmPlaying]);

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
    audioRef.current = new Audio("/alarme.mp3");
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




  return (
    <AppContext.Provider
      value={{
        // relógio / alarme (expostos)
        timeLeft,
        setTimeLeft,
        dbLastValue, // ref (se necessário)
        alarmPlaying,
        setAlarmPlaying,
        alarmType,
        setAlarmType,
        stopAlarm,
        agendamentos,
        salvarAgendamento,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
