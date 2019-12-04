import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  appPages = [
    {title: 'Home', url: '/home', icon: 'home'},
    {title: 'Iniciar Sesión', url: 'login', icon: 'contact'},
  ];

  appPagesLogged = [
    {title: 'Home', url: '/home', icon: 'home'},
    {title: 'Mi librería', url: '/my-library', icon: 'albums'},
    {title: 'Pedir un juego', url: '/request-game', icon: 'logo-game-controller-b'},
    {title: 'Cerrar sesión', url: '/home', icon: 'exit'},
  ];

  constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private afAuth: AngularFireAuth, public authService: AuthService) {
    this.initializeApp();
    this.authService.getLoggedInUser();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();
    });
  }

  getAppPages() {
    return this.afAuth.auth.currentUser !== null ? this.appPagesLogged : this.appPages;
  }

  logOff() {
    console.log("logOff");
    this.authService.userLogged = null;
    this.afAuth.auth.signOut();
  }
}
