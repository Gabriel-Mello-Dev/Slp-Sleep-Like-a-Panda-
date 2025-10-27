import { useState } from "react";
import { api } from "../../services";
import { useNavigate } from "react-router-dom";
import styles from "./auth.module.css";

export default function Signup() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  const criarConta = async () => {
    if (!nome || !email || !senha) {
      setMsg("⚠️ Preencha todos os campos");
      return;
    }

    try {
      const res = await api.get(`/users?email=${email}`);
      if (res.data.length > 0) {
        setMsg("⚠️ Usuário já existe");
        return;
      }

      // Pega todos os usuários para calcular próximo ID
      const allUsers = await api.get("/users");
      let nextId = 1;
      if (allUsers.data.length > 0) {
        const ids = allUsers.data.map((u) => parseInt(u.id, 10)); // transforma string em number
        nextId = Math.max(...ids) + 1;
      }

      const user = await api.post("/users", {
        id: String(nextId), // salva como string no db
        nome,
        email,
        senha,
        skinEquipada: "gratis",
        skinsCompradas: ["gratis"],
      });

      localStorage.setItem("userId", user.data.id);
      setMsg("✅ Conta criada com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      navigate("/"); // vai para home logado
    } catch (error) {
      console.error(error);
      setMsg("❌ Erro ao criar conta");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Criar Conta</h2>
      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
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
      <button onClick={criarConta}>Criar Conta</button>
      {msg && (
        <p className={msg.includes("✅") ? styles.success : styles.error}>
          {msg}
        </p>
      )}
      <p>
        Já possui conta?{" "}
        <span
          onClick={() => navigate("/login")}
          style={{ cursor: "pointer", color: "#09f" }}
        >
          Logar
        </span>
      </p>
    </div>
  );
}

export { Signup };
