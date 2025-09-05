import { Outlet } from 'react-router-dom';

const Padrao = () => {
  return (
    <div>
      <h2>Layout Padrão</h2>
      <Outlet /> 
    </div>
  );
};

export { Padrao };
