import { Component, ElementRef, ViewChild } from '@angular/core';
//import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioService } from '../../services/usuario.service'
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { BuscadorService } from 'src/app/services/buscador.service';
import { Persona } from 'src/app/models/persona.modelo';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  //styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @ViewChild('exampleDataListInput') exampleDataListInput!: ElementRef;
  //-------------
  selectedPersona: any;
  keyword = 'name';
  
  public personas: Persona[] = [];

  //post : any;

  personasFiltradas: Persona[] = []; // Lista de personas filtradas

  nombreSeleccionado: string = '';
  //------------

  public usuario : Usuario;

  constructor( private usuarioService : UsuarioService,
               private router : Router,
               private buscadorService: BuscadorService ){

    this.usuario = usuarioService.usuario;
    //console.log('SE MUES◘4RA EN EL HEADER AL ALDO DEL BUSCADOR',this.usuario);
    this.cargarPersona();
  }
  filtrarNombres(termino: string): void {
    this.personasFiltradas = this.personas.filter(persona =>
      persona.name.toLowerCase().includes(termino.toLowerCase()) ||
      persona.last_name.toLowerCase().includes(termino.toLowerCase())
    );
  }
  seleccionarPersona(persona: Persona): void {
    // Aquí puedes manejar la lógica para hacer algo con la persona seleccionada
    //console.log('Persona seleccionada:', persona);
    
    // Por ejemplo, puedes guardarla en una variable, mostrar sus detalles en otro componente, etc.
  }
  logout(){
    this.usuarioService.logout();
  }

  //---BUSCADOR GENERAL DE PACIENTE--
  // buscar ( termino : string) {
  //   console.log(termino);

  //   if ( termino.length === 0) {
  //     return
  //   }

  //   //this.router.navigateByUrl(`/dashboard/proforma/${ termino }`);

  // }
  cargarPersona(): void {
    //this.cargando = true;
    this.buscadorService.cargarPersona()
      .subscribe( data => {
       this.personas = data;
        //console.log('LLEGA Persona##2',this.personas);
        //this.usuariosTemp = usuarios;
        //this.cargando = false;
    })
  }

  onInput(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const inputText = inputElement.value;
  
    this.selectedPersona = this.personas.find(persona => 
      (persona.name + ' ' + persona.last_name) === inputText
    );
  
    //console.log("SELECCIONADO:", this.selectedPersona);
  
    if (!this.selectedPersona || !this.selectedPersona.id) {
      //console.log("No hay ID o no se ha seleccionado ninguna opción");
      return;
    }
  
    //console.log("ID seleccionado:", this.selectedPersona.id);
  
    // Limpiar el campo de entrada después de seleccionar
    setTimeout(() => {
      inputElement.value = '';  // Borra el valor del input
    }, 100); // Pequeño delay para que la navegación no se interrumpa
  
    this.router.navigateByUrl(`/dashboard/proforma/${ this.selectedPersona.id }`);
  }

}
