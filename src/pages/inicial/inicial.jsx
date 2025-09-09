import { useEffect, useState } from "react";
import styles from "./home.module.css";
import { Clock } from "../../components";
import axios from "axios";

const Inicial = () => {
  const [seconds, setSeconds] = useState(null);
const [teste,setTeste]= useState(null);
const [show,setShow]= useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/tempo")
      .then((res) => setSeconds(res.data.horario))
      .catch((err) => console.error("Erro ao carregar tempo:", err));
  }, []);

  const stopAllSounds = () => {
    const audios = document.querySelectorAll("audio");
    audios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0; // volta para o início
    });
  };
function chamarApi() {
  axios
    .get("http://localhost:3000/User")
    .then((res) => {
      const user = res.data; // já é o objeto User
      setTeste(user);

      alert(`Nome: ${user.nome}, Horário: ${user.tempo.horario}`);
    })
    .catch((err) => console.error("Erro ao carregar:", err));
}


  return (



    <div className={styles.container}>
      {/* Título */}

      
   {show && (
    <> 
 <div className={styles.rain}>
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i}>🐼</span>
      ))}
    </div>

        </>
      )}

      <h1 className={styles.title}>Sleep Like a Panda</h1>



      {/* Panda com relógio */}
      <div className={styles.pandaSection}>
         <button onClick={() => setShow(!show)}  className={styles.effect}>
        <img
          src="../../pandaClock.png"
          alt="Panda Clock"
          className={styles.panda}
        />
</button>
      <Clock /> 

  

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

export { Inicial };
