import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PersonUserService } from 'src/app/services/userperson.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pacienteuser',
  templateUrl: './pacienteuser.component.html',
  styleUrls: ['./pacienteuser.component.css']
})
export class PacienteuserComponent implements OnInit {

  @Output() cancelarModalPaciente = new EventEmitter<void>();
  @Output() cerrarModalPaciente = new EventEmitter<void>();
  public userPersonForm: any; // formulario de registro

  constructor(private fb : FormBuilder, private personUserService: PersonUserService){}
  
  ngOnInit(): void {

    this.userPersonForm = this.fb.group({
      name: ['', Validators.required ],
      last_name: ['', Validators.required ],
      //ci: ['', Validators.required ],
      ci: [''], // Sin Validators.required para permitir valores nulos
      celular: ['', Validators.required ],
      gender: ['', Validators.required ],
      email: ['', Validators.required ],

    });
    
  }

  guardarDatos() {

    //console.log("NUEVO PACIENTE:",this.userPersonForm.value);
    //this.cerrar();

    this.personUserService.userperson( this.userPersonForm.value)
    .subscribe( resp => {
      this.cerrar();
      // console.log('Person_usaurio creado')
      // console.log(resp);
      //Swal.fire('Creado', `creado correctamente`, 'success');
      //this.cerrar;
    }, (err) =>{
        //-- SI SUCEDE UN ERROR MStRARA EStE SWATT
        //console.log(err);
        //Swal.fire('Error', err.error.errors[0].msg, 'error');
        Swal.fire('Error', 'error');
    });
  }

  cerrar(){
    this.cerrarModalPaciente.emit();
  }
  cancelar(){
    this.cancelarModalPaciente.emit();
  }

}
