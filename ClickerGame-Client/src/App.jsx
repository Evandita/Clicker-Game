import axios from "axios";
import React from "react";
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import ItemList from "./ItemList";
import Login from "./Login";


export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/game/:accountId" element={<ItemList/>} />
      </Routes>
    </BrowserRouter>
  );
}