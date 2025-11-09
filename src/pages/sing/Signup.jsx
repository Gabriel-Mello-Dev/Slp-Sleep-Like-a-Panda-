import { useState } from "react";
import { api } from "../../services";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
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
      // Verifica se usuário já existe
      const resCheck = await api.get(`/users?email=${email}`);
      if (resCheck.data.length > 0) {
        setMsg("⚠️ Usuário já existe");
        return;
      }

      // Hash da senha antes de enviar
      const salt = bcrypt.genSaltSync(10); // gera salt
      const hashedPassword = bcrypt.hashSync(senha, salt);

      // Pega todos os usuários para calcular próximo ID
      const allUsers = await api.get("/users");
      let nextId = 1;
      if (allUsers.data.length > 0) {
        const ids = allUsers.data.map((u) => parseInt(u.id, 10));
        nextId = Math.max(...ids) + 1;
      }

      // Cria usuário com senha hash
      const res = await api.post("/users", {
        id: String(nextId),
        nome,
        email,
        senha: hashedPassword, // senha agora é hash
        skinEquipada: "gratis",
        skinsCompradas: ["gratis"],
      });

      localStorage.setItem("userId", res.data.id);
      setMsg("✅ Conta criada com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      navigate("/"); // home logado
    } catch (error) {
      console.error(error);
      setMsg("❌ Erro ao criar conta");
    }
  };

  return (
    <div className={styles.container}>
      <h2 style={{ color: "white" }}>Criar Conta</h2>
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

      <a href="/Login" style={{ color: "aquamarine" }}>
        já possui uma conta?
      </a>
      <button onClick={criarConta}>Criar Conta</button>
      {msg && (
        <p className={msg.includes("✅") ? styles.success : styles.error}>
          {msg}
        </p>
      )}
    </div>
  );
}

export { Signup };
