import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Persona } from 'src/app/models/persona.modelo';
import { Role } from 'src/app/models/roles.model';
import { Tratamiento } from 'src/app/models/tratamientos.modelo';
import { OdontologoService } from 'src/app/services/odontologo.service';
import { TratamientosService } from 'src/app/services/tratamientos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-odontologo',
  templateUrl: './odontologo.component.html',
  styleUrls: ['./odontologo.component.css']
})
export class OdontologoComponent implements OnInit {

  // tratamientos : Tratamiento[] =[];//----LISTAR TRATAMIENTOS.
  // personas : Persona[] =[];//----LISTAR Persona.
  roles : Role[] = [];

  public dentistaForm : any; // para registrar
  public titulo : string = '';
  public rol_definido : number = 3;

  public dentistaSeleccionado: any; // se carga este Vlor lo recuperado apra cargar al formulario y editar
 //public dentistaSeleccionado : any;

  //tratamientox: any[] = [];

  constructor( private fb : FormBuilder, 
              //private tratamientosService : TratamientosService,
              private odontologoService : OdontologoService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private usuarioService: UsuarioService, // para cargar roles
  ){}

  ngOnInit(): void {

    // this.cargarTratamiento();
    // this.cargarPersonas();
    this.cargarRoles();

    //---Para obtener losa datos para editar--
    this.activatedRoute.params
    .subscribe( ({id}) => this.cargarDentista( id ) ); 

    //---datos para regisTrar--
    this.dentistaForm = this.fb.group({
      email     :['', [Validators.required, Validators.email]],
      // password  :['', Validators.required],
      password  :[''],
      name      :['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      last_name :['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      ci        :['', [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern('[0-9]*')]],
      celular   :['', [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern('[0-9]*')]],
      gender    :['', Validators.required],
      role_id   :[this.rol_definido, Validators.required],
      //role_id   :[{ value: 3, disabled: true }, Validators.required],
      // person_id: ['', Validators.required],
      // detalles: this.fb.array([])
    });
    
  }

  guardarDentista(){

    if ( this.dentistaSeleccionado){
      //console.log('CARGA QUE SE USARA PARA REGIS◘4RAR EL EDITADO', this.dentistaSeleccionado);
      //--acTualizar
      const data = {
        ...this.dentistaForm.value,
        id: this.dentistaSeleccionado.dentista.id
      }
      //console.log('LO QUE SE ENVIARA PARA_DATA',data)
      const { name } = this.dentistaForm.value;
      this.odontologoService.actualizarDentis( data )
        .subscribe( resp =>{
          // console.log('SE ACTUALIZO',resp)
          Swal.fire('Actualizando',`${ name } actualizado correctamente`, 'success' );
          this.router.navigateByUrl(`/dashboard/odontologos`)
        })

    } else{
      //--crear
        //console.log('ENVIANDO DATOS!!',this.dentistaForm.value);
        const { name } = this.dentistaForm.value;
        //--crear- DenTista con sus roles de tratamiento
        this.odontologoService.crearDentista( this.dentistaForm.value )
        .subscribe( resp => {
          //console.log('RESP:', resp);
          Swal.fire('Creado', `${ name } creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/odontologos`)
        })
    }
  }
  //---------------------------
  cargarRoles() {
    //this.cargando = true;
    this.usuarioService.cargarRoles()
      .subscribe( data => {
        this.roles = data;
        console.log('LLEGA ROLE#',this.roles);
        //this.onSubmit();
        this.dentistaForm.patchValue({
          role_id: 3,
          
        });
    })
  }

  cargarDentista(id: number | string){
    //console.log('el idodontologo',id);
    if ( id === 'nuevo' ) {
      this.titulo = 'Registro Dentista'
      console.log('DESPUES_DEL_NUEVO_ENTRA_PARA_REGISTRO_NUEVO');
      return;
    }
    //console.log('ENTRA PARA EDITAR_RECUPERAR DATOS');
    this.titulo = 'Actualizar Dentista'
    this.odontologoService.obtenerDentista(Number (id) )
      .subscribe( dato => {
        //console.log('DATO DESPUES DEL IF', dato);
        this.dentistaSeleccionado = dato;
        this.dentistaForm.patchValue({ 
        //this.usurioForm.setValue({ 
          //email, 
          //password, 
          name: dato.person.name,
          last_name: dato.person.last_name,
          ci: dato.person.ci,
          celular: dato.person.celular,
          gender :  dato.person.gender,
          email : dato.users.email,
          //role_id : dato.users.role.id
          //person: name,role: id 
        });
        //this.usurioForm.setValue({ email, person: name, role: id });
      },
      error=>{
        //console.log(error);
        this.router.navigateByUrl(`/dashboard/odontologos`);
        //Swal.fire('Usuario no actualizado',error.error.msg)
      }
      );
  }
  //----CANCELAR PARA SALIR DEL FORMULARIO
  cancelar(){
    this.router.navigateByUrl(`dashboard/odontologos`);
  }
}