import { useEffect, useState, useRef } from 'react';
import './style.css';
import Trash from '../../assets/icons8-lixo-50.png';
import Omega from '../../assets/omega.png'; // Certifique-se de que o caminho está certo
import api from '../../services/api.js';

function Home() {
  const [users, setUsers] = useState([]);

  const inputName = useRef();
  const inputEmail = useRef();
  const inputPassword = useRef();

  async function getUsers() {
    const usersFromApi = await api.get('/users');
    setUsers(usersFromApi.data);
  }

  async function createUsers() {
    await api.post('/users', {
      name: inputName.current.value,
      email: inputEmail.current.value,
      password: inputPassword.current.value
    });

    // Limpa os campos
    inputName.current.value = '';
    inputEmail.current.value = '';
    inputPassword.current.value = '';

    getUsers();
  }

  async function deleteUser(id) {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      await api.delete(`/users/${id}`);
      getUsers();
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <form>
        {/* Cabeçalho com símbolo e nome */}
        <div className="logo-header">
          <img src={Omega} alt="Símbolo Omega" className="logo-omega" />
          <h2>Grupo Omega</h2>
        </div>

        <h1>Cadastro de Usuários</h1>
        <input placeholder='Nome' name='name' type='text' ref={inputName} />
        <input placeholder='E-mail' name='email' type='email' ref={inputEmail} />
        <input placeholder='Senha' name='password' type='password' ref={inputPassword} />

        <button type='button' onClick={createUsers}>Cadastrar</button>
      </form>

      {/* Lista de usuários */}
      {users.map(user => (
        <div key={user.id} className="card">
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <button
            type="button"
            title="Remover usuário"
            onClick={() => deleteUser(user.id)}
          >
            <img src={Trash} alt="Remover" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;
