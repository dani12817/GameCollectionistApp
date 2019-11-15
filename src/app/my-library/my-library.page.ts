import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Game } from '../../models/game';
import { AuthService } from '../../providers/auth.service';

import { GameMethods } from '../../shared/game-methods';

@Component({
  selector: 'app-my-library',
  templateUrl: 'my-library.page.html',
  styleUrls: ['my-library.page.scss'],
})
export class MyLibraryPage {
  userGamesLibrary = {}; gameMeth = GameMethods;
  gamePlatformSelected: Game[];

  constructor(private authService: AuthService, private afs: AngularFirestore) {
    this.initializeLibrary();
  }

  async initializeLibrary() {
    for (const game of this.authService.userLogged.games) {
      await game.reference.get().then(res => {
        let gameData = res.data();
        if (this.userGamesLibrary[gameData.platform] !== undefined) {
          this.userGamesLibrary[gameData.platform].push(gameData);
        } else { this.userGamesLibrary[gameData.platform] = [gameData]; }
      })
    }
    console.log("userGamesLibrary", this.userGamesLibrary);
  }

  objectKeys(data): string[] {
    return Object.keys(data);
  }

  selectGamePlatform(platform: string) {
    this.gamePlatformSelected = this.userGamesLibrary[platform];
  }
}
