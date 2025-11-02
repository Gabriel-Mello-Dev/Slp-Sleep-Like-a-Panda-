// src/components/TopBar/index.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Topbar.module.css";
import { api } from "../../services";

const TopBar = () => {
  const [clicked, setClicked] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  const userId = localStorage.getItem("userId");

  const handlePandaClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 2000);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setUser(null);
        return;
      }
      try {
        const res = await api.get(`/users/${userId}`);
        setUser(res.data);
      } catch (e) {
        console.error("Erro ao buscar usuário:", e);
        setUser(null);
      }
    };
    fetchUser();
  }, [userId]);

  const toggleDark = () => {
    const root = document.documentElement;
    if (dark) {
      root.classList.remove("dark");
      setDark(false);
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      setDark(true);
      localStorage.setItem("theme", "dark");
    }

location.reload();


  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const root = document.documentElement;
    if (saved === "dark") {
      root.classList.add("dark");
      setDark(true);
    } else if (saved === "light") {
      root.classList.remove("dark");
      setDark(false);
    }
  }, []);

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button
          onClick={handlePandaClick}
          className={styles.transparentButton}
          aria-label="Panda"
        >
          {clicked ? (
            // 💤 Panda acordado (varia conforme o tema)
            <img
              src={
                dark
                  ? "/redCute.gif" // 🟥 panda vermelho acordado
                  : "/cute.gif" // ⚪ panda normal acordado
              }
              alt="Panda Acordado"
              width={60}
              height={60}
            />
          ) : (
            // 😴 Panda dormindo (varia conforme o tema)
            <img
              src={
                dark
                  ? "https://images.vexels.com/media/users/3/325722/isolated/preview/9ddc9ea001c1946ee72afb0b5df6769f-panda-vermelho-de-desenho-animado-com-os-bracos-estendidos.png" // 🟥 panda vermelho dormindo
                  : "https://juststickers.in/wp-content/uploads/2021/01/sleeping-panda.png"
              }
              alt="Panda Dormindo"
              width={60}
              height={60}
            />
          )}
        </button>

        <span className={styles.title}>Sleep Like a Panda</span>
      </div>

      <div className={styles.right}>
        <span className={styles.userText}>
          {user ? `Olá, ${user.nome}` : "⚠️ Faça login"}
        </span>

        <button
          className={`${styles.themeSwitch} ${dark ? styles.dark : ""}`}
          onClick={toggleDark}
          aria-label="Alternar tema"
        >
          <span className={`${styles.switchBall} ${dark ? styles.dark : ""}`} />
        </button>

        {user ? (
          <div className={styles.profileWrapper}>
            <button
              className={styles.profileButton}
              onClick={() => setMenuOpen((p) => !p)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <img
                src="https://icon-library.com/images/profile-icon-png/profile-icon-png-8.jpg"
                className={styles.profileIcon}
              />
            </button>
            {menuOpen && (
              <div className={styles.profileMenu} role="menu">
                <Link
                  to="/perfil"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Perfil
                </Link>
                <Link
                  to="/sobrenos"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Sobre Nós
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.authButtons}>
            <Link to="/Login" className={styles.signIn}>
              Logar
            </Link>
            <Link to="/Singup" className={styles.register}>
              Criar conta
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export { TopBar };
