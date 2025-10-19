import "./App.css";
import AppRoutes from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <div className="app">
      <AppRoutes />
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer
        autoClose={3000}
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </div>
  );
}

export default App;
