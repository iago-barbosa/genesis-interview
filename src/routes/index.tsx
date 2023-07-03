import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/home/index';
import Login from '../pages/login/login';
import Detalhes from "../pages/detalhes/detalhes";
import CadastrarOrcamento from '../pages/cadastrarOrcamento/cadastrarOrcamento';
import AprovarOrcamentos from "../pages/aprovarOrcamentos/aprovarOrcamentos";
import CadastrarComprador from "../pages/cadastrarComprador/cadastrarComprador";
import { UserContexts } from "../contexts/UserContexts";

export const Routers = () => {
  const { signed, user } = React.useContext(UserContexts);
  
    return (
      <BrowserRouter>
          <Routes>
              <Route path="/" Component={signed ? Home : Login}></Route>
              <Route path="/detalhes" Component={signed ? Detalhes : Login}></Route>
              <Route path="/cadastrar-orcamento" Component={signed && !user.gerente ? CadastrarOrcamento : Login}></Route>
              <Route path="/aprovar-orcamentos" Component={signed && user.gerente ? AprovarOrcamentos : Login}></Route>
              <Route path="/cadastrar-comprador" Component={signed && user.gerente ? CadastrarComprador : Login}></Route>
          </Routes>
      </BrowserRouter>
    );
  }