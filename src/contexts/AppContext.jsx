import { createContext, useState, useEffect } from 'react';
import { App } from '../App';
import { api } from '../services';

export const AppContext = createContext({});

export const AppContextProvider = (props) => {
  const { children } = props;
  const [tarefas, setTarefas] = useState([]);
  const [criador, setCriador] = useState("Gabriel Mello");
const [loadingCriar, setLoadingCriar]= useState(false);
const [loadingDeletar, setLoadingDeletar]= useState(null);
const [loadingEditar, setLoadingEditar]= useState(null);
const [loadingCarregar, setLoadingCarregar]= useState(false);

  const carregarTarefas = async () => {
   
       setLoadingCarregar(true)

   
    try {
      const response = await api.get('/tarefas');
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }


    setLoadingCarregar(false)
  };

 const adicionarTarefa = async (nomeTarefa) => {
  setLoadingCriar(true)
  
    const { data: tarefa } = await api.post('/tarefas',{
    nome: nomeTarefa,
  });

  setTarefas(estadoAtual => {
    return [
      ...estadoAtual,
      tarefa,
    ];
  });

    setLoadingCriar(false)

};


  const removerTarefa = async (idTarefa) => {
       setLoadingDeletar(idTarefa)

    await api.delete(`/tarefas/${idTarefa}`);
   
    setTarefas(estadoAtual => {
      return estadoAtual.filter(tarefa => tarefa.id !== idTarefa);
    });
           setLoadingDeletar(null)

  };

  const editarTarefa = async (id, nomeTarefa) => {
    
    setLoadingEditar(id)
    const {data: tarefaAtulizada} = await api.put(`/tarefas/${id}`, {nome: nomeTarefa})
    
    setTarefas(estadoAtual => {
      const tarefasAtualizadas = estadoAtual.map(tarefa => {
        return tarefa.id === id ? {
          ...tarefa,
          nome: tarefaAtulizada.nome
        } : tarefa;
      });
      return tarefasAtualizadas;
    });

        setLoadingEditar(null)

  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  return (
    <AppContext.Provider value={{ criador, 
    tarefas, 
    adicionarTarefa, 
    removerTarefa, 
    editarTarefa,
    loadingCriar,
    loadingDeletar,
    loadingEditar}}>
      {children}
    </AppContext.Provider>
  );
};