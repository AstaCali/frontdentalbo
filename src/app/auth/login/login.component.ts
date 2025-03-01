import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public abrilModal: boolean = false;   //--PARA MODAL

  public iduser: number = 0; // enviar el id al logear

  public formSubmitted = false;

  public loginForm = this.fb.group({

    email     :['', [Validators.required, Validators.email]],
    password  :['', Validators.required],
    remember  :[false],
  });


  constructor( private router : Router,
               private fb : FormBuilder,
               private usuarioService : UsuarioService){}

  // ngOnInit(): void {
    
  // }

  login(){

    this.usuarioService.login( this.loginForm.value)
    //this.usuarioService.login( this.loginForm.value)
      .subscribe( resp => {

        //console.log('LOGIN RSP',resp)
        // if( this.loginForm.get('remember')?.value){
        //   localStorage.setItem('email', this.loginForm.get('email')?.value );
        // } else {
        //   localStorage.removeItem('email');
        // }
        const tipoRegister = resp.userLogin.tiporegister
        //if (userRole === 'ADMINISTRADOR' || userRole === 'SECRETARIA') {
        if( tipoRegister === 'SINCHAT' || tipoRegister === 'CHATCAM'){
          //console.log('Tipo_Registe: ', tipoRegister);
          this.router.navigateByUrl('/');
        } else{
          //console.log('REGISTER_EN_CHAT');
          this.abrilModal = true; 
          this.iduser = resp.userLogin.id;
        }
        //this.router.navigateByUrl('/');
        //this.router.navigateByUrl('/dashboard/programar_cita');
      }, (err) =>{
        Swal.fire('Error', err.error.msg, 'error');
      });
  }

  cerrar() {
    this.abrilModal = false; // Cierra el formulario sin guardar
    //this.cargarProformaPersonas(this.personaID);
    this.iduser = 0;
  }

}
