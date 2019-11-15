import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

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

  constructor(private authService: AuthService, private navCtrl: NavController, private afAuth: AngularFireAuth, private toastCtrl: ToastController,
  private google: GooglePlus) {
    this.loginForm = new FormClass(new FormGroup({
      'email': new FormControl({value: '', disabled: false}, [Validators.required]),
      'password': new FormControl({value: '', disabled: false}, [Validators.required]),
    }), this.validationMessages);
  }

  doLoginEmailPass() {
    this.authService.loginEmailPass(this.loginForm.getValue()).then(async response => {
      console.log("loginEmailPass", response);
      this.navCtrl.navigateRoot('/home');
      (await this.toastCtrl.create({ message: 'Inicio de Sesión Correcto', duration: 3000 })).present();
    }).catch(err => console.error(err));
  }

  async doLoginSocialNetwork(loginType: string) {
    try {
      const googleUser = await this.google.login({
        'webClientId': '47521015706-5p43d12qsncil5p0jt2gq29rs108v4hu.apps.googleusercontent.com',
        'offline': true,
        'scoper': 'profile email'
      });
      const firebaseUser = await this.afAuth.auth.signInWithCredential(auth.GoogleAuthProvider.credential(googleUser.idToken));

      console.log("doLoginSocialNetwork", firebaseUser);
      (await this.toastCtrl.create({ message: 'Inicio de Sesión Correcto', duration: 3000 })).present();
      this.navCtrl.navigateRoot('/home');
    } catch (err) {
      console.error(err);
      (await this.toastCtrl.create({ message: 'Inicio de Sesión erróneo', duration: 3000 })).present();
    }
  }
}
