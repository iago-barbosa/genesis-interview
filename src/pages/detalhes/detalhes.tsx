import React from 'react';
import { useLocation } from 'react-router-dom';
import './detalhes.scss';
import Header from '../../components/header/header';
import api from '../../services/api';
import { DetalheFornecedoresProps, DetalheProdutosProps, DetalhesPedidoProps } from '../../types';
import { Loading } from '../../components/loading/loading';
import { UserContexts } from '../../contexts/UserContexts';

export const Detalhes = () => {
    const { loading, setLoading } = React.useContext(UserContexts);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pedido = searchParams.get('pedido');
    const [detalhes, setDetalhes] = React.useState<DetalhesPedidoProps | undefined>(undefined);
    const [selectedFornecedor, setSelectedFornecedor] = React.useState<DetalheFornecedoresProps | undefined>(undefined);
    
    const params = {
        id: pedido
    };
    
    React.useEffect(() => {
        setLoading(true);
        api.get('/procurarPedido', { params }).then(
            (res) => {
                const { data, status } = res;
                if (status === 200) {
                    if(data.pedido.statusId === 2) {
                        data.fornecedores.map((fornecedor: DetalheFornecedoresProps) => {
                            if(fornecedor.aprovado === 1) {
                                setSelectedFornecedor(fornecedor)
                            }
                        })
                    }
                    setDetalhes(data);
                    setLoading(false);
                }
            }
        ).catch((error) => {
            setLoading(false);
            console.error('Algo deu errado');
        });
    }, []);

    const renderProdutos = () => {
        return detalhes?.produtos.map((produto: DetalheProdutosProps) => {
            return(
                <tr>
                    <td>{produto.nome}</td>
                    <td>{produto.quantidade}</td>
                    <td>{produto.aprovado ? 
                        produto.valorAprovado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 
                        `${produto.valorMinimo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} ~ 
                        ${produto.valorMaximo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}</td>
                    <td>{produto.aprovado ?
                        (produto.quantidade * parseFloat(produto.valorAprovado.toFixed(2))).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        :
                        `
                            ${(produto.quantidade * parseFloat(produto.valorMinimo.toFixed(2))).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            ~
                            ${(produto.quantidade * parseFloat(produto.valorMaximo.toFixed(2))).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        `
                    }</td>
                </tr>
            )
        })
    }

    const renderPage = () => {
        if(detalhes) {
            return (
                <div className='DetalhesPedidoContainer'>
                    <div className='HeaderContainer'>
                        <div className='HeaderDetalhesContent'>
                            <div className='content'><span className='title'>Status: </span><span>{detalhes.pedido.status}</span></div>
                            <div className='content'><span className='title'>Fornecedor: </span>
                                <span>
                                    {selectedFornecedor ?  selectedFornecedor.nome : '*'}
                                </span>
                            </div>
                            <div className='content'><span className='title'>Data: </span>{detalhes.pedido.data}</div>
                            <div className='content'><span className='title'>Comprador: </span>{detalhes.pedido.comprador}</div>
                            <div className='content'><span className='title'>Valor Total do Orçamento: </span>{selectedFornecedor ? selectedFornecedor.valor_total : '*'}</div>
                        </div>
                        {
                            detalhes.pedido.statusId === 2 && (
                                <>
                                    {
                                        detalhes.pedido.melhor_oferta ? 
                                            <div className="alert alert-success" role="alert">
                                                Esse foi o orçamento mais barato!
                                            </div>
                                            :
                                            <div className="alert alert-warning" role="alert">
                                                Esse não foi o orçamento mais barato!
                                            </div>
                                    }
                                </>
                            )
                        }
                        
                    </div>
                    <div className='TableContainer'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Produto</th>
                                <th scope="col">Quantidade</th>
                                <th scope="col">Valor Unitario</th>
                                <th scope="col">Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderProdutos()}
                        </tbody>
                    </table>
                    </div>

                </div>
            )
        } else {
            return (
                <div className='DetalhesPedidoContainer'>
                    <div className='HeaderContainer'>
                        <div className='HeaderDetalhesContent'>
                            <div className='content'><span className='title'>Status: </span></div>
                            <div className='content'><span className='title'>Fornecedor: </span></div>
                            <div className='content'><span className='title'>Data: </span></div>
                            <div className='content'><span className='title'>Comprador: </span></div>
                            <div className='content'><span className='title'>Valor Total do Orçamento: </span></div>
                        </div>
                    </div>
                    <div className='TableContainer'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Produto</th>
                                <th scope="col">Quantidade</th>
                                <th scope="col">Valor Unitario</th>
                                <th scope="col">Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr></tr>
                        </tbody>
                    </table>
                    </div>

                </div>
            )
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
            {renderPage()}
        </>
    )

}

export default Detalhes;