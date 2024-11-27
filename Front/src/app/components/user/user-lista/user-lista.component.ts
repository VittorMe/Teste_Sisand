import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Usuario } from '../../../Models/Usuarios';
import { BsModalRef, BsModalService  } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-lista',
  templateUrl: './user-lista.component.html',
  styleUrls: ['./user-lista.component.scss'],
})
export class UserListaComponent implements OnInit {
  
  public usuarioId = "";
  isLoggedIn: boolean = false;
  modalRef?: BsModalRef;
  public usuarioSelect: Usuario[] = [];
  public usuarios: Usuario[] = [];
  public eventosFiltrados: Usuario[] = [];
  private _filtroList: string = '';

  public get filtroList(): string {
    return this._filtroList;
  }

  public set filtroList(value: string) {
    this._filtroList = value;
    this.eventosFiltrados = this.filtroList ? this.filtrarEventos(this.filtroList) : this.usuarios;
  }

  public filtrarEventos(filtrarPor: string): Usuario[] {
    const filtro = filtrarPor?.toLocaleLowerCase() || ''; 
    return (this.usuarios || []).filter(usuario =>
      (usuario.nome || '').toLocaleLowerCase().includes(filtro) || 
      (usuario.sobrenome || '').toLocaleLowerCase().includes(filtro)
    );
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verifica inicialmente se o usuário está autenticado
    this.checkAuthentication();

    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }

    this.getUsuarios();
  }
  public getUsuarios():void{
    this.spinner.show();
    this.userService.getUsuarios().subscribe(
      (data: Usuario[]) => {
        this.usuarios = data;
        this.eventosFiltrados = data; // Inicializa os usuários filtrados
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        console.error('Erro ao obter usuários:', error);
      }
    );
  }

  private checkAuthentication(): void {
    const token = this.authService.getToken();

    if (token) {
      const isTokenValid = !this.authService.isTokenExpired(token);
      this.isLoggedIn = isTokenValid;

      if (!isTokenValid) {
        this.authService.logout();
      }
    } else {
      this.isLoggedIn = false;
    }
  }



  openModal(event: any, template: TemplateRef<any>, item: string): void {
    event.stopPropagation();
    this.usuarioId = item;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  decline(): void {
    this.modalRef?.hide();
  }
  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.userService.deleteUsuario(this.usuarioId).subscribe(
      (result: any) => {
        if (result.status === 200 || result.status === 204) {
          this.toastr.success(
            'O Usuario foi deletado com Sucesso.',
            'Deletado!'
          );
         this.getUsuarios();
        }
      },
      (error: any) => {
        console.error(error);
          this.toastr.error(
            `Erro ao tentar deletar o evento ${this.usuarioId}`,
            'Erro'
          );
      },
      () => this.spinner.hide(),
    );

  }

  detalheEvento(id: string): void {
    this.router.navigate([`user/detalhe/${id}`]);
  }
}
