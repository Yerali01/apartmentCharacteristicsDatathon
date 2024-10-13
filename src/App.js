import React from "react";
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Main from "./pages/main_laptop";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
