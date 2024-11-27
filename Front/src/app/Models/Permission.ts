import { Usuario } from "./Usuarios";

export interface Permission {
    id: string;
    userName: string;
    usuarios: Usuario[];
  }