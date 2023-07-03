import React from 'react';
import { useNavigate } from 'react-router-dom';
import './cadastroOrcamento.scss';
import Header from "../../components/header/header";
import TabelaProdutos from '../../components/tabelaProdutos/tabelaProdutos';
import { PedidoItemProps, ProductProps } from '../../types';
import TabelaPedido from '../../components/tabelaPedido/tabelaPedido';
import { UserContexts } from '../../contexts/UserContexts';
import api from '../../services/api';
import { FornecedorPrecoResponseProps } from '../../types';
import TabelaPrecos from '../../components/tabelaPrecos/tabelaPrecos';
import { Loading } from '../../components/loading/loading';

export const CadastrarOrcamento = () => {
    const { loading, setLoading, user, produtosPedido, setProdutosPedido, fornecedor1, fornecedor2, fornecedor3 } = React.useContext(UserContexts);
    const [pagination, setPagination] = React.useState(1);
    const [buscaProdutos, setBuscaProdutos] = React.useState('');
    const [produtos, setProdutos] = React.useState<ProductProps[] | undefined>(undefined);
    const [showModal, setShowModal] = React.useState(false);
    const [asProducts, setAsProducts] = React.useState(true);
    const [isFornecedorNull, setIsFornecedorNull] = React.useState(false);
    const navigate = useNavigate();
    
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleBuscaProdutos  = (val: string) => {
        setBuscaProdutos(val);
    }

    const handleCadastrarOrcamento = () => {
        if(fornecedor1 && fornecedor2 && fornecedor3) {
            if(fornecedor1?.id !== 0 && fornecedor2?.id !== 0 && fornecedor3?.id !== 0){
                handleOpenModal();
            } else {
                setIsFornecedorNull(true);
            }
        } else {
            setIsFornecedorNull(true);
        }
    }

    const confirmCadastrarOrcamento = () => {
        api.post('/cadastrarPedido', {
            comprador: user.id,
            pedido: produtosPedido
        }).then(
            (res) => {
                const { status } = res;
                if (status === 200) {
                    setProdutosPedido(undefined as unknown as PedidoItemProps[]);
                    handleCloseModal();
                    navigate('/');
                }
            }
        ).catch((error) => {
            console.error('Algo deu errado!');
            handleCloseModal();
        })
    }

    const atualizaPrecos = () => {
        if (produtosPedido) {
            const idProducts: number[] = [];
            const fornecedores: number[] = [];
            produtosPedido.map((produto) => idProducts.push(produto.id));
        
            if (fornecedor1 && fornecedor1.id !== 0) {
                fornecedores.push(fornecedor1.id);
            } else {
                fornecedores.push(0);
            }
            if (fornecedor2 && fornecedor2.id !== 0) {
                fornecedores.push(fornecedor2.id);
            }else {
                fornecedores.push(0);
            }
            if (fornecedor3 && fornecedor3.id !== 0) {
                fornecedores.push(fornecedor3.id);
            }else {
                fornecedores.push(0);
            }
            
            const updatedProdutosPedido = [...produtosPedido];
            
            const promises = fornecedores.map((fornecedor, index) => {
                if(fornecedor === 0) {
                    updatedProdutosPedido.forEach((produto, produtoIndex) => {
                        if (index === 0) {
                          updatedProdutosPedido[produtoIndex] = {
                            ...produto,
                            fornecedor1: { id: 0, nome: '', preco: 0 },
                          };
                        } else if (index === 1) {
                          updatedProdutosPedido[produtoIndex] = {
                            ...produto,
                            fornecedor2: { id: 0, nome: '', preco: 0 },
                          };
                        } else if (index === 2) {
                          updatedProdutosPedido[produtoIndex] = {
                            ...produto,
                            fornecedor3: { id: 0, nome: '', preco: 0 },
                          };
                        }
                      });
                } else {
                    const params = {
                        fornecedor: fornecedor,
                        produtos: idProducts,
                    };
                    return api.get('/listarPrecosFornecedor', { params }).then((res) => {
                        const { data, status } = res;
                        if (status === 200) {
                        data.map((precoFornecedor: FornecedorPrecoResponseProps) => {
                            const currentObject = updatedProdutosPedido.find(
                            (produto) => produto.id === precoFornecedor.id_produto
                            );
                
                            if (currentObject) {
                            const currentFornecedor = {
                                id: precoFornecedor.id_fornecedor,
                                nome: precoFornecedor.fornecedor,
                                preco: precoFornecedor.preco,
                            };
                            const objetoAtualizado =
                                index === 0
                                ? { ...currentObject, fornecedor1: currentFornecedor }
                                : index === 1
                                ? { ...currentObject, fornecedor2: currentFornecedor }
                                : { ...currentObject, fornecedor3: currentFornecedor };
                            const indice = updatedProdutosPedido.indexOf(currentObject);
                            updatedProdutosPedido[indice] = objetoAtualizado;
                            }
                        });
                        }
                    });
                }
                
            });
        
            Promise.all(promises)
            .then(() => {
                setProdutosPedido(updatedProdutosPedido);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    const goToNextStep = () => {
        if(produtosPedido) {
            if(produtosPedido.length > 0) {
                setLoading(true);
                setPagination(2);
            } else {
                setAsProducts(false);
            }
        } else {
            setAsProducts(false);
        }
        
    }

    React.useEffect(() => {
        atualizaPrecos();
    }, [fornecedor1, fornecedor2, fornecedor3]);


    React.useEffect(() => {
        if(buscaProdutos.length > 2){
            api.get(`/listarProdutos?search=${buscaProdutos}`).then(
                (res) => {
                    const { data, status } = res;
                    if (status === 200) {
                        setProdutos(data);
                    }
                }
            )
        } else if (buscaProdutos.length === 0) {
            api.get(`/listarProdutos`).then(
                (res) => {
                    const { data, status } = res;
                    if (status === 200) {
                        setProdutos(data);
                    }
                }
            )
        } else {
            setProdutos(undefined);
        }
    }, [buscaProdutos]);

    React.useEffect(() => {
        setLoading(true);
    },[]);

    React.useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    }, [loading]);

    React.useEffect(() => {
        if(!asProducts){
            setTimeout(() => {
                setAsProducts(true);
            }, 3500);
        }

    },[asProducts]);

    React.useEffect(() => {
        if(isFornecedorNull){
            setTimeout(() => {
                setIsFornecedorNull(false);
            }, 1500);
        }

    },[isFornecedorNull]);

    return(
        <>
            {
                loading ?
                <Loading />
                :
                <></>
            }
            <Header />
            <div className="CadastroContainer">
                <div className={`CadastroHeader ${pagination === 1 ? 'show': ''}`}>
                    <form className="input-group d-flex SearchContainer" role="search">
                        <span className="input-group-text InputText">Produto</span>
                        <input className="form-control me-2 Input" type="search" placeholder="Buscar Produtos" aria-label="Produtos" value={buscaProdutos} onChange={ event => handleBuscaProdutos(event.target.value)} />
                    </form>
                    <div className='PedidoContainer'>
                        <TabelaProdutos produtos={produtos} atualizaPrecos={atualizaPrecos} />
                    </div>
                </div>

                <div className={`CadastroBody ${pagination === 1 ? 'show': ''}`}>
                    <TabelaPedido />
                    <div className='BtnContainer'>
                        <button className="btn BtnCadastrarOrcamento" onClick={goToNextStep}>
                            Avançar
                        </button>
                    </div>
                    <div className={`alert alert-danger cadastrarOrcamentoError ${!asProducts ? 'show' : ''}`}>Você precisa adicionar ao menos um produto ao pedido.</div>

                </div>
                <div className={`CadastroBody ${pagination === 2 ? 'show': ''}`}>
                    <div className={`alert alert-danger cadastrarOrcamentoError ${isFornecedorNull ? 'show' : ''}`}>Você precisa selecionar 3 fornecedores.</div>
                    <TabelaPrecos renderizar={pagination === 2} />
                    <div className='BtnContainer'>
                        <button className="btn BtnVoltarOrcamento" onClick={() => setPagination(1)}>
                            Voltar
                        </button>
                        <button className="btn BtnCadastrarOrcamento" onClick={handleCadastrarOrcamento}>
                            Cadastrar orçamento
                        </button>
                    </div>
                    {showModal && (
                            <div className="modal" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Cadastrar Orçamento</h5>
                                        <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Tem certeza que deseja cadastrar esse orçamento ?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn BtnModalCancel" onClick={handleCloseModal}>
                                            Cancelar
                                        </button>
                                        <button type="button" className="btn BtnModalConfirm" onClick={confirmCadastrarOrcamento}>
                                            Cadastrar
                                        </button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </>
    );
}

export default CadastrarOrcamento;