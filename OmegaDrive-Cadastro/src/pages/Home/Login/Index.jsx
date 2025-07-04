import { useRef } from "react";
import "./style.css";
import Omega from "../../../assets/Omega.png";
import api from "../../../services/api";

function Login({ onCriarConta, onLoginSucesso }) {
    const inputEmail = useRef(null);
    const inputPassword = useRef(null);

    async function handleLogin(event) {
        event.preventDefault();

        const email = inputEmail.current.value;
        const password = inputPassword.current.value;

        try {
            const response = await api.post("/login", { email, password });

            alert("Login realizado com sucesso!");

            // Salva o token no localStorage
            localStorage.setItem("token", response.data.token);

            // Avisa o componente pai que o login deu certo
            if (onLoginSucesso) {
                onLoginSucesso();
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Login falhou. Verifique suas credenciais.");
        }
    }

    return (
        <div className="container dark-mode">
            <form onSubmit={handleLogin} className="fade-in">
                <div className="logo-header">
                    <img src={Omega} alt="Símbolo Omega" className="logo-omega" />
                    <h2>Grupo Omega</h2>
                </div>

                <h1>Login</h1>

                <label htmlFor="email" className="sr-only">
                    E-mail
                </label>
                <input id="email" type="email" placeholder="E-mail" ref={inputEmail} required />

                <label htmlFor="password" className="sr-only">
                    Senha
                </label>
                <input id="password" type="password" placeholder="Senha" ref={inputPassword} required />

                <button type="submit">Entrar</button>

                <div className="link-wrapper">
                    <button type="button" className="link-button" onClick={onCriarConta}>
                        Criar Novo Usuário?
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
