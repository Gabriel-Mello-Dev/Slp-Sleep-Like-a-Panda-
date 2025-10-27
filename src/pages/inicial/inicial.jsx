import { useEffect, useState } from "react";
import styles from "./home.module.css";
import { Clock } from "../../components";
import { api } from "../../services";

export const Inicial = () => {
  const [skinPanda, setSkinPanda] = useState(""); // Panda atual
  const [showRain, setShowRain] = useState(false); // Mostra chuva de pandas
  const userId = localStorage.getItem("userId"); // ID do usuário logado

  // Mapeamento das skins para URLs
  const skinsMap = {
    gratis: "/pandaClock.png",
    ninja:
      "https://png.pngtree.com/png-clipart/20230423/original/pngtree-the-panda-character-as-a-shaolin-warrior-carrying-a-bamboo-stick-png-image_9076894.png",
    robo: "https://png.pngtree.com/png-vector/20250803/ourmid/pngtree-panda-robot-drawing-illustration-vector-png-image_16821857.webp",
    dj: "https://cdn.pixabay.com/photo/2023/09/24/10/12/ai-generated-8272508_1280.png",
    zen: "https://png.pngtree.com/png-clipart/20250501/original/pngtree-peaceful-zen-panda-sitting-in-a-serene-yoga-pose-png-image_20924858.png",
  };

  // Busca skin equipada do usuário
  useEffect(() => {
    if (!userId) {
      setSkinPanda(skinsMap.gratis); // Panda inicial grátis
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        const skinEquipada = res.data.skinEquipada || "gratis";
        setSkinPanda(skinsMap[skinEquipada] || skinsMap.gratis);
      } catch (err) {
        console.error("Erro ao buscar skin do usuário:", err);
        setSkinPanda(skinsMap.gratis);
      }
    };

    fetchUser();
  }, [userId]);

  // Alterna chuva de pandas
  const toggleRain = () => setShowRain((prev) => !prev);

  return (
    <div className={styles.container}>
      {/* Chuva de pandas */}
      {showRain && (
        <div className={styles.rain}>
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i}>🐼</span>
          ))}
        </div>
      )}

      {/* Título */}
      <h1 className={styles.title}>Sleep Like a Panda</h1>

      {/* Panda com relógio */}
      <div className={styles.pandaSection}>
        <button onClick={toggleRain} className={styles.transparentButton}>
          <div className={styles.pandaWrapper}>
            <img src={skinPanda} alt="Panda Clock" className={styles.panda} />
            <div className={styles.clockWrapper}>
              <Clock type="inline" />
            </div>
          </div>
        </button>
      </div>

      {/* Panda na Lua */}
      <img
        src="https://png.pngtree.com/png-clipart/20220102/original/pngtree-adorable-baby-panda-sleeping-illustration-in-watercolor-png-image_6995799.png"
        alt="Panda na Lua"
        className={styles.moonPanda}
      />

      {/* Bambu Esquerdo */}
      <div className={styles.bambooLeft}>
        <img
          src="https://images.vexels.com/media/users/3/158414/isolated/preview/094793b5f05dd54e703f54509344f0a1-ilustracao-de-haste-de-bambu.png"
          alt="Bambu"
        />
      </div>

      {/* Bambu Direito */}
      <div className={styles.bambooRight}>
        <img
          src="https://images.vexels.com/media/users/3/158414/isolated/preview/094793b5f05dd54e703f54509344f0a1-ilustracao-de-haste-de-bambu.png"
          alt="Bambu"
        />
      </div>
    </div>
  );
};
