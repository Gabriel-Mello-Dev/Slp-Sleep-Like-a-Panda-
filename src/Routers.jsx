import { Routes, Route } from 'react-router-dom'; 
import { Inicial, Sobre, Error404, Alarmes } from './pages';
import { Padrao } from './layout';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Padrao />}>
        <Route index element={<Inicial />} /> 
        <Route path="sobrenos" element={<Sobre />} /> 
                <Route path="alarmes" element={<Alarmes />} /> 

                <Route path="*" element={<Error404 />} /> 

      </Route>
    </Routes>
  );
};

export { Router };
