import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { FormClass } from '../../shared/form-class';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  loginForm: FormClass;
  

  validationMessages = {
    email: { required: 'El nombre es obligatorio.' },
    password: { required: 'La contraseña es obligatoria.' },
  };

  constructor(private authService: AuthService, private navCtrl: NavController, private afAuth: AngularFireAuth, private toastCtrl: ToastController) {
    this.loginForm = new FormClass(new FormGroup({
      'email': new FormControl({value: '', disabled: false}, [Validators.required]),
      'password': new FormControl({value: '', disabled: false}, [Validators.required]),
    }), this.validationMessages);

    this.afAuth.auth.getRedirectResult().then(async authData => {
      console.log("authData", authData);
      if (authData.user) {
        this.navCtrl.navigateRoot('/home');
        (await this.toastCtrl.create({ message: 'Inicio de Sesión Correcto', duration: 3000 })).present();
      }
    }).catch(error => console.log(error));
  }

  doLoginEmailPass() {
    this.authService.loginEmailPass(this.loginForm.getValue()).then(async response => {
      console.log("loginEmailPass", response);
      this.navCtrl.navigateRoot('/home');
      (await this.toastCtrl.create({ message: 'Inicio de Sesión Correcto', duration: 3000 })).present();
    }).catch(err => console.error(err));
  }

  dologinSocialNetwork(loginType: string) {
    let provider;
    switch (loginType) {
      case 'google':
        provider = new auth.GoogleAuthProvider();
        break;
    }
    this.authService.loginSocialNetwork(provider);
  }
}
