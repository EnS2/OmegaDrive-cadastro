import { useEffect, useState, useRef } from "react";
import "./style.css";
import Trash from "../../../assets/icons8-lixo-50.png"
import Omega from "../../../assets/Omega.png";
import api from "../../../services/api";


function Home() {
  const [users, setUsers] = useState([]);

  const inputName = useRef();
  const inputEmail = useRef();
  const inputPassword = useRef();
  //Cadastro de usuários
  async function getUsers() {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  }

  async function createUsers() {
    try {
      await api.post("/cadastro", {
        name: inputName.current.value,
        email: inputEmail.current.value,
        password: inputPassword.current.value,
      });

      inputName.current.value = "";
      inputEmail.current.value = "";
      inputPassword.current.value = "";

      getUsers();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    }
  }

  async function deleteUser(id) {
    if (window.confirm("Tem certeza que deseja remover este usuário?")) {
      try {
        await api.delete(`/users/${id}`);
        getUsers();
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
      }
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <form>
        <div className="logo-header">
          <img src={Omega} alt="Símbolo Omega" className="logo-omega" />
          <h2>Grupo Omega</h2>
        </div>

        <h1>Cadastro de Usuários</h1>
        <input placeholder="Nome" type="text" ref={inputName} />
        <input placeholder="E-mail" type="email" ref={inputEmail} />
        <input placeholder="Senha" type="password" ref={inputPassword} />

        <button type="button" onClick={createUsers}>
          Cadastrar
        </button>
      </form>

      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <button onClick={() => deleteUser(user.id)}>
            <img src={Trash} alt="Remover" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;
