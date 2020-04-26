import { Component, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthService, LoadingService } from 'src/providers/providers';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy {
  appPages = [
    {title: 'Home', url: '/home', icon: 'home'},
    {title: 'Iniciar Sesión', url: 'login', icon: 'contact'},
  ];

  appPagesLogged = [
    {title: 'Home', url: '/home', icon: 'home'},
    {title: 'Datos de usuario', url: '/user-data', icon: 'person'},
    {title: 'Mi Perfil', url: '', icon: 'people'},
    {title: 'Mi librería', url: '/my-library', icon: 'albums'},
    {title: 'Pedir un juego', url: '/request-game', icon: 'logo-game-controller-b'},
    {title: 'Cerrar sesión', url: '/home', icon: 'exit'},
  ];

  sub;

  constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private afAuth: AngularFireAuth, public authService: AuthService,
  public loading: LoadingService) {
    this.initializeApp();
    this.sub = this.afAuth.authState.subscribe(response => {
      if (response) {
        this.authService.getLoggedInUser().then(response => {
          this.appPagesLogged[2].url = `/user/${response.nickname}/user-info-tab`;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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
    this.afAuth.auth.signOut();
    this.authService.userLogged = null;
  }
}
