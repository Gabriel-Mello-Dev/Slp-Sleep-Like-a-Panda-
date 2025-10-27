import { useState, useEffect } from "react";
import { api } from "../../services";
import { useNavigate } from "react-router-dom";
import styles from "./perfil.module.css";
import { Clock } from "../../components";

export default function Perfil() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!userId) return;
    api.get(`/users/${userId}`).then(res => {
      setUser(res.data);
      setNome(res.data.nome);
      setEmail(res.data.email);
    });
  }, [userId]);

  const salvarPerfil = async () => {
    if (!userId) return;
    try {
      await api.put(`/users/${userId}`, {...user, nome, email});
      setMsg("✅ Perfil atualizado!");
    } catch (error) {
      setMsg("❌ Erro ao atualizar perfil");
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    // Navega para a página inicial
    navigate("/", { replace: true });
    // Força recarregar a página para resetar estados
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <h2>Editar Perfil</h2>
      <Clock type="popup" />   

      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={salvarPerfil}>Salvar</button>
      <button onClick={logout} style={{marginTop:"10px"}}>Sair</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}

export { Perfil };
