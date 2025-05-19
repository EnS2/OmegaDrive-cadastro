import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import Login from './pages/Home/Login/index.jsx';
import Cadastro from './pages/Home/Cadastro/Index.jsx';
import Home from './pages/Home/Cadastro/Index.jsx';

import './index.css';

function Main() {
  const [tela, setTela] = useState('login');

  return (
    <React.StrictMode>
      {tela === 'login' && <Login onCriarConta={() => setTela('cadastro')} />}
      {tela === 'cadastro' && <Cadastro onVoltar={() => setTela('login')} />}
      {tela === 'home' && <Home onVoltar={() => setTela('login')} />}
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
