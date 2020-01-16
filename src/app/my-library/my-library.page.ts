import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Game } from '../../models/game';
import { AuthService } from '../../providers/auth.service';

import { GameMethods } from '../../shared/game-methods';
import { userLibraries } from '../../shared/constant';

@Component({
  selector: 'app-my-library',
  templateUrl: 'my-library.page.html',
  styleUrls: ['my-library.page.scss'],
})
export class MyLibraryPage {
  userGamesLibrary = {}; gameMeth = GameMethods; userLibraries = userLibraries;
  selectLibrary: string; libraryLoaded: boolean = false;
  gamePlatformSelected: Game[];

  constructor(private authService: AuthService, private afs: AngularFirestore) { }

  ionViewWillEnter(): void {
    this.selectLibrary = 'owned';
    this.gamePlatformSelected = null;
    this.initializeLibrary();
  }

  async initializeLibrary(event?) {
    if ((event && this.selectLibrary !== event.detail.value) || (event && !this.libraryLoaded)) {
      this.selectLibrary = event.detail.value;
      this.userGamesLibrary = {}; this.libraryLoaded = true;
      for (const game of this.authService.userLogged.games) {
        if (game.type === this.selectLibrary) {
          await game.reference.get().then(res => {
            let gameData = res.data();
            if (this.userGamesLibrary[gameData.platform] !== undefined) {
              this.userGamesLibrary[gameData.platform].push(gameData);
            } else { this.userGamesLibrary[gameData.platform] = [gameData]; }
          });
        }
      }
      console.log("userGamesLibrary", this.userGamesLibrary);
    }
  }

  objectKeys(data): string[] {
    return Object.keys(data);
  }

  selectGamePlatform(platform: string) {
    this.gamePlatformSelected = this.userGamesLibrary[platform];
  }
}
