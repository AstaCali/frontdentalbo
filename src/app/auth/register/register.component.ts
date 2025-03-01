import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerUserForm = this.fb.group({

    email     :['', [Validators.required, Validators.email]],
    password  :['', Validators.required],
    password2 :['', Validators.required],
    name      :['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
    last_name :['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
    ci        :['', [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern('[0-9]*')]],
    celular   :['', [Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern('[0-9]*')]],
    gender    :['', Validators.required],
    role_id   :[3, Validators.required],
  },{
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor( private fb : FormBuilder,
                private usuarioService: UsuarioService,
                private router : Router){}
  crearUsuario(){
    this.formSubmitted = true;
    //console.log( 'LLEGA-LIST',this.registerUserForm.value );

    if( this.registerUserForm.invalid ){
      return;
    }
    // ahora si el formulario es valido crear usuario
    this.usuarioService.crearUsuario( this.registerUserForm.value)
        .subscribe( resp => {
          // console.log('usaurio creado')
          // console.log(resp);
          //--naver o direccionar al dasboard
          this.router.navigateByUrl('/');
        }, (err) =>{
            //-- SI SUCEDE UN ERROR MStRARA EStE SWATT
            Swal.fire('Error', err.error.errors[0].msg, 'error');
        });
        //}, (err) => console.warn(err.error.errors[0].msg));
  }

  campoNoValido( campo: string): boolean {

    if( this.registerUserForm.get(campo)?.invalid && this.formSubmitted){
      return true;
    } else {
      return false;
    }
  }

  contrasenasNoValido(){
    const pass1 = this.registerUserForm.get('password')?.value;
    const pass2 = this.registerUserForm.get('password2')?.value;

    if( (pass1 !== pass2) && this.formSubmitted ){
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales( pass1Name: string, pass2Name: string ){

    return( formGroup:FormGroup ) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if ( pass1Control?.value === pass2Control?.value){
        pass2Control?.setErrors(null);
      } else {
        pass2Control?.setErrors({noEsIgual: true});
      }
    }
  }

}
