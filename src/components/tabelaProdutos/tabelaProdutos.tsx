import React from 'react';
import { TabelaProdutosProps } from "../../types";
import { UserContexts } from '../../contexts/UserContexts';

export const TabelaProdutos: React.FC<TabelaProdutosProps> = ({ produtos, atualizaPrecos }) => {
    const { produtosPedido, setProdutosPedido } = React.useContext(UserContexts);
    const [atualizacaoPrecosFeita, setAtualizacaoPrecosFeita] = React.useState(false);

    const adicionarProduto = (id: number, nome: string) => {
        const currentProduct = {
            id: id,
            nome: nome,
            quantidade: 1,
            fornecedor1: { id: 0, nome: '', preco: 0 },
            fornecedor2: { id: 0, nome: '', preco: 0 },
            fornecedor3: { id: 0, nome: '', preco: 0 },
        };
        
        if (produtosPedido) {
            const updatedProducts = produtosPedido.map((produto) => {
                if (produto.id === id) {
                return {
                    ...produto,
                    quantidade: produto.quantidade + 1,
                };
                }
                return produto;
            });
        
            const isProductInList = produtosPedido.some((produto) => produto.id === id);
        
            if (isProductInList) {
                setProdutosPedido(updatedProducts);
            } else {
                setProdutosPedido([...produtosPedido, currentProduct]);
            }
        } else {
            setProdutosPedido([currentProduct]);
        }
        
        Promise.resolve().then(() => {
            setAtualizacaoPrecosFeita(false);
        });
    };

    React.useEffect(() => {
        if (produtosPedido && !atualizacaoPrecosFeita) {
          Promise.resolve().then(() => {
            setAtualizacaoPrecosFeita(true);
            atualizaPrecos();
          });
        }
      }, [produtosPedido, atualizacaoPrecosFeita]);

    const gerarTabela = () => {
        if (produtos) {
            return produtos.map(produto => (
                <tr key={produto.id}>
                    <td>{produto.nome}</td>
                    <td>{produto.descricao}</td>
                    <td>
                        <button className="btn BtnAdicionar" onClick={() => adicionarProduto(produto.id, produto.nome)}>
                            Adicionar
                        </button>
                    </td>
                </tr>
            ));
        } else {
            return (
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            );
        }
    };

    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Descrição</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {gerarTabela()}
            </tbody>
        </table>
    );
};

export default TabelaProdutos;