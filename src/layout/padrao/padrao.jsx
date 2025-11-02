import { Outlet } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { SideBar } from "../../components/sidebar";
import { useEffect } from "react";
import styles from "./padrao.module.css";

const Padrao = () => {
  useEffect(() => {
    document.body.style.minHeight = "100vh";
  }, []);

  return (
    <div className={styles.layout}>
      <SideBar />
      <div className={styles.mainArea}>
        <TopBar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export { Padrao };
