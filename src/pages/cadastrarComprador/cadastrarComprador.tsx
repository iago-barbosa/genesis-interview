import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/header/header";
import './cadastrarComprador.scss';
import api from '../../services/api';
import { Loading } from '../../components/loading/loading';
import { UserContexts } from '../../contexts/UserContexts';

export const CadastrarComprador = () => {
    const { loading, setLoading } = React.useContext(UserContexts);
    const [nome, setNome] = React.useState('');
    const [login, setLogin] = React.useState('');
    const [senha, setSenha] = React.useState('');
    const [confirmarSenha, setConfirmarSenha] = React.useState('');
    const [alertMessage, setAlertMessage] = React.useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const campos = [nome, login, senha, confirmarSenha];
        const todosPreenchidos = campos.every((campo) => campo.length > 0);

            if (todosPreenchidos) {
                if(senha.length > 7) {
                    if (senha === confirmarSenha){
                        setLoading(true);
                        api.post('/cadastrarPerfil', {
                            'nome': nome,
                            'login': login,
                            'senha': senha
                        }).then(
                            (res) => {
                                const { status } = res;
                                if (status === 200) {
                                    setLoading(false);
                                    navigate('/');
                
                                }
                            }
                        ).catch((error) => {
                            setLoading(false);
                            setAlertMessage('Algo deu errado.');
                        })
                    } else {
                        setLoading(false);
                        setAlertMessage('As senhas devem ser iguais.');
                    }
                } else {
                    setLoading(false);
                    setAlertMessage('As senha deve possuir ao menos 8 caracteres.');
                }
            } else {
                setLoading(false);
                setAlertMessage('Por favor, preencha todos os campos!');
            }

    }

    return(
        <>
            {
                loading ?
                <Loading />
                :
                <></>
            }
            <Header />
            <div className="cadastrarCompradorContainer">
                <div className="cadastroContainer">
                    <div className="mb-3 inputContainer">
                        <label htmlFor="exampleFormControlInput1" className="form-label inputLabel">Nome:</label>
                        <input type="text" className="form-control inputCadastro" id="nome" maxLength={50} placeholder="Insira seu nome" value={nome} onChange={e => setNome(e.target.value)} />
                    </div>
                    <div className="mb-3 inputContainer">
                        <label htmlFor="exampleFormControlInput1" className="form-label inputLabel">Login:</label>
                        <input type="text" className="form-control inputCadastro" id="login" maxLength={50} placeholder="Insira seu login" value={login} onChange={e => setLogin(e.target.value)}/>
                    </div>
                    <div className="mb-3 inputContainer">
                        <label htmlFor="exampleFormControlInput1" className="form-label inputLabel">Senha:</label>
                        <input type="password" className="form-control inputCadastro" id="senha" maxLength={100} placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)}/>
                    </div>
                    <div className="mb-3 inputContainer">
                        <label htmlFor="exampleFormControlInput1" className="form-label inputLabel">Confirmar Senha:</label>
                        <input type="password" className="form-control inputCadastro" id="confirmarSenha" maxLength={100} placeholder="Confirmar Senha" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)}/>
                    </div>
                    <div className="mb-3 inputContainerButton">
                        <button type="submit" className="btn btn-primary mb-3 buttonCadastrar" onClick={e => handleSubmit(e)}>Cadastrar</button>
                    </div>
                    <span className='altertMessage'>{alertMessage}</span>
                </div>
            </div>
        </>
    );
}

export default CadastrarComprador;