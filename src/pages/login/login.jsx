import { useState } from "react";
import { api } from "../../services";
import { useNavigate } from "react-router-dom";
import styles from "./auth.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  const login = async () => {
    if (!email || !senha) {
      setMsg("⚠️ Preencha todos os campos");
      return;
    }

    try {
      const res = await api.get(`/users?email=${email}`);
      if (res.data.length === 0) {
        setMsg("❌ Usuário não encontrado");
        return;
      }

      const user = res.data[0];
      if (senha !== user.senha) {
        setMsg("❌ Senha incorreta");
        return;
      }

      localStorage.setItem("userId", user.id);
      setMsg("✅ Logado com sucesso!");
      setEmail("");
      setSenha("");
      navigate("/"); // volta ao home logado
    } catch (error) {
      console.error(error);
      setMsg("❌ Erro ao logar");
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    navigate("/"); // volta para home deslogado
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button onClick={login}>Entrar</button>
      <button onClick={logout} style={{ marginTop: "10px" }}>
        Sair
      </button>
      {msg && (
        <p className={msg.includes("✅") ? styles.success : styles.error}>
          {msg}
        </p>
      )}
      <p>
        Não possui conta?{" "}
        <span
          onClick={() => navigate("/Singup")}
          style={{ cursor: "pointer", color: "#09f" }}
        >
          Criar conta
        </span>
      </p>
    </div>
  );
}

export { Login };
