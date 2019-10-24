import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';

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
    {title: 'Añadir Juego', url: '/add-game', icon: 'logo-chrome'},
    {title: 'Cerrar Sesión', url: '/home', icon: 'exit'},
  ];

  constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private afAuth: AngularFireAuth) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  getAppPages() {
    return this.afAuth.auth.currentUser !== null ? this.appPagesLogged : this.appPages;
  }

  logOff() {
    console.log("logOff");
    this.afAuth.auth.signOut();
  }
}
