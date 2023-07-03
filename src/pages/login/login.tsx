import React from "react";
import { useNavigate } from 'react-router-dom';
import './login.scss';
import { UserContexts } from "../../contexts/UserContexts";

import api from '../../services/api';
import { Loading } from "../../components/loading/loading";

export const Login = () => {
    const { setUser, setSigned, loading, setLoading } = React.useContext(UserContexts);
    const [login, setLogin] = React.useState('');
    const [senha, setSenha] = React.useState('');
    const navigate = useNavigate();

    const handleLogin  = (val: string) => {
        setLogin(val);
    }

    const handleSenha  = (val: string) => {
        setSenha(val);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        api.post('/login', {
            'login': login,
            'senha': senha
        }).then(
            (res) => {
                const { data, status } = res;
                if (status === 200) {
                    setUser({
                        id: data.id,
                        nome: data.nome,
                        gerente: data.gerente > 0 ? true : false,
                    });
                    setSigned(true);
                    setLoading(false);
                    navigate('/');

                }
            }
        ).catch((error) => {
            console.error('Usuario ou senha errados');
            setLoading(false);
        })
    }

    return (
        <>
            {
                loading ?
                <Loading />
                :
                <></>
            }
            <div className="loginContainter">
                <div className="loginFormContainer">
                    <form className="loginForm" onSubmit={handleSubmit}>
                        <div className="login mb-3">
                            <label className="form-label" htmlFor="login">Login:</label>
                            <input className="form-control" type="text" id="login" name="login" value={login} onChange={ event => handleLogin(event.target.value)} />
                        </div>
                        <div className="senha mb-3">
                            <label className="form-label" htmlFor="senha">Senha:</label>
                            <input className="form-control" type="password" id="senha" name="senha" value={senha} onChange={event => handleSenha(event.target.value)} />
                        </div>
                        <button type="submit" className="btn">Entrar</button>
                    </form>
                </div>
                <div className="background"></div>
            </div>
        </>
    )

}

export default Login;