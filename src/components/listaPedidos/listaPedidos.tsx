import React from 'react';
import { useNavigate } from 'react-router-dom';
import './listaPedidos.scss';
import api from '../../services/api';
import { ListPedidoItemProps } from '../../types';

export const ListaPedidos = () => {
    const [pedidosList, setPedidosList] = React.useState<ListPedidoItemProps[] | undefined>();
    const navigate = useNavigate();

    React.useEffect(() => {
        api.get(`/listarPedidos`).then(
            (res) => {
                const { data, status } = res;
                if (status === 200) {
                    setPedidosList(data);
                }
            }
        )
    }, []);

    const formatarData = (dataString: string): string => {
        const data = new Date(dataString);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
    
        return `${dia}/${mes}/${ano}`;
    };

    const listarPedidos = () => {
        if(pedidosList) {
            return pedidosList.map((pedido, index) => (
                <tr className='TableRow' key={index} onClick={() => navigate(`/detalhes?pedido=${pedido.id}`)}>
                    <td>{pedido.id}</td>
                    <td>{pedido.nome}</td>
                    <td>{formatarData(pedido.data)}</td>
                    <td>{
                        pedido.aprovado === 1 ?
                        pedido.valorAprovado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
                        :
                        `${pedido.valorMinimo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })} 
                        ~ 
                        ${pedido.valorMaximo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}`
                    }</td>
                    <td>{pedido.status}</td>
                </tr>
            ))
        }
    }

    return (
        <div className='ListaPedidosContainer'>
            <p className='TitleListaPedidos'>Últimos Pedidos</p>
            <table className="table TablePedidos">
                <thead>
                    <tr>
                        <th scope="col">Nº Pedido</th>
                        <th scope="col">Comprador</th>
                        <th scope="col">Data</th>
                        <th scope="col">Valor Total</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {listarPedidos()}
                </tbody>
            </table>
        </div>
    )
}

export default ListaPedidos;

