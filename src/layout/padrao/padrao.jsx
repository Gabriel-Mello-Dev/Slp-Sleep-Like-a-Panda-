import { Outlet } from "react-router-dom";
import { Head, Foot } from "../../components";

const Padrao = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Foot />
    </div>
  );
};

export { Padrao };
