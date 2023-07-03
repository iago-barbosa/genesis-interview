import React from 'react';
import { UserContexts } from '../../contexts/UserContexts';
import api from '../../services/api';
import { FornecedorProps, FornecedoresCompletaProps, ListaFornecedoresProps, ProdutosFornecedorProps, TabelaPrecosProps } from '../../types';
import { Loading } from '../loading/loading';

export const TabelaPrecos:React.FC<TabelaPrecosProps> = ({renderizar}) => {
    const { loading, setLoading, produtosPedido, fornecedor1, setFornecedor1, fornecedor2, setFornecedor2, fornecedor3, setFornecedor3 } = React.useContext(UserContexts);
    const [showModal, setShowModal] = React.useState(false);
    const [listaFornecedores, setListaFornecedores] = React.useState<ListaFornecedoresProps[] | undefined>(undefined);
    const [fornecedorAtual, setFornecedorAtual] = React.useState(0);
    const [fornecedoresCompleta, setFornecedoresCompleta] = React.useState<FornecedoresCompletaProps[] | undefined>(undefined);
    const [ fornecedoresFull, setFornecedoresFull ] = React.useState(false);

    const formatCNPJ = (cnpj: string) => {
        const cnpjRegex = /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/;
        const formattedCNPJ = cnpj.replace(cnpjRegex, '$1.$2.$3/$4-$5');
        return formattedCNPJ;
    };

    React.useEffect(() => {
        if(fornecedoresFull){
            setTimeout(() => {
                setFornecedoresFull(false);
            }, 1500);
        }

    },[fornecedoresFull]);
    
    React.useEffect(() => {
        if(renderizar) {
            if (produtosPedido) {
                const idProducts: number[] = [];
                produtosPedido.map((produto) => idProducts.push(produto.id));
                setLoading(true);
                api.get('/listarPrecosFornecedores', {params: {
                    produtos: JSON.stringify(idProducts)
                }}).then(
                    (res) => {
                        const { data, status } = res;
                        if (status === 200) {
                            setListaFornecedores(data);
                            setLoading(false);        
                        }
                    }
                ).catch((error) => {
                    console.error('Algo deu errado!');
                    setLoading(false);
                });
    
            }
        }
    },[renderizar]);

    React.useEffect(() => {
        if(listaFornecedores) {
            gerarListaCompleta();
        }
    }, [listaFornecedores]);

    const gerarListaCompleta = () => {
        if(listaFornecedores) {
            if(produtosPedido) {
                const newFornecedores: FornecedoresCompletaProps[] = listaFornecedores.map((currentFornecedor) => {
                    const produtosFiltrados: ProdutosFornecedorProps[] = currentFornecedor.produtos
                      .filter((currentProduto) => produtosPedido.some((produto) => produto.id === currentProduto.id))
                      .map((currentProduto) => {
                        const produtoPedido = produtosPedido.find((produto) => produto.id === currentProduto.id);
                        return {
                            id: currentProduto.id,
                            nome: currentProduto.nome,
                            quantidade: produtoPedido?.quantidade || 0,
                            valorUnitario: currentProduto.preco,
                            valorTotal: (produtoPedido?.quantidade || 0) * parseFloat(currentProduto.preco.toFixed(2))
                        };
                      });
                  
                    const totalFornecedor = parseFloat(produtosFiltrados.reduce((total, produto) => total + (produto.valorTotal || 0), 0).toFixed(2)) ;
                  
                    return {
                        id: currentFornecedor.id,
                        nome: currentFornecedor.nome,
                        cnpj: currentFornecedor.cnpj,
                        total: totalFornecedor,
                        produtos: produtosFiltrados
                    };
                });
                  

                newFornecedores.sort((a, b) => a.total - b.total);
                setFornecedoresCompleta(newFornecedores);
            }
        }
    }

    const gerarDetalhesDoOrcamento = () => {
        if(fornecedoresCompleta) {
            const currentFornecedor = fornecedoresCompleta.find((fornecedor) => fornecedor.id === fornecedorAtual);
            if(currentFornecedor) {
                return currentFornecedor.produtos.map((produto) => {
                    return (
                        <tr>
                            <td>{produto.nome}</td>
                            <td>{produto.quantidade}</td>
                            <td>{produto.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td>{produto.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        </tr>
                    )
                })
            }
        }
        return (
            <tr></tr>
        )
    }

    const selectFornecedores = (fornecedor: FornecedoresCompletaProps) => {
        const fornecedorData: FornecedorProps = {
            id: fornecedor.id,
            cnpj: fornecedor.cnpj,
            nome: fornecedor.nome
        }
        const fornecedorEmpty:FornecedorProps = {
            id: 0,
            cnpj: '',
            nome: ''
        }
        if(!fornecedor1 || fornecedor1?.id === 0) {
            setFornecedor1(fornecedorData);
        } else if((!fornecedor2 || fornecedor2?.id === 0) && fornecedor?.id !== fornecedor1.id) {
            setFornecedor2(fornecedorData);
        } else if((!fornecedor3 || fornecedor3?.id === 0)  && fornecedor?.id !== fornecedor1.id && fornecedor?.id !== fornecedor2?.id) {
            setFornecedor3(fornecedorData);
        } else {
            if(fornecedor1 && fornecedor1.id === fornecedor.id) {
                setFornecedor1(fornecedorEmpty);
            } else if((fornecedor2 && fornecedor2.id === fornecedor.id) && fornecedor?.id !== fornecedor1.id) {
                setFornecedor2(fornecedorEmpty);
            } else if((fornecedor3 && fornecedor3.id === fornecedor.id)  && fornecedor?.id !== fornecedor1.id && fornecedor?.id !== fornecedor2?.id) {
                setFornecedor3(fornecedorEmpty);
            } else {
                setFornecedoresFull(true);
            }
        }
    }

    const gerarOrcamento = () => {
        if (fornecedoresCompleta) {
            return fornecedoresCompleta.map((currentFornecedor) => {
                return (
                    <tr>
                        <td>
                            <input
                                className={`form-check-input ${
                                fornecedor1?.id === currentFornecedor.id ||
                                fornecedor2?.id === currentFornecedor.id ||
                                fornecedor3?.id === currentFornecedor.id
                                    ? 'checked'
                                    : ''
                                }`}
                                onClick={() => selectFornecedores(currentFornecedor)}
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                checked={
                                fornecedor1?.id === currentFornecedor.id ||
                                fornecedor2?.id === currentFornecedor.id ||
                                fornecedor3?.id === currentFornecedor.id
                                }
                            />
                        </td>
                        <td>{currentFornecedor.nome}</td>
                        <td>{formatCNPJ(currentFornecedor.cnpj)}</td>
                        <td>{currentFornecedor.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td><button type="button" className="btn BtnCadastrarOrcamento" onClick={() => {setShowModal(true); setFornecedorAtual(currentFornecedor.id)}}>Ver Detalhes</button></td>
                    </tr>
                );
          });
        } else {
          return (
            <tr></tr>
          );
        }
    };


    return(
        <>
            <div className='TabelaPrecosContainer'>
                <div className={`alert alert-danger altertFornecedorFull ${fornecedoresFull ? 'show' : ''}`}>Você já possui 3 fornecedores selecionados.</div>   
                <table className="table">
                    <thead>
                        <tr>
                            <th scope='col'></th>
                            <th scope="col">Fornecedor</th>
                            <th scope="col">CNPJ</th>
                            <th scope="col">Total</th>
                            <th scope="col">Detalhes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gerarOrcamento()}
                    </tbody>
                </table>
                {showModal && (
                                <div className="modal" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Preços do fornecedor</h5>
                                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                        </div>
                                        <div className="modal-body ModalDetalhes">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope='col'>Produto</th>
                                                        <th scope="col">Quantidade</th>
                                                        <th scope="col">Valor Unitario</th>
                                                        <th scope="col">Valor Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {gerarDetalhesDoOrcamento()}
                                                </tbody>
                                            </table>
                                            
                                        </div>
                                        <div className="modal-footer"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
            </div>
        </>
    )
};

export default TabelaPrecos;