import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  // public menu = [];

  public menu: any = [];

  cargarMenu() {
    const menuString = localStorage.getItem('menu');
    this.menu = menuString ? JSON.parse(menuString) : [];
  }
}
