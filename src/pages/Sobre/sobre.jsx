import style from './sobre.module.css'

const Sobre = () => {
  return (
    <div className={style.container}>
      <h1 className={style.title}>Sleep Like a Panda (SLP)</h1>
      
      <p className={style.description}>
        Sleep Like a Panda é um site criado para ajudar a reduzir a ansiedade enquanto você navega na internet. 
        Ele oferece duas funcionalidades principais:
      </p>
      
      <ul className={style.features}>
        <li><strong>Alarmes de pausa:</strong> notificações periódicas para lembrar você de se levantar, se alongar ou beber água.</li>
        <li><strong>Modo relaxamento:</strong> reprodução de sons relaxantes, como chuva, para criar um ambiente tranquilo enquanto você trabalha ou estuda.</li>
      </ul>
      
      <p className={style.description}>
        O projeto foi desenvolvido como parte do <strong>HACKTEEN 2S/2025</strong>, na iniciativa <strong>Startup Frontend Creator</strong>, com o objetivo de criar ferramentas que cuidem do bem-estar das pessoas durante o uso do navegador ou computador.
      </p>
      
      <div className={style.authors}>
        <h2>Feito por alunos da Etec Jacinto Ferreiro de Sá:</h2>
        <ul>
          <li>Gabriel de Oliveira Mello</li>
          <li>Celso Fischer Neto</li>
          <li>Francisco Felipe da Silva</li>
        </ul>
      </div>

      <img src="/slp.png" alt="" />
    </div>
  )
}

export { Sobre }
