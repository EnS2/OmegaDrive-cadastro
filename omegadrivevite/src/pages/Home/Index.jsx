import { useEffect, useState } from 'react'
import './style.css';
import Trash from '../../assets/icons8-lixo-50.png';
import Omega from '../../assets/omega.png'; // Certifique-se de que o caminho está certo
import api from '../../services/api.js'

function Home() {
  const [users, setUsers] = useState([])


  async function getUsers() {
    const usersFromApi = await api.get('/users')

    setUsers(usersFromApi.data)

  }

  useEffect(() => {
    getUsers()
  }, [])


  return (
    <div className="container">
      <form>
        {/* Cabeçalho com símbolo e nome */}
        <div className="logo-header">
          <img src={Omega} alt="Símbolo Omega" className="logo-omega" />
          <h2>Grupo Omega</h2>
        </div>

        <h1>Cadastro de Usuários</h1>
        <input placeholder='Nome' name='name' type='text' />
        <input placeholder='E-mail' name='email' type='email' />
        <input placeholder='Senha' name='password' type='password' />

        <button type='button'>Cadastrar</button>
      </form>

      {/* Lista de usuários */}
      {users.map(user => (
        <div key={user.id} className="card">
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <button type="button" title="Remover usuário">
            <img src={Trash} alt="Remover" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;
