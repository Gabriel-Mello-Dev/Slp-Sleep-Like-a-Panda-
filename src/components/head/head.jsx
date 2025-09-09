import { Link } from "react-router-dom";
import styles from "./head.module.css";
import { useState } from "react";

const Head = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);

    setTimeout(() => {
      setClicked(false);
    }, 2000);
  };

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>
        {clicked ? (
          <button onClick={handleClick} className={styles.effect}>
            <img
              src="/cute.gif"
              alt="Panda Acordado"
              width={150}
            />
          </button>
        ) : (
          <button onClick={handleClick} className={styles.effect}>
            <img
              src="https://juststickers.in/wp-content/uploads/2021/01/sleeping-panda.png"
              alt="Panda Dormindo"
              width={150}
            />
          </button>
        )}

        <span className={styles.logoText}>Sleep Like a Panda</span>
      </div>

      {/* Navegação */}
      <nav className={styles.nav}>
        <Link to="/">Home</Link>
        <Link to="/alarmes">Alarmes</Link>
        <Link to="/ModoSono">Modo Noturno</Link>
        <Link to="/agenda">Agenda</Link>
        <Link to="/loja">Loja</Link>
        <Link to="/sobrenos">Sobre-Nós</Link>

      </nav>

      {/* Botões */}
      <div className={styles.buttons}>
        <button className={styles.signIn}>Sign in</button>
        <button className={styles.register}>Register</button>
      </div>
    </header>
  );
};

export { Head };
