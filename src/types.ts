export type UserTypeProps = {
    id: number,
    nome: string,
    gerente: boolean
};

export type PedidoItemProps = {
    id: number,
    nome: string,
    quantidade: number,
    fornecedor1: FornecedorPrecoProps,
    fornecedor2: FornecedorPrecoProps,
    fornecedor3: FornecedorPrecoProps,
}

export type FornecedorPrecoProps = {
    id: number,
    nome: string,
    preco: number,
}

export type FornecedorPrecoResponseProps = {
    id_fornecedor: number,
    fornecedor: string,
    id_produto: number,
    produto: string,
    preco: number
}

export type ProductProps = {
    id: number,
    nome: string,
    descricao: string,
}

export type FornecedorProps = {
    id: number,
    nome: string,
    cnpj: string,
}

export type TabelaPrecosProps = {
    renderizar: boolean
}

export type TabelaProdutosProps = {
    produtos: ProductProps[] | undefined;
    atualizaPrecos: () => void;
}

export type ListPedidoItemProps = {
    id: number,
    data: string,
    nome: string,
    status: string,
    aprovado: number,
    valorAprovado: number,
    valorMinimo: number,
    valorMaximo: number
}

export type ListaFornecedoresProps = {
    id: number,
    cnpj: string,
    nome: string,
    produtos: FornecedorPrecoProps[]
}

export type ProdutosFornecedorProps =  { 
    id: number,
    nome: string,
    quantidade: number,
    valorUnitario: number,
    valorTotal: number 
}

export type FornecedoresCompletaProps = {
    id: number,
    nome: string,
    cnpj: string,
    total: number,
    produtos: ProdutosFornecedorProps[]
}

export type DetalhePedidoProps = {
    id: number,
    data: string,
    comprador: string,
    statusId: number,
    status: string,
    melhor_oferta: boolean
}

export type DetalheFornecedoresProps = {
    id: number,
    nome: string,
    cnpj: string,
    aprovado: number,
    valor_total: number
}

export type DetalheProdutosProps = {
    aprovado: number,
    nome: string,
    quantidade: number,
    valorAprovado: number,
    valorMinimo: number,
    valorMaximo: number
}

export type DetalhesPedidoProps = {
    fornecedores: DetalheFornecedoresProps[],
    pedido: DetalhePedidoProps,
    produtos: DetalheProdutosProps[]
}

export type TabelaOrcamentoProps = {
    orcamentos: DetalhesPedidoProps[] | undefined,
    selectedPedidoId: number | null,
    setSelectedPedidoId: (id: number | null) => void
}

export type OrcamentoListProps = {
    id: number,
    produtos: number,
    quantidadeTotal: number,
    menorOrcamento: number,
    maiorOrcamento: number
}

export type ProdutosPedidoProps = {
    produto_id: number,
    produto: string,
    quantidade: number,
    fornecedor1_preco: number,
    fornecedor2_preco: number,
    fornecedor3_preco: number
}