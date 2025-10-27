import style from "./style404.module.css";

const Error404 = () => {
  return (
    <div className={style.erro}>
      <h1>404</h1>
      <h2>Pagina não localizada</h2>
    </div>
  );
};

export { Error404 };
