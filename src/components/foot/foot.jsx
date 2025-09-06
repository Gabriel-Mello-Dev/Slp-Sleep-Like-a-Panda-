import styles from "./foot.module.css";

const Foot = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerText}>
        © {new Date().getFullYear()} - Sleep Like a Panda
      </p>
    </footer>
  );
};

export  {Foot};
