import { useEffect, useState } from "react";
import styles from "./loja.module.css";
import { api } from "../../services";
import { Clock } from "../../components";

const produtos = [
  { id: "gratis", nome: "Panda Comum", preco: 0.0, url: "/pandaClock.png" },
  {
    id: "zen",
    nome: "Panda Zen",
    preco: 19.99,
    url: "https://png.pngtree.com/png-clipart/20250501/original/pngtree-peaceful-zen-panda-sitting-in-a-serene-yoga-pose-png-image_20924858.png",
  },
  {
    id: "ninja",
    nome: "Panda Ninja",
    preco: 29.99,
    url: "https://png.pngtree.com/png-clipart/20230423/original/pngtree-the-panda-character-as-a-shaolin-warrior-carrying-a-bamboo-stick-png-image_9076894.png",
  },
  {
    id: "robo",
    nome: "Panda Robô",
    preco: 24.99,
    url: "https://png.pngtree.com/png-vector/20250803/ourmid/pngtree-panda-robot-drawing-illustration-vector-png-image_16821857.webp",
  },
  {
    id: "dj",
    nome: "Panda DJ",
    preco: 34.99,
    url: "https://cdn.pixabay.com/photo/2023/09/24/10/12/ai-generated-8272508_1280.png",
  },
];

export const Loja = () => {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState(null); // ← estado da mensagem
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        if (!res.data.skinsCompradas) res.data.skinsCompradas = [];
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [userId]);

  // função auxiliar p/ mostrar mensagens temporárias
  const showMsg = (text, type = "info") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3500);
  };

  const comprarSkin = async (skin) => {
    if (!user) return showMsg("⚠️ Faça login para comprar/equipar!", "warn");
    const jaComprou = user.skinsCompradas.includes(skin.id);
    const skinsAtualizadas = jaComprou
      ? user.skinsCompradas
      : [...user.skinsCompradas, skin.id];

    try {
      await api.put(`/users/${userId}`, {
        ...user,
        skinsCompradas: skinsAtualizadas,
        skinEquipada: skin.id,
      });
      setUser((prev) => ({
        ...prev,
        skinsCompradas: skinsAtualizadas,
        skinEquipada: skin.id,
      }));
      showMsg(
        `✅ ${skin.nome} ${
          jaComprou ? "equipada novamente!" : "comprada e equipada!"
        }`,
        "success"
      );
    } catch (err) {
      console.error(err);
      showMsg("❌ Erro ao equipar skin", "error");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Loja de Skins de Pandas</h1>
      <Clock type="popup" />

      {msg && (
        <div
          className={`${styles.msg} ${
            msg.type === "success"
              ? styles.msgSuccess
              : msg.type === "error"
              ? styles.msgError
              : msg.type === "warn"
              ? styles.msgWarn
              : ""
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className={styles.grid}>
        {produtos.map((produto) => {
          const jaComprou = user?.skinsCompradas?.includes(produto.id);
          return (
            <div key={produto.id} className={styles.card}>
              <div className={styles.imagem}>
                {produto.url ? (
                  <img src={produto.url} alt={produto.nome} />
                ) : (
                  <div className={styles.semImagem}>Sem imagem</div>
                )}
              </div>
              <h2 className={styles.nome}>{produto.nome}</h2>
              <p className={styles.preco}>
                R$ {jaComprou ? "0.00" : produto.preco.toFixed(2)}
              </p>
              <button
                className={styles.botao}
                onClick={() => comprarSkin(produto)}
              >
                {jaComprou ? "Equipar" : "Comprar"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
