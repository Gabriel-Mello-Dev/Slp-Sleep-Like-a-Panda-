import { Inicial } from "./pages";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Routers";
import { AppContext, AppContextProvider } from "./contexts";

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AppContextProvider>
  );
}

export { App };
