import { Link } from "react-router-dom";
import styles from "./head.module.css";
import { useState, useEffect } from "react";
import { api } from "../../services";

const Head = () => {
  const [clicked, setClicked] = useState(false);
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 2000);
  };

  // Busca dados do usuário logado
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const res = await api.get(`/users/${userId}`);
        setUser(res.data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>
        {clicked ? (
          <button onClick={handleClick} className={styles.transparentButton}>
            <img
              src="/cute.gif"
              alt="Panda Acordado"
              width={150}
            />
          </button>
        ) : (
          <button onClick={handleClick} className={styles.transparentButton}>
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
        <Link to="/loja">Loja</Link>
        <Link to="/sobrenos">Sobre-Nós</Link>
        {user && <Link to="/perfil">Perfil</Link>}
      </nav>

      {/* Mensagem de boas-vindas */}
      <div className={styles.userMessage}>
        {user ? (
          <span>Bem-vindo, {user.nome}!</span>
        ) : (
          <span>⚠️ Faça login</span>
        )}
      </div>

      {/* Botões */}
      <div className={styles.buttons}>
        {!user && <Link to="/Singup" className={styles.register}>Criar conta</Link>}
        {!user && <Link to="/Login" className={styles.signIn}>Logar</Link>}
      </div>
    </header>
  );
};

export { Head };
