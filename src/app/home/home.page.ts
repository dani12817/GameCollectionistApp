import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Game } from '../../models/game';
import { platforms } from '../../shared/constant';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  games: Game[];
  platforms: string[] = platforms;
  gamesFiltered: Game[]; filterActive: boolean = false;

  constructor(private afs: AngularFirestore) {
    this.initGameList();
  }

  initGameList() {
    this.afs.collection<Game>('games').valueChanges().subscribe(response => {
      this.games = response;
      console.log(this.games);
    });
  }

  getGameList() {
    return this.filterActive ? this.gamesFiltered : this.games;
  }
}
