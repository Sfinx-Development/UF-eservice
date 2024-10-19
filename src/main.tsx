import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Navigation from "./Navigation.tsx";
import store from "./SLICES/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
