import styles from "./home.module.css";
import { Clock } from "../../components";
const Inicial = () => {
  return (
    <div className={styles.container}>
      {/* Título */}
      <h1 className={styles.title}>Sleep Like a Panda</h1>

      {/* Panda com relógio */}
      <div className={styles.pandaSection}>
        <img
          src="https://cdn.creazilla.com/cliparts/3227991/panda-clipart-sm.png" 
          alt="Panda Clock"
          className={styles.panda}
        />

<Clock initialSeconds ={120}></Clock>

        <p className={styles.nextAlarm}>Alarme mais próximo</p>
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

export  {Inicial};
