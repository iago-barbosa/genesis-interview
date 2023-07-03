import React from 'react';
import {ReactComponent as Excluir } from '../../assets/trash.svg';
import { UserContexts } from '../../contexts/UserContexts';


export const TabelaPedido = () => {
    const { produtosPedido, setProdutosPedido } = React.useContext(UserContexts);

    const handleValor = (id: number, quantidade: string) => {
        if(produtosPedido) {
            const updatedProducts = produtosPedido.map((produto) => {
            if (produto.id === id) {
                return {
                ...produto,
                quantidade: parseInt(quantidade) > 0 ? parseInt(quantidade) : 1
                };
            }
            return produto;
            });
            setProdutosPedido(updatedProducts);
        }
    }

    const deleteProduct = (id: number) => {
        if (produtosPedido) {
            const newPedido = produtosPedido.filter((produto) => produto.id !== id);
            setProdutosPedido(newPedido);
        }
    }

    const gerarTabela = () => {

        if (produtosPedido) {
            return produtosPedido.map((produto, index) => (
                <tr key={produto.id}>
                <th scope="row">{index+1}</th>
                <td>{produto.nome}</td>
                <td className='ColQtd'>
                    <input type="number" className="form-control" value={produto.quantidade} onChange={event => handleValor(produto.id, event.target.value)} /></td>
                <td><div className='BtnExcluir' onClick={() => deleteProduct(produto.id)}><Excluir /></div></td>
            </tr>
            ));
        } else {
            return (
                <tr>
                    <th scope="row">1</th>
                    <td colSpan={5}> Nenhum produto Adicionado.</td>
                </tr>
            );
        }
    } 

    return (
        <div className='TabelaPedidosContainer'>
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col"></th>
                    <th scope="col">Nome</th>
                    <th scope="col">Quantidade</th>
                    <th scope="col" className='ColQtd'>Excluir</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row"></th>
                        <td colSpan={2}></td>
                    </tr>
                    {gerarTabela()}
                </tbody>
            </table>

        </div>
    )
}

export default TabelaPedido;