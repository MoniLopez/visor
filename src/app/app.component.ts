import { Component, ViewEncapsulation, OnInit, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServiceDatosService } from './service/service-datos.service';
import { DatosTabla } from './datos-tabla';
import path from 'path';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatPaginatorModule, MatTableModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css', 
  encapsulation: ViewEncapsulation.None  // Esto hace que el CSS no esté encapsulado
})
export class AppComponent {
  title = 'visor';

  tablaIns: DatosTabla[]=[]; //Guarda los datos de inscripciones del txt en una interfaz
  tablaApen: DatosTabla[]=[]; //Guarda los datos de apendices del txt en una interfaz

  // Variable para almacenar las filas visibles según la página
  tablaInsPaginada: DatosTabla[] = [];
  tablaApenPaginada: DatosTabla[] = [];

  loading: boolean = false; // Nueva variable para el estado de carga

  constructor(private datosService: ServiceDatosService){}

  ngOnInit(){
    console.log("Antes de jalar archivo:"+this.loading);
    this.datosService.getTextFileInscripcion().subscribe(data => {
      this.datosService.getTextFileApendice().subscribe(dataApendice =>{
        this.procesarDatos(data, dataApendice);
        this.tablaInsPaginada = this.tablaIns.slice(0, 10); // Mostrar las primeras 10 filas al cargar
        this.tablaApenPaginada = this.tablaApen.slice(0, 10); // Mostrar las primeras 10 filas al cargar
        this.loading = true; //Los datos ya se cargaron
        console.log("Después de jalar archivo:"+this.loading);
      });
    });

  }

  procesarDatos(textoIns: string, textoApen: string){
    this.tablaIns = this.mapeaDatos(textoIns);
    this.tablaApen = this.mapeaDatos(textoApen);
  }

  mapeaDatos(texto: string): DatosTabla[]{
    return texto.split('\n').map(fila => {
      const rutaOriginal = fila.trim();
      const rutaModificada = rutaOriginal.replace(/\\/g, '/');
      return{
        ruta:rutaModificada,
        nombre: rutaModificada.split('/').pop() || rutaModificada
      };
    });
  }

  abrirDoc(urlDoc: string){
    const url = `${urlDoc}`;
    window.open(url, '_blank');
  }

  // Método para manejar la paginación
  paginacionIns(event: PageEvent) {
    const inicio = event.pageIndex * event.pageSize;
    const fin = inicio + event.pageSize;
    this.tablaInsPaginada = this.tablaIns.slice(inicio, fin);
  }

  // Método para manejar la paginación
  paginacionApen(event: PageEvent) {
    const inicio = event.pageIndex * event.pageSize;
    const fin = inicio + event.pageSize;
    this.tablaApenPaginada = this.tablaApen.slice(inicio, fin);
  }

}
