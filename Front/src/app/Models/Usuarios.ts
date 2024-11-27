import { UserPermission } from "./UserPermission";

export interface Usuario {
    id: string;
    password: string,
    userName: string;
    email: string;
    nome: string;
    sobrenome: string ;
    telefone:string;
    endereco:string;
    dataCadastro?: Date;  
    dataNascimento?: Date;  
    dataAtualizacao?: Date | null;
    userPermission: UserPermission[]
  }