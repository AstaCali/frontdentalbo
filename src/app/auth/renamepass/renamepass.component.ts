import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-renamepass',
  templateUrl: './renamepass.component.html',
  styleUrls: ['./renamepass.component.css']
})
export class RenamepassComponent  implements OnInit{

  @Output() cerrar = new EventEmitter<void>();

  @Input() iduser: number = 0;

  public renewPassworForm = this.fb.group({

    // email     :['alex@gmail.com', [Validators.required, Validators.email]],
    currentPassword  :['', Validators.required],//password
    newPassword  :['', Validators.required],//newPassword
    confirmPassword  :['', Validators.required],//confirmPassword
  });

  constructor(private router : Router,
              private fb : FormBuilder,
              private usuarioService : UsuarioService
  ){}

  ngOnInit(): void {

    console.log('Valor de ID_USER_LOGEAR en ProformaDentalComponent:', this.iduser);
    
  }

  guardarNewPass(){
    //console.log('LOQUE ENVIA_PASS', this.renewPassworForm.value);

    let { currentPassword, newPassword, confirmPassword } = this.renewPassworForm.value;

    // Asegurarse de que los valores sean siempre cadenas de texto
    currentPassword = currentPassword || '';
    newPassword = newPassword || '';
    confirmPassword = confirmPassword || '';
  
    if (newPassword !== confirmPassword) {
      alert("La nueva contraseña y la confirmación no coinciden");
      return;
    }
  
    const userId = Number(this.iduser); // Asegúrate de que sea un número
  
    this.usuarioService.cambiarPasswor(userId, { currentPassword, newPassword, confirmPassword }).subscribe(
      response => {
        console.log(response);
        this.cerrard();
        // this.router.navigateByUrl('/some-path'); // Redirigir a una página específica si es necesario
      },
      error => {
        alert(error.error.message);
      }
    );
  }

  cerrard() {
    this.cerrar.emit(); // Emite el evento al hacer clic en "Cancelar"
  }

}
