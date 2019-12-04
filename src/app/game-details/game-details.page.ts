import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { Game } from '../../models/game';
import { UserService } from '../../providers/user.service';
import { AuthService } from '../../providers/auth.service';

import { GameMethods } from '../../shared/game-methods';

@Component({
  selector: 'app-game-details',
  templateUrl: 'game-details.page.html',
  styleUrls: ['game-details.page.scss'],
})
export class GameDetailsPage {
  gameData: Game; gameMeth = GameMethods;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private toastCtrl: ToastController, public authService: AuthService) {
    this.route.data.subscribe((routeData: {gameData: Game}) => {
      this.gameData = routeData.gameData;
      if (this.gameData === null || this.gameData === undefined) { this.router.navigate(['/home']); }
      console.log("this.gameData", this.gameData.name);
      this.userService.gameOnLibrary(this.gameData.game_code).then(response => {
        this.gameData.game_on_library = response;
      }).catch(err => console.error(err));
    });
  }

  addGameToLibrary() {
    this.userService.addGameToLibrary(this.gameData.game_code).then(async response => {
      (await this.toastCtrl.create({message: 'Juego añadido a tu biblioteca.', duration: 3000})).present();
      this.gameData.game_on_library = true;
    }).catch(err => console.error(err));
  }

  removeGameFromLibrary() {
    this.userService.removeGameFromLibrary(this.gameData.game_code).then(async response => {
      (await this.toastCtrl.create({message: 'Juego eliminado de tu biblioteca.', duration: 3000})).present();
      this.gameData.game_on_library = false;
    }).catch(err => console.error(err));
  }
}
