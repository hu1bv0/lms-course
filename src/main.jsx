import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./store";
import { Provider } from "react-redux";
import WebFont from "webfontloader";
import "antd/dist/reset.css";
import "./index.css";
// import "./global.css";

WebFont.load({ google: { families: ["Roboto:300,400,500,600,700,800,900"] } });

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(container);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      retry: 1,
    },
  },
});

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#00b96b",
          },
        }}
      >
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </Provider>
);
