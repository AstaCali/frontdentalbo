import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/models/roles.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  //public usurioForm : FormGroup;// asi es correcto. 
  public usurioForm : any; // obcional
  public role : Role[] = [];
  //public usuarioSeleccionado: Usuario;
  public usuarioSeleccionado: any;
  public titulo : string = '';

  constructor( private fb : FormBuilder,
               private usarioService : UsuarioService,
               private router: Router,
               private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {

    //---Para obtener losa datos para editar--
    this.activatedRoute.params
    .subscribe( ({id}) => this.cargarUsuario( id ) ); 

    //----DATOS APRA REGISTRAR USUARIO--
    this.usurioForm = this.fb.group({
      email     :['', [Validators.required, Validators.email]],
      //password  :['', Validators.required],
      password  :[''],
      //password2 :['alex123', Validators.required],
      name      :['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      last_name :['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      ci        :['', [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern('[0-9]*')]],
      celular   :['', [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern('[0-9]*')]],
      gender    :['', Validators.required],
      role_id   :['', Validators.required],
    });

    this.listarRoless();
    
  }
  //----LISTAR POR ID USUARIO---
 // cargarUsuario( id : number, _id: string){
  cargarUsuario(id: number | string){
    //console.log('ANTES_DEL_NUEVO',id);
    if ( id === 'nuevo' ) {
      this.titulo = 'Registra Usuario'
      //console.log('DESPUES_DEL_NUEVO_ENTRA');
      return;
    }
    //console.log('ENTRA PARA EDITAR_RECUPERAR DATOS');
    this.titulo = 'Actualizar Usuario'
    this.usarioService.obtenerUsuario(Number (id) )
      .subscribe( datouser => {
        //console.log('DATO DESPUES DEL IF', datouser);

        // console.log('DATO RECUPERADO', datouser);
        const { email, password,role: {id}} = datouser;
        //console.log('DATO ESPECIFICO', email, password,id);
        this.usuarioSeleccionado = datouser;
        this.usurioForm.patchValue({ 
        //this.usurioForm.setValue({ 
          email, 
          //password, 
          name: datouser.person.name,
          last_name: datouser.person.last_name,
          ci: datouser.person.ci,
          celular: datouser.person.celular,
          gender :  datouser.person.gender,
          role_id : id
          //person: name,role: id 
        });
        //this.usurioForm.setValue({ email, person: name, role: id });
      },
      error=>{
        //console.log(error);
        this.router.navigateByUrl(`/dashboard/usuario`);
        Swal.fire('Usuario no actualizado',error.error.msg)
      }
      );

  }
  //----LISTAR ROLES
  listarRoless() {
    //this.cargando = true;
    this.usarioService.cargarRoles()
      .subscribe( (roles : Role[]) => {
        //console.log('LLEGA ROLES', roles);
        this.role = roles;
        // this.cargando = false;
      });
  }

  //-----REGISTRAR USUARIO--
  guardarUsuario(){
    const { name } = this.usurioForm.value;

    if ( this.usuarioSeleccionado){
      //--acTualizar
      const data = {
        ...this.usurioForm.value,
        id: this.usuarioSeleccionado.id
      }
      this.usarioService.actualizarUsuario( data )
        .subscribe( resp =>{
          //console.log('SE ACTUALIZO',resp)
          Swal.fire('Actualizando',`${ name } actualizado correctamente`, 'success' );
          this.router.navigateByUrl(`/dashboard/usuario`)
        })
    } else{
      //--crear
      this.usarioService.crearUsuario( this.usurioForm.value )
        .subscribe( resp => {
          Swal.fire('Creado', `${ name } creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/usuario/${ resp.user.id }`)
      })
    }

    //console.log('USUARIO ENVIADO', this.usurioForm.value);
  }
  //----CANCELAR PARA SALIR DEL FORMULARIO
  cancelar(){
    this.router.navigateByUrl(`/dashboard/usuario`);
  }

}
