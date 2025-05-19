import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import Login from './pages/Home/Login/index.jsx';
import Cadastro from './pages/Home/Cadastro/Index.jsx';
import Home from './pages/Home/Site/Dashboard.jsx'; // ✅ Corrigido: Dashboard/Home

import './index.css';

function Main() {
  const [tela, setTela] = useState('login');

  return (
    <React.StrictMode>
      {tela === 'login' && (
        <Login
          onCriarConta={() => setTela('cadastro')}
          onLoginSucesso={() => setTela('home')} // ✅ Redireciona após login
        />
      )}

      {tela === 'cadastro' && (
        <Cadastro onVoltar={() => setTela('login')} />
      )}

      {tela === 'home' && (
        <Home onVoltar={() => {
          localStorage.removeItem('token'); // limpa token ao sair
          setTela('login');
        }} />
      )}
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
