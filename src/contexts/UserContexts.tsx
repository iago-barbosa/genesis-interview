import React, { ReactNode } from 'react';
import { UserTypeProps, PedidoItemProps, FornecedorProps} from '../types';

type UserContextProps = {
    children: ReactNode;
};


const initialValue = {
    signed: false,
    setSigned: (newState: boolean) => {},
    user: {
        id: 0,
        nome: "",
        gerente: false
    },
    setUser: (newState: UserTypeProps) => {},
    loading: false,
    setLoading: (newState: boolean) => {},
    produtosPedido: undefined as PedidoItemProps[] | undefined,
    setProdutosPedido: (newState: PedidoItemProps[]) => {},
    fornecedor1: undefined as FornecedorProps | undefined,
    setFornecedor1: (newState: FornecedorProps) => {},
    fornecedor2: undefined as FornecedorProps | undefined,
    setFornecedor2: (newState: FornecedorProps) => {},
    fornecedor3: undefined as FornecedorProps | undefined,
    setFornecedor3: (newState: FornecedorProps) => {},
};

export const UserContexts = React.createContext(initialValue);

export const UserContextProvider = ({ children }: UserContextProps) => {
    const [signed, setSigned] = React.useState(initialValue.signed);
    const [user, setUser] = React.useState<UserTypeProps>(initialValue.user)
    const [loading, setLoading] = React.useState(initialValue.loading);
    const [produtosPedido, setProdutosPedido] = React.useState<PedidoItemProps[] | undefined>(initialValue.produtosPedido);
    const [fornecedor1, setFornecedor1] = React.useState<FornecedorProps | undefined>();
    const [fornecedor2, setFornecedor2] = React.useState<FornecedorProps | undefined>();
    const [fornecedor3, setFornecedor3] = React.useState<FornecedorProps | undefined>();

    

    return (
        <UserContexts.Provider value={
            {
                signed, 
                setSigned, 
                user, 
                setUser, 
                loading, 
                setLoading, 
                produtosPedido, 
                setProdutosPedido, 
                fornecedor1, 
                setFornecedor1, 
                fornecedor2, 
                setFornecedor2, 
                fornecedor3, 
                setFornecedor3
            }
        }>{children}</UserContexts.Provider>
    );
};