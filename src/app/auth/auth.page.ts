import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AlertController, LoadingController } from '@ionic/angular';

import { Observable } from 'rxjs';

import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}


  authenticate (authform: NgForm) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Ingresando, aguarde unos instantes...' })
      .then(loadingEl => {
        loadingEl.present();

        let authObs: Observable<AuthResponseData>;

        //Chequea si el usuario se quiere loguear o si quiere crear una nueva cuenta y hace el llamado a la api según lo que necesita
        if (this.isLogin) {
          authObs = this.authService.login(authform.value.email, authform.value.password);
        } else {
          authObs = this.authService.signup(authform.value.email, authform.value.password);
        }
        authObs.subscribe(resData => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            authform.controls['email'].setValue('');
            authform.controls['password'].setValue('');
            this.router.navigateByUrl('/home');
          }, errorRes => {
            loadingEl.dismiss();
            const code = errorRes.error.error.message;
            let message = 'No pudiste acceder. Volvé a intentarlo.';
            //Chequea el error y sobre escribe el mensaje que se muestra al usuario
            if (code === 'EMAIL_EXISTS') {
              message = 'El correo electrónico ya existe.';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'No se encontró el correo electrónico como registrado.';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'La contraseña es incorrecta.';
            } else if (code === 'INVALID_LOGIN_CREDENTIALS') {
              message = 'E-mail o contraseña incorrectos. Por favor, vuelva a intentar.'
            }
            this.showAlert(message);
          });
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(authform: NgForm) {
    if (!authform.valid) {
      return;
    }

    this.authenticate(authform);
  }

  private showAlert (message: string) {
    this.alertCtrl
      .create({
        header: '¡Error en el inicio de sesión!',
        message: message,
        buttons: ['Ok']
      })
      .then(alertEl => alertEl.present());
  }

  onFastLogin (authform: NgForm, email: string, password: string) {
    authform.controls['email'].setValue(email);
    authform.controls['password'].setValue(password);
  }
}
