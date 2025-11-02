// src/components/SideBar/index.jsx
import { NavLink } from "react-router-dom";
import styles from "./sidebar.module.css";

const SideBar = () => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : "")}>
          Home
        </NavLink>
        <NavLink to="/alarmes" className={({ isActive }) => (isActive ? styles.active : "")}>
          Alarmes
        </NavLink>
        <NavLink to="/loja" className={({ isActive }) => (isActive ? styles.active : "")}>
          Loja
        </NavLink>
        <NavLink to="/agenda" className={({ isActive }) => (isActive ? styles.active : "")}>
          Agenda
        </NavLink>
      </nav>
    </aside>
  );
};

export { SideBar };