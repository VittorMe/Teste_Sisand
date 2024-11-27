import { Component, OnInit } from '@angular/core';
import { ValidatorField } from '../../../helpers/ValidatorField';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
import { Usuario } from '@app/Models/Usuarios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {


  form!: FormGroup;
  usuario: Usuario = {} as Usuario;

  get f():any{
    return this.form.controls;
  }

  
  constructor(
    private fb:FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.validation();
  }


  public validation():void{

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmeSenha')
    };

    this.form = this.fb.group({
      nome:['',[Validators.required,Validators.minLength(4), Validators.maxLength(20) ]],
      sobrenome:['',[Validators.required,Validators.minLength(4), Validators.maxLength(20) ]],
      email: ['', [Validators.required, Validators.email]],
      userName:['',[Validators.required,Validators.minLength(4), Validators.maxLength(30)]],
      password:['',[Validators.required, Validators.minLength(6)]],
      confirmeSenha:['',[Validators.required]]
      
    },formOptions);
  }
  public salvarUsuario(): void {

    if (this.form.valid){
      this.spinner.show();


      
      this.authService.register(
        this.form.value.userName,
        this.form.value.nome,
        this.form.value.sobrenome,
        this.form.value.email,
        this.form.value.password).subscribe(
        (reponse : Usuario)=>{
          this.toastr.success('Usuaario salvo com Sucesso!', 'Sucesso');
        },
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Error ao salvar Usuario', 'Erro');
        },
        () => this.spinner.hide()
      ).add(() => { this.spinner.hide() });
    }
  }
}
