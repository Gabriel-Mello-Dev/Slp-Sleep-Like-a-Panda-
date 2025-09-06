import { Link } from "react-router-dom";
import styles from "./Head.module.css";

const Head = () => {
  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>
        <img
          src="https://juststickers.in/wp-content/uploads/2021/01/sleeping-panda.png"
          alt="Logo Panda"
        />
        <span className={styles.logoText}>Sleep Like a Panda</span>
      </div>

      {/* Navegação */}
      <nav className={styles.nav}>
        <Link to="/">Home</Link>
        <Link to="/alarmes">Alarmes</Link>
        <Link to="/agenda">Agenda</Link>
        <Link to="/loja">Loja</Link>
      </nav>

      {/* Botões */}
      <div className={styles.buttons}>
        <button className={styles.signIn}>Sign in</button>
        <button className={styles.register}>Register</button>
      </div>
    </header>
  );
};
export  {Head};
