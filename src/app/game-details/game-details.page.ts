import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular';

import { UserGameDetailsPage } from 'src/shared/modals/user-game-details/user-game-details';

import { Game } from '../../models/game';
import { UserService } from '../../providers/user.service';
import { AuthService } from '../../providers/auth.service';

import { GameMethods } from '../../shared/game-methods';
import { userLibraries, currencies } from '../../shared/constant';

@Component({
  selector: 'app-game-details',
  templateUrl: 'game-details.page.html',
  styleUrls: ['game-details.page.scss'],
})
export class GameDetailsPage {
  gameData: Game;
  gameMeth = GameMethods; userLibraries = userLibraries; currencies = currencies;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private toastCtrl: ToastController, public authService: AuthService,
  private modal: ModalController) {
    this.route.data.subscribe((routeData: {gameData: Game}) => {
      this.gameData = routeData.gameData;
      if (this.gameData === null || this.gameData === undefined) { this.router.navigate(['/home']); }
      console.log("gameData", this.gameData.name);
      this.getGameOnLibrary();
    });
  }

  private getGameOnLibrary() {
    this.userService.gameOnLibrary(this.gameData.game_code).then(response => {
      this.gameData.userGame = response;
      if (!this.gameData.userGame) { this.gameData.userGame = {type: null} }
    }).catch(err => console.error(err));
  }

  addGameToLibrary(type: string) {
    console.log("type", type);
    this.userService.addGameToLibrary(this.gameData.game_code, type).then(async response => {
      (await this.toastCtrl.create({message: `Juego añadido a tu biblioteca '${userLibraries[type]}'.`, duration: 3000})).present();
      this.gameData.userGame.type = type;
      this.getGameOnLibrary();
    }).catch(err => console.error(err));
  }

  removeGameFromLibrary() {
    this.userService.removeGameFromLibrary(this.gameData.game_code).then(async response => {
      (await this.toastCtrl.create({message: 'Juego eliminado de tu biblioteca.', duration: 3000})).present();
      this.gameData.userGame.type = null;
    }).catch(err => console.error(err));
  }

  objectKeys(element: any) {
    return Object.keys(element);
  }
  
  async openModal() {
    const modal = await this.modal.create({component: UserGameDetailsPage, componentProps: {userGame: this.gameData.userGame}});
    modal.present();

    const { data } = await modal.onWillDismiss();
    console.log("onWillDismiss", data);
    if (data.componentProps) {
      this.gameData.userGame = data.componentProps;
    }
  }
}
