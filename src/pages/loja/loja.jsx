import styles from "./loja.module.css";

const produtos = [
  { id: 1, nome: "Skin Panda Zen", preco: 19.99, "url": "https://png.pngtree.com/png-clipart/20250501/original/pngtree-peaceful-zen-panda-sitting-in-a-serene-yoga-pose-png-image_20924858.png" },
  { id: 2, nome: "Skin Panda Ninja", preco: 29.99 , "url": "https://png.pngtree.com/png-clipart/20230423/original/pngtree-the-panda-character-as-a-shaolin-warrior-carrying-a-bamboo-stick-png-image_9076894.png" },
  { id: 3, nome: "Skin Panda Robô", preco: 24.99, "url": "https://png.pngtree.com/png-vector/20250803/ourmid/pngtree-panda-robot-drawing-illustration-vector-png-image_16821857.webp"  },
  { id: 4, nome: "Skin Panda DJ", preco: 34.99, "url": "https://cdn.pixabay.com/photo/2023/09/24/10/12/ai-generated-8272508_1280.png"  },
];

const Loja = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}> de Skins de Pandas</h1>
      <div className={styles.grid}>
        {produtos.map((produto) => (
          <div key={produto.id} className={styles.card}>
            <div className={styles.imagem}>
              <img src={produto.url} alt="" />
            </div>
            <h2 className={styles.nome}>{produto.nome}</h2>
            <p className={styles.preco}>R$ {produto.preco.toFixed(2)}</p>
            <button className={styles.botao}>Comprar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Loja };
