import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import Login from './pages/Home/Login/index.jsx';
import Home from './pages/Home/Cadastro/Index.jsx';

import './index.css';

function Main() {
  const [tela, setTela] = useState('login');

  return (
    <React.StrictMode>
      {tela === 'login' ? (
        <Login onEsqueciSenha={() => setTela('cadastro')} />
      ) : (
        <Home onVoltar={() => setTela('login')} />
      )}
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
