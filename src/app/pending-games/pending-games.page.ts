import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Game } from '../../models/game';
import { GameService } from '../../providers/game.service';

import { platforms } from '../../shared/constant';

@Component({
  selector: 'app-pending-games',
  templateUrl: 'pending-games.page.html',
  styleUrls: ['pending-games.page.scss'],
})
export class PendingGamesPage {
  games: Game[];
  platforms: string[] = platforms;
  gamesFiltered: Game[]; filterActive: boolean = false;

  constructor(private gameService: GameService, private afs: AngularFirestore) { }

  ionViewWillEnter(): void {
    this.gameService.getAllGames(true).then(response => {
      console.log("getPending");
      this.games = response;
    }).catch(err => console.error(err));
  }

  getGameList() {
    return this.filterActive ? this.gamesFiltered : this.games;
  }
}
