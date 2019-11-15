import { Component } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { Game } from '../../models/game';
import { GameService } from '../../providers/game.service';

import { FormClass } from '../form-class';
import { GameMethods } from '../game-methods';

@Component({
  selector: 'add-other-modal',
  templateUrl: 'add-other-modal.page.html',
  styleUrls: ['add-other-modal.page.scss'],
})
export class AddOtherModalPage {
  gameData: Game; gameMeth = GameMethods;
  addOtherAction: string; addOtherGameList: Game[] = null;

  constructor(private gameService: GameService, navParams: NavParams, private modal: ModalController) {
    this.addOtherAction = navParams.get('type');
    this.gameData = navParams.get('game');
  }

  filterGameList(textFilter: string) {
    this.addOtherGameList = [];
    this.gameService.getAllGames().then(response => {
      if (textFilter.trim().length > 1) {
        textFilter = textFilter.toLowerCase();
        for (const game of response) {
          if (game.name.toLowerCase().includes(textFilter) && game.name !== this.gameData.name) {
            this.addOtherGameList.push(game);
          }
        }
      } else { this.addOtherGameList = response; }
    }).catch(err => console.error(err));
  }

  addToOtherList(game: Game) {
    let otherToAdd: {game_code: string, region?: string, platform?: string};
    if(this.addOtherAction === 'other_regions') {
      otherToAdd = {game_code: game.game_code, region: game.region};
    } else { otherToAdd = {game_code: game.game_code, platform: game.platform}; }
    this.closeModal(otherToAdd);
  }

  closeModal(data?) {
    this.modal.dismiss({dismissed: true, componentProps: data});
  }
}
