import React from 'react';
import { OrcamentoListProps, TabelaOrcamentoProps, TabelaProdutosProps } from "../../types";

export const TabelaOrcamentos:React.FC<TabelaOrcamentoProps> = ({orcamentos, selectedPedidoId, setSelectedPedidoId}) => {
    const [orcamentosList, setOrcamentosList] = React.useState<OrcamentoListProps[] | undefined>(undefined);

    React.useEffect(() => {
        if (orcamentos) {
            setOrcamentosList(undefined);
            let tempOrcamentosList: OrcamentoListProps[] = [];
            orcamentos.map((orcamento) => {
                const valor_totalArray: number[] = [];
                orcamento.fornecedores.map((fornecedor) => {
                    valor_totalArray.push(fornecedor.valor_total);
                });
                let quantidadeTotal = 0;
                orcamento.produtos.map((produto) => {
                    quantidadeTotal += produto.quantidade;
                })
                valor_totalArray.sort((a, b) => a - b);
                const currentOrcamento = {
                    id: orcamento.pedido.id,
                    produtos: orcamento.produtos.length,
                    quantidadeTotal,
                    menorOrcamento: valor_totalArray[0],
                    maiorOrcamento: valor_totalArray[2]
                }
                tempOrcamentosList.push(currentOrcamento);
            });
    
            setOrcamentosList(tempOrcamentosList);
        }
    }, [orcamentos]);

    const gerarLista = () => {
        if (orcamentosList) {
            return orcamentosList.map((orcamento) => {
                const isSelected = selectedPedidoId === orcamento.id;

                return (
                    <tr
                        className={`TableRow ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedPedidoId(orcamento.id)}
                        key={orcamento.id}
                    >
                        <td>{orcamento.id}</td>
                        <td>{orcamento.produtos}</td>
                        <td>{orcamento.quantidadeTotal}</td>
                        <td>{orcamento.menorOrcamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td>{orcamento.maiorOrcamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    </tr>
                );
            });
        }
    }

    return (
        <table className="table TabelaOrcamentos">
            <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Produtos</th>
                    <th scope="col">Qtd. total</th>
                    <th scope="col">Menor Orçamento</th>
                    <th scope="col">Maior Orçamento</th>
                </tr>
            </thead>
            <tbody>
                {gerarLista()}
            </tbody>
        </table>
    );
};

export default TabelaOrcamentos;