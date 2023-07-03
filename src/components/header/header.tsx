import React from 'react';
import './header.scss';
import logo from '../../assets/genesis-group-logo.png';
import {ReactComponent as MenuMobile} from '../../assets/menu.svg';
import { useNavigate } from 'react-router-dom';
import { UserContexts } from '../../contexts/UserContexts';

export const Header = () => {
    const { user, setUser, setSigned, loading, setLoading } = React.useContext(UserContexts);
    const [isOpenMenu, setIsOpenMenu] = React.useState(false);
    const navigate = useNavigate();


    const goToPage = (page: string) => {
        navigate(page);
    }

    const Logout = () => {
        setUser({id: 0, nome: '', gerente: false});
        setSigned(false);

        goToPage('/');
    }

    return (
        <header className="header">
            <div className="logo" onClick={() => goToPage('/')}>
                <img alt="" src={logo} />
            </div>
            <div className='menuMobile' onClick={() => setIsOpenMenu(!isOpenMenu)}><MenuMobile /></div>
            <div className="menu">
                {
                    user.gerente ?
                    <>
                        <div className='content' onClick={() => goToPage('/aprovar-orcamentos')}>
                            <p>Aprovar Orçamentos</p>
                        </div>
                        <div className='content' onClick={() => goToPage('/cadastrar-comprador')}>
                            <p>Cadastrar Comprador</p>
                        </div>
                    </>
                    :
                    <>
                        <div className='content' onClick={() => goToPage('/cadastrar-orcamento')}>
                            <p>Cadastrar Orçamento</p>
                        </div>
                    </>
                }
                
            </div>
            <div className="logout">
                <button type="button" className="btn btn-logout" onClick={Logout}>Logout</button>
            </div>
            <div className={`menuContainer ${isOpenMenu ? 'fade-in' : ''}`}>
                <div className="menuHeader" onClick={() => setIsOpenMenu(!isOpenMenu)}>
                    <div className="content">
                        <MenuMobile />
                    </div>
                </div>
                <div className="menuBody">
                    <div className='item' onClick={Logout}><p>Logout</p></div>
                    {
                    user.gerente ?
                    <>
                        <div className='item' onClick={() => goToPage('/aprovar-orcamentos')}>
                            <p>Aprovar Orçamentos</p>
                        </div>
                        <div className='item' onClick={() => goToPage('/cadastrar-comprador')}>
                            <p>Cadastrar Comprador</p>
                        </div>
                    </>
                    :
                    <>
                        <div className='item' onClick={() => goToPage('/cadastrar-orcamento')}>
                            <p>Cadastrar Orçamento</p>
                        </div>
                    </>
                }
                </div>
            </div>
            <div className={`scrim ${isOpenMenu ? 'fade-in' : ''}`} onClick={() => setIsOpenMenu(!isOpenMenu)}></div>
        </header>
    )
}

export default Header;