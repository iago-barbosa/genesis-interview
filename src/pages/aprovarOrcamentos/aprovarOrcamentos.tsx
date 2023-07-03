import React from 'react';
import Header from "../../components/header/header";
import {ReactComponent as Search} from '../../assets/search.svg';
import './aprovarOrcamentos.scss';
import api from '../../services/api';
import TabelaOrcamentos from '../../components/tabelaOrcamentos/tabelaOrcamentos';
import { UserContexts } from '../../contexts/UserContexts';
import { Loading } from '../../components/loading/loading';
import { DetalhesPedidoProps, ProdutosPedidoProps } from '../../types';
import { useNavigate } from 'react-router-dom';

export const AprovarOrcamentos = () => {
    const navigate = useNavigate();
    const { loading, setLoading } = React.useContext(UserContexts);
    const [buscaOrcamentos, setBuscaOrcamentos] = React.useState('');
    const [orcamento, setOrcamento] = React.useState<DetalhesPedidoProps[] | undefined>(undefined);
    const [fornecedorSelect, setFornecedorSelect] = React.useState('fornecedor1');
    const [fornecedorIdSelected, setFornecedorIdSelected] = React.useState<number | undefined>(undefined);
    const [showModal, setShowModal] = React.useState(false);
    const [selectedPedidoId, setSelectedPedidoId] = React.useState<number | null>(null);
    const [selectedPedido, setSelectedPedido] = React.useState<DetalhesPedidoProps | undefined>(undefined);
    const [produtosPedido, setProdutosPedido] = React.useState<ProdutosPedidoProps[] | undefined>(undefined);

    const formatCNPJ = (cnpj: string) => {
        const cnpjRegex = /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/;
        const formattedCNPJ = cnpj.replace(cnpjRegex, '$1.$2.$3/$4-$5');
        return formattedCNPJ;
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModal = () => {
        if(fornecedorIdSelected){
            setShowModal(true);
        }
    };

    React.useEffect(() => {
        if(buscaOrcamentos === '') {
            buscarOrcamentosAprovacao();
        }
    }, [buscaOrcamentos]);

    React.useEffect(() => {
        if(orcamento) {
            if(selectedPedidoId) {
                setSelectedPedido(
                    orcamento.find((orc) => {
                        return orc.pedido.id === selectedPedidoId;
                    })
                )
            }
        }
    },[selectedPedidoId]);

    React.useEffect(() => {
        if (selectedPedido){
            setFornecedorIdSelected(selectedPedido.fornecedores[0].id);
            const params = {
                pedidoId: selectedPedido.pedido.id,
                fornecedor1: selectedPedido.fornecedores[0].id,
                fornecedor2: selectedPedido.fornecedores[1].id,
                fornecedor3: selectedPedido.fornecedores[2].id
            }
            setLoading(true);
            api.get('/precosPedidoAprovacao', {params}).then(
                (res) => {
                    const { data, status } = res;
                    if (status === 200) {
                        setProdutosPedido(data);
                        setLoading(false);
                    }
                }
            ).catch((error) => {
                setLoading(false);
                console.error('Algo deu errado');
            });
        }
    },[selectedPedido]);

    const aprovarOrcamento = () => {
        console.log('aqui');
        console.log(fornecedorIdSelected);
        console.log(selectedPedido);
        api.post('/aprovarPedido', {
            fornecedor: fornecedorIdSelected,
            pedido: selectedPedido?.pedido.id
        }).then(
            (res) => {
                const { status } = res;
                if (status === 200) {
                    setSelectedPedido(undefined as unknown as DetalhesPedidoProps);
                    setFornecedorIdSelected(undefined as unknown as number);
                    handleCloseModal();
                    navigate('/');
                }
            }
        ).catch((error) => {
            console.error('Algo deu errado!');
            handleCloseModal();
        })
    }

    const buscarOrcamentosAprovacao = () => {
        setLoading(true);
        if(parseInt(buscaOrcamentos)){
            const params = {
                id: parseInt(buscaOrcamentos)
            };
            api.get('/procurarPedido', { params }).then(
                (res) => {
                    const { data, status } = res;
                    if (status === 200) {
                        setOrcamento([data]);
                        setLoading(false);
                    }
                }
            ).catch((error) => {
                setLoading(false);
                console.error('Algo deu errado');
            });
        } else {
            const params = {
                produto: buscaOrcamentos
            };
            api.get('/pedidosAprovacao', { params }).then(
                (res) => {
                    const { data, status } = res;
                    if (status === 200) {
                        setOrcamento(data);
                        setLoading(false);
                    }
                }
            ).catch((error) => {
                setLoading(false);
                console.error('Algo deu errado');
            });
            setLoading(false);
            
        }
    }

    const gerarProdutos = () => {
        if (produtosPedido) {
            return produtosPedido.map((produto) => {
                return (
                    <tr className='TableRow' key={produto.produto_id}>
                        <td>{produto.produto}</td>
                        <td>{produto.quantidade}</td>
        
                        <td>{produto.fornecedor1_preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td>{(produto.quantidade * parseFloat(produto.fornecedor1_preco.toFixed(2))).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
        
                        <td>{produto.fornecedor2_preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td>{(produto.quantidade * parseFloat(produto.fornecedor2_preco.toFixed(2))).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>

                        <td>{produto.fornecedor3_preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td>{(produto.quantidade * parseFloat(produto.fornecedor3_preco.toFixed(2))).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    </tr>
                )
            })
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
            <div className="AprovarOrcamentosContainerHeader">
                <div className="mb-3 input-group BuscaOrcamentosContainer">
                    <input className="form-control me-2 Input" type="search" placeholder="Insira o Id do Pedido ou nome do produto" aria-label="Produtos" value={buscaOrcamentos} onChange={ event => setBuscaOrcamentos(event.target.value)} />
                    <button className="btn btnSearch" type="button" id="button-addon2" onClick={buscarOrcamentosAprovacao}><Search/></button>
                </div>
                <div className="ExibeOrcamentosContainer">
                    <TabelaOrcamentos orcamentos={orcamento} selectedPedidoId={selectedPedidoId} setSelectedPedidoId={setSelectedPedidoId} />
                </div>
            </div>
            <div className='AprovarOrcamentosContainerBody'>
                <div className='CabecalhoPedido'>
                    <div className='PedidoGroup'>
                        <span className='Title'>Nº Pedido:</span>
                        <span className='Text'>{selectedPedido ? selectedPedido.pedido.id : ''}</span>
                    </div>
                    <div className='PedidoGroup'>
                        <span className='Title'>Data:</span>
                        <span className='Text'> {selectedPedido ? selectedPedido.pedido.data : ''}</span>
                    </div>
                </div>
                <div className='DadosProdutosPedido'>
                    <table className="table TabelaProdutos">
                        <thead>
                            <tr className='HeaderFornecedores'>
                                <th scope="col" colSpan={2}></th>
                                <th scope="col" colSpan={2}>1º Fornecedor</th>
                                <th scope="col" colSpan={2}>2º Fornecedor</th>
                                <th scope="col" colSpan={2}>3º Fornecedor</th>
                            </tr>
                            <tr>
                                <th scope="col">Produto</th>
                                <th scope="col">Qtd</th>
                            
                                <th scope="col">Valor Unitario</th>
                                <th scope="col">Valor Total</th>

                                <th scope="col">Valor Unitario</th>
                                <th scope="col">Valor Total</th>

                                <th scope="col">Valor Unitario</th>
                                <th scope="col">Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gerarProdutos()}
                        </tbody>
                    </table>
                </div>
                <form className='FooterPedido'>
                    {
                        selectedPedido ?
                        <><div className={`form-check CartaoFornecedor ${fornecedorSelect === 'fornecedor1' ? 'selected' : ''}`} onClick={() => {setFornecedorSelect('fornecedor1'); setFornecedorIdSelected(selectedPedido.fornecedores[0].id)}}>
                        <input className="form-check-input" type="radio" name="flexRadioFornecedor" id="flexRadioFornecedor1" value="option1" checked={fornecedorSelect === 'fornecedor1'} />
                        <div className="form-check-label CartaoBody">
                            <span className='Title'>Fornecedor 1</span>
                            <span>{selectedPedido.fornecedores[0].nome}</span>
                            <span>CNPJ: {formatCNPJ(selectedPedido.fornecedores[0].cnpj)}</span>
                            <span>Valor Total: {selectedPedido.fornecedores[0].valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    </div>
                    <div className={`form-check CartaoFornecedor ${fornecedorSelect === 'fornecedor2' ? 'selected' : ''}`} onClick={() => {setFornecedorSelect('fornecedor2'); setFornecedorIdSelected(selectedPedido.fornecedores[1].id)}}>
                        <input className="form-check-input" type="radio" name="flexRadioFornecedor" id="flexRadioFornecedor2" value="option2" checked={fornecedorSelect === 'fornecedor2'} />
                        <div className="form-check-label CartaoBody">
                            <span className='Title'>Fornecedor 2</span>
                            <span>{selectedPedido.fornecedores[1].nome}</span>
                            <span>CNPJ: {formatCNPJ(selectedPedido.fornecedores[1].cnpj)}</span>
                            <span>Valor Total: {selectedPedido.fornecedores[1].valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    </div>
                    <div className={`form-check CartaoFornecedor ${fornecedorSelect === 'fornecedor3' ? 'selected' : ''}`} onClick={() => {setFornecedorSelect('fornecedor3'); setFornecedorIdSelected(selectedPedido.fornecedores[2].id)}}>
                        <input className="form-check-input" type="radio" name="flexRadioFornecedor" id="flexRadioFornecedor3" value="option3" checked={fornecedorSelect === 'fornecedor3'} />
                        <div className="form-check-label CartaoBody">
                            <span className='Title'>Fornecedor 3</span>
                            <span>{selectedPedido.fornecedores[2].nome}</span>
                            <span>CNPJ: {formatCNPJ(selectedPedido.fornecedores[2].cnpj)}</span>
                            <span>Valor Total: {selectedPedido.fornecedores[2].valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    </div></>
                        :
                        <></>
                    }
                </form>
                <button type='button' className="btn mb-3 buttonAprovarOrcamento" onClick={handleOpenModal}>Aprovar orçamento</button>

                {showModal && (
                    <div className="modal" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Aprovar Orçamento</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>Tem certeza que deseja escolher esse fornecedor ?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn BtnModalCancel" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn BtnModalConfirm" onClick={aprovarOrcamento}>
                                    Cadastrar
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AprovarOrcamentos;