import style from "./style404.module.css";

const Error404 = () => {
  return (
    <div className={style.container}>
      <div className={style.pandaWrapper}>
        <img src={"/logo.webp"} alt="Panda perdido" className={style.panda} />
      </div>
      <h1 className={style.title}>404</h1>
      <h2 className={style.subtitle}>Ops... Página não encontrada!</h2>
      <p className={style.text}>
        Parece que este panda se perdeu 🐾 — volte para a página inicial!
      </p>
      <a href="/" className={style.button}>
        Voltar ao Início
      </a>
    </div>
  );
};

export { Error404 };
