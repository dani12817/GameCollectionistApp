import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Game } from '../../models/game';
import { GameService } from '../../providers/game.service';

import { platforms } from '../../shared/constant';
import { GameMethods } from '../../shared/game-methods';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  games: Game[];
  platforms: string[] = platforms;
  gamesFiltered: Game[]; filterActive: boolean = false;
  gameMeth = GameMethods;

  constructor(private gameService: GameService, private afs: AngularFirestore) {
    this.initGameList();
  }

  async initGameList() {
    await this.gameService.getAllGames().then(response => {
      this.games = response;
    }).catch(err => console.error(err));
  }

  getGameList() {
    return this.filterActive ? this.gamesFiltered : this.games;
  }
  
  async doRefresh(event) {
    await this.initGameList();
    event.target.complete();
  }
}
