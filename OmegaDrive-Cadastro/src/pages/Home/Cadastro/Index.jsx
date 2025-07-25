import { useEffect, useState, useRef } from "react";
import "./style.css";
import Trash from "../../../assets/icons8-lixo-50.png";
import Omega from "../../../assets/Omega.png";
import api from "../../../services/api";

function Home({ onVoltar }) {
  const [users, setUsers] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState(""); // 'alert-success' | 'alert-error'

  const inputName = useRef();
  const inputEmail = useRef();
  const inputPassword = useRef();

  function exibirMensagem(texto, tipo = "alert-info", tempo = 3000) {
    setMensagem(texto);
    setTipoMensagem(tipo);
    setTimeout(() => setMensagem(""), tempo);
  }

  async function getUsers() {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const name = inputName.current.value.trim();
    const email = inputEmail.current.value.trim();
    const password = inputPassword.current.value.trim();

    if (!name || !email || !password) {
      exibirMensagem("Preencha todos os campos.", "alert-error");
      return;
    }

    try {
      await api.post("/cadastro", { name, email, password });

      inputName.current.value = "";
      inputEmail.current.value = "";
      inputPassword.current.value = "";

      exibirMensagem("Usuário cadastrado com sucesso!", "alert-success");
      getUsers();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      exibirMensagem("Erro ao cadastrar. Verifique os dados e tente novamente.", "alert-error");
    }
  }

  async function deleteUser(id) {
    if (window.confirm("Tem certeza que deseja remover este usuário?")) {
      try {
        await api.delete(`/users/${id}`);
        exibirMensagem("Usuário removido com sucesso!", "alert-success");
        getUsers();
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        exibirMensagem("Erro ao deletar usuário.", "alert-error");
      }
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="logo-header">
          <img src={Omega} alt="Símbolo Omega" className="logo-omega" />
          <h2>Grupo Omega</h2>
        </div>

        <h1>Cadastro de Usuários</h1>

        <label className="sr-only" htmlFor="nome">Nome</label>
        <input
          id="nome"
          placeholder="Nome"
          type="text"
          ref={inputName}
          required
          autoComplete="name"
          aria-label="Nome"
        />

        <label className="sr-only" htmlFor="email">E-mail</label>
        <input
          id="email"
          placeholder="E-mail"
          type="email"
          ref={inputEmail}
          required
          autoComplete="email"
          aria-label="E-mail"
        />

        <label className="sr-only" htmlFor="senha">Senha</label>
        <input
          id="senha"
          placeholder="Senha"
          type="password"
          ref={inputPassword}
          required
          autoComplete="new-password"
          aria-label="Senha"
        />

        <button type="submit">Cadastrar</button>

        <button type="button" onClick={onVoltar} className="voltar-btn">
          Voltar para Login
        </button>
      </form>

      {/* Alerta visual */}
      {mensagem && (
        <div className={`alert ${tipoMensagem}`}>
          {mensagem}
        </div>
      )}

      {users.map((user) => (
        <div key={user.id} className="card">
          <div className="info">
            <p>Nome: <span>{user.name}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <button onClick={() => deleteUser(user.id)} aria-label="Remover usuário">
            <img src={Trash} alt="Ícone de lixeira" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;

