import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

const base_url = environment.serverBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class WhatsappQrService {

  constructor( private http : HttpClient) { }

  cargarQr() {

    const url = `${ base_url }/iniciarwhatsapp/getqr`;
    return this.http.get<any>( url)
              .pipe(
                // map((resp: any) => resp.users as Usuario[])
                map((resp: any) => resp)
              );
  }

}