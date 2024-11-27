import { Permission } from "./Permission";
import { Usuario } from "./Usuarios";

export interface UserPermission {
    userId: string;
    userName: string;
    usuario: Usuario[];
    permissionId: string;
    permission: Permission[];
  }