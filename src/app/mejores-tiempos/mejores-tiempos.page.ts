import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, query, where, orderBy, limit, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-mejores-tiempos',
  templateUrl: './mejores-tiempos.page.html',
  styleUrls: ['./mejores-tiempos.page.scss'],
})
export class MejoresTiemposPage implements OnInit {
  tiempos: any[] = [];
  nivel: string = ''

  constructor(
    private router: Router,
    private firestore: Firestore
  ) { }

  ngOnInit() {
    this.nivel = 'simple';
    this.seleccionarNivel(this.nivel);
  }

  seleccionarNivel (nivel: string) {
    this.nivel = nivel;
    this.obtenerMejoresTiempos(this.nivel);
  }

  volverAlHome() {
    this.router.navigate(['/home']); // Navega al home
  }

  async obtenerMejoresTiempos(nivel: string) {
    const col = collection(this.firestore, 'mejoresMemoTest');
    
    // Filtrar por nivel, ordenar por tiempo ascendente y luego por fecha (día y hora)
    const filteredQuery = query(
      col,
      where('nivel', '==', nivel),
      orderBy('tiempo', 'asc'),   // Ordenar por el tiempo más bajo
      orderBy('fecha', 'asc'),      // Ordenar por el día
      limit(5)                    // Limitar a 5 resultados
    );
  
    try {
      const querySnapshot = await getDocs(filteredQuery);
      this.tiempos = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          fecha: data['fecha'].toDate() // Convierte el Timestamp a Date
        };
      });
      console.log(this.tiempos);  // Verifica los resultados
    } catch (error) {
      console.error('Error al obtener los tiempos: ', error);
    }
  }

  convertirTiempo(segundosAConvertir: number) {
    // Calculo los minutos
    const minutos = Math.floor(segundosAConvertir / 60);
    // Saco los segundos restantes
    const segundos = segundosAConvertir % 60;

    // Formateo segundos menores que 10
    const segundosFormateados = segundos < 10 ? `0${segundos}` : segundos;
    return `${minutos}:${segundosFormateados}`;
  }

}






