import { useRef } from "react";
import "./style.css";
import Omega from "../../../assets/Omega.png";
import api from "../../../services/api";

function Login({ onEsqueciSenha }) {
    const inputEmail = useRef();
    const inputPassword = useRef();

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const response = await api.post("/login", {
                email: inputEmail.current.value,
                password: inputPassword.current.value,
            });

            console.log("Usuário logado:", response.data);
            alert("Login realizado com sucesso!");

            // localStorage.setItem("token", response.data.token);
            // navigate("/home");

        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Login falhou. Verifique suas credenciais.");
        }
    }

    return (
        <div className="container">
            <form onSubmit={handleLogin}>
                <div className="logo-header">
                    <img src={Omega} alt="Símbolo Omega" className="logo-omega" />
                    <h2>Grupo Omega</h2>
                </div>

                <h1>Login</h1>
                <input placeholder="E-mail" type="email" ref={inputEmail} required />
                <input placeholder="Senha" type="password" ref={inputPassword} required />
                <button type="submit">Entrar</button>

                {/* Botão "Esqueci a senha" */}
                <p className="link-esqueci-senha">
                    <button type="button" onClick={onEsqueciSenha}>
                        Esqueci a senha
                    </button>
                </p>
            </form>
        </div>
    );
}

export default Login;
