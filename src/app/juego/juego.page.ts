import { AlertController } from '@ionic/angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import {
  Firestore,
  addDoc,
  collection
} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.page.html',
  styleUrls: ['./juego.page.scss'],
})
export class JuegoPage implements OnInit, OnDestroy {
  nivel: string = '';
  fichasEmparejadas: number = 0;
  fichasPorNivel: number = 0;
  fichas: any[] = [];
  tiempo: number = 0;
  tiempoAMostrar: string = '';
  interval: any;
  reverso: string = '../../assets/images/ficha-reverso.png'; // Imagen común de reverso para todas las fichas
  fichasVolteadas: any[] = []; // Para guardar las fichas volteadas temporalmente
  bloqueo: boolean = false; // Para evitar que voltee más de 2 fichas a la vez
  sub?: Subscription;
  usuario: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private firestore: Firestore,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.nivel = this.route.snapshot.paramMap.get('nivel') || '';
    this.iniciarJuego(); // Puedes cambiar el nivel de dificultad aquí
    this.iniciarTiempo();
    this.sub = this.authService.userEmail.subscribe((respuesta: any) => {
      this.usuario = respuesta;
    });
  }

  iniciarJuego() {
    this.fichas = this.generarFichas();
    if (this.nivel == 'simple') {
      this.fichasPorNivel = 6;
    } else if (this.nivel == 'intermedio') {
      this.fichasPorNivel = 10;
    } else if (this.nivel == 'complicado') {
      this.fichasPorNivel = 16;
    }
  }

  generarFichas() {
    const fichasFrente = this.obtenerImagenesFrente();
    if (fichasFrente) {
      const fichas = [...fichasFrente, ...fichasFrente] // Duplica para crear pares
        .map((ficha) => ({
          frente: ficha,
          volteada: false, // Todas las fichas inician boca abajo
        }))
        .sort(() => Math.random() - 0.5); // Mezcla aleatoriamente las fichas

      return fichas;
    }
    return [];
  }

  obtenerImagenesFrente() {
    let imagenes;

    switch (this.nivel) {
      case 'simple':
        imagenes = [
          '../../assets/images/ficha-simple-leon.jpg',
          '../../assets/images/ficha-simple-panda.jpg',
          '../../assets/images/ficha-simple-perezoso.jpg',
        ];
        break;
      case 'intermedio':
        imagenes = [
          '../../assets/images/ficha-intermedio-cinta.png',
          '../../assets/images/ficha-intermedio-destornillador.png',
          '../../assets/images/ficha-intermedio-llave.png',
          '../../assets/images/ficha-intermedio-martillo.png',
          '../../assets/images/ficha-intermedio-serrucho.png',
        ];
        break;
      case 'complicado':
        imagenes = [
          '../../assets/images/ficha-complicado-arandano.png',
          '../../assets/images/ficha-complicado-cebolla.png',
          '../../assets/images/ficha-complicado-kinoto.png',
          '../../assets/images/ficha-complicado-limon.png',
          '../../assets/images/ficha-complicado-naranja.png',
          '../../assets/images/ficha-complicado-pera.png',
          '../../assets/images/ficha-complicado-sandia.png',
          '../../assets/images/ficha-complicado-uva.png',
        ];
        break;
    }

    return imagenes;
  }

  voltearFicha(ficha: any) {
    // No permitir más acciones si el juego está bloqueado o la ficha ya está volteada
    if (this.bloqueo || ficha.volteada) return;

    ficha.volteada = true;
    this.fichasVolteadas.push(ficha);

    if (this.fichasVolteadas.length === 2) {
      this.bloqueo = true; // Bloquea más acciones hasta resolver el par
      setTimeout(() => {
        this.verificarPares();
      }, 600);
    }
  }

  verificarPares() {
    const [ficha1, ficha2] = this.fichasVolteadas;

    if (ficha1.frente === ficha2.frente) {
      // Si son iguales, dejarlas volteadas y limpiar el array
      this.fichasVolteadas.forEach((f) => (f.coincidencia = true));
      setTimeout(() => {
        this.fichasVolteadas.forEach((f) => (f.coincidencia = false));
        this.fichasVolteadas = [];
      }, 500); // Mantiene la animación por 0.5 segundos

      this.bloqueo = false; // Permite seguir jugando
      this.fichasEmparejadas += 2;
      if (this.fichasEmparejadas === this.fichasPorNivel) {
        this.terminarJuego();
      }
    } else {
      // Si no son iguales, volver a voltearlas después de un tiempo
      setTimeout(() => {
        ficha1.volteada = false;
        ficha2.volteada = false;
        this.fichasVolteadas = [];
        this.bloqueo = false; // Permite seguir jugando
      }, 1000); // Retraso de 1 segundo para que el jugador vea las fichas
    }
  }

  iniciarTiempo() {
    this.interval = setInterval(() => {
      this.tiempoAMostrar = this.convertirTiempo(this.tiempo++);
    }, 1000); // Aumenta el temporizador cada segundo
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

  detenerTiempo() {
    if (this.interval) {
      clearInterval(this.interval); // Detiene el intervalo
      this.interval = null; // Limpia la referencia del intervalo
    }
  }
  
  terminarJuego() {
    this.detenerTiempo();
    this.registrarTiempo();
    this.mostrarAlerta();
  }
  
  registrarTiempo() {
    let col = collection(this.firestore, 'mejoresMemoTest');
    addDoc(col, {
      usuario: this.usuario,
      tiempo: this.tiempo,
      fecha: new Date(),
      nivel: this.nivel
    });
  }

  async mostrarAlerta() {
    const alert = await this.alertController.create({
      header: '¡Buen trabajo!',
      subHeader: 'Has ganado el juego',
      message: 'Encontraste todos los pares en ' + this.convertirTiempo(this.tiempo) + ' minutos.',
      buttons: ['OK'],
      cssClass: 'alerta-personalizada'
    });
  
    await alert.present();
  }

  volverAlHome() {
    clearInterval(this.interval); // Detiene el temporizador
    this.router.navigate(['/home']); // Navega al home
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
