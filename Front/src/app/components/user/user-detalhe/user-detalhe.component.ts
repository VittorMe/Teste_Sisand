import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '@app/Models/Usuarios';
import { UserService } from '@app/services/user.service';
import { add } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-detalhe',
  templateUrl: './user-detalhe.component.html',  // Caminho do arquivo HTML
  styleUrls: ['./user-detalhe.component.scss']  // Caminho do arquivo CSS
})
export class UserDetalheComponent implements OnInit {
  
  
  showPassword: boolean = false;
  form!:FormGroup
  usuarioId !: any;
  usuario: Usuario = {} as Usuario;
  estadoSalvar = 'post';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private localeService: BsLocaleService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
  ) {
    this.localeService.use('pt-br');
  }

  get passwordErrors(): { [key: string]: boolean } {
    const value = this.f.password.value || '';
    return {
      hasUppercase: /[A-Z]/.test(value),
      hasLowercase: /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecialChar: /[@$!%*?&#]/.test(value),
    };
  }
 

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get f(): any {
    return this.form.controls;
  }
  public carregarEvento(): void {
    this.usuarioId = this.activatedRouter.snapshot.paramMap.get('id');
    if(this.usuarioId != null || this.usuarioId!= ''){
      this.spinner.show();
      this.estadoSalvar = 'put';
      this.userService.getUsuarioById(this.usuarioId).subscribe(

        (usuario: Usuario) => {
          this.usuario = {...usuario}
          this.form.patchValue(this.usuario);
        },
        (error: any) => {
          this, this.toastr.error('Erro ao tentar carregar Usuarios.', 'Erro!');
          console.error(error);
        }
      ).add(() => { this.spinner.hide() });
    }
  }


  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }
  public cssValidator(fieldForm: FormControl | AbstractControl | null): any {

    return { 'is-invalid': fieldForm?.errors && fieldForm?.touched };

  }

  public validation():void{
    this.form = this.fb.group({
      nome:['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      sobrenome:['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      endereco:['', Validators.required],
      dataNascimento:[''],
      userName:['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      telefone:[''],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '', 
        [
          Validators.required, 
          Validators.minLength(8), 
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#]).+$/)
        ]
      ]
    })
  }

  public salvarUsuario(): void {
    
    if (this.form.valid){
      this.spinner.show();
      const verbHttp = this.estadoSalvar === 'post' ? 'post' : 'put'
      this.usuario=
      this.estadoSalvar === 'post'
          ? { ...this.form.value }
          : { id: this.usuario.id, ...this.form.value };

          this.userService[verbHttp](this.usuario).subscribe(
            (reponse : Usuario)=>{
              this.toastr.success('Usuario salvo com Sucesso!', 'Sucesso');
              this.router.navigate([`user/detalhe/${reponse.id}`]);
            },
            (error: any) => {
              console.error(error);
              this.spinner.hide();
              this.toastr.error('Error ao salvar evento', 'Erro');
            },
            () => this.spinner.hide()
          ).add(() => { this.spinner.hide() });
        }
        
  }

  public resetForm(): void {
    this.form.reset();
  }
  voltarParaListagem() {
    this.router.navigate(['/user/listar']);  // Substitua '/listagem' pela rota da tela de listagem
  }
}
