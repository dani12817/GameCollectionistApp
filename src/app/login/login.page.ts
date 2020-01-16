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

  async doLoginEmailPass() {
    
    try {
      let response = await this.authService.loginEmailPass(this.loginForm.getValue())
      console.log("loginEmailPass", response);
      this.navCtrl.navigateRoot('/home');
    } catch (err) {
      console.error(err);
      (await this.toastCtrl.create({ message: 'Inicio de Sesión erróneo', duration: 3000 })).present();
    }
  }

  async doLoginSocialNetwork(loginType: string) {
    try {
      const googleUser = await this.google.login({
        'webClientId': '920776624598-oubrvckmfggf5fih9m3vev5vfe347bd6.apps.googleusercontent.com',
        'offline': true,
        'scoper': 'profile email'
      });
      const firebaseUser = await this.afAuth.auth.signInWithCredential(auth.GoogleAuthProvider.credential(googleUser.idToken));
      await this.authService.getLoggedInUser();
      if (!this.authService.userLogged) { this.authService.initializeUser(firebaseUser); }

      console.log("doLoginSocialNetwork", firebaseUser);
      (await this.toastCtrl.create({ message: 'Inicio de Sesión Correcto', duration: 3000 })).present();
      this.navCtrl.navigateRoot('/home');
    } catch (err) {
      console.error(err);
      (await this.toastCtrl.create({ message: 'Inicio de Sesión erróneo', duration: 3000 })).present();
    }
  }
}
