import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { SearchGameUserPage } from '../../shared/modals/search-game-user/search-game-user';

import { GameService, LoadingService, UserService } from '../../providers/providers';
import { Game, User, SearchForm } from '../../models/models';

import { GameMethods } from '../../shared/game-methods';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  games: Game[]; gameMeth = GameMethods;
  gamesFiltered: Game[]; userFiltered: User[];
  searchType: string; filters: SearchForm = {};

  constructor(private gameService: GameService, private modal: ModalController, private loading: LoadingService, private userService: UserService) { }

  ionViewWillEnter(): void {
    this.loading.isLoading = true;
    this.gameService.getAllGames().then(response => {
      console.log("getGames");
      this.games = response;
      this.loading.isLoading = false;
    }).catch(err => console.error(err));
  }

  getGameList() {
    return (Object.keys(this.filters).length > 0) ? this.gamesFiltered : this.games;
  }

  async openSearchModal() {
    console.log("filters", this.filters);
    if (this.searchType) { this.filters.type = this.searchType; }

    const modal = await this.modal.create({component: SearchGameUserPage, componentProps: {filters: this.filters}});
    modal.present();

    const { data } = await modal.onWillDismiss();

    console.log("onWillDismiss", data);
    if (data.componentProps !== undefined) {
      this.loading.isLoading = true;
      this.searchType = data.componentProps.type; delete data.componentProps.type;
      this.filters = data.componentProps;
      if (this.searchType == 'user') {
        this.filterUser(this.filters);
      } else {
        this.filterGame(this.filters);
      }
    } else { this.filters = {}; }
  }

  private filterUser(filters: SearchForm) {
    this.userFiltered = [];
    this.userService.searchUser(filters.nickname).then(response => {
      this.userFiltered = response;
      this.loading.isLoading = false;
    }).catch(err => console.error(err))
  }

  private filterGame(filters: SearchForm) {
    this.gamesFiltered = [];
    if (Object.keys(filters).length > 0) {
      for (const game of this.games) {
        if (this.applyFilter(game, filters)) {
          this.gamesFiltered.push(game);
        }
      }
    }
    this.loading.isLoading = false;
  }

  private applyFilter(game: Game, filters: SearchForm): boolean {
    let addGame: boolean;
    for (const filter of Object.keys(filters)) {
      if (filter == 'name' || filter == 'game_code') {
        addGame = game[filter].toLowerCase().includes(filters[filter].toLowerCase());
      } else if (filter == 'platform' || filter == 'region') {
        addGame = (filters[filter].indexOf(game[filter]) > -1);
      } else if (filter == 'genres' && game.genres) {
        for (const genre of filters[filter]) {
          addGame = (game.genres.indexOf(genre) > -1);
          if (addGame) { break; }
        }
      }
    }
    return addGame;
  }
  
  /*async doRefresh(event) {
    await this.initGameList();
    event.target.complete();
  }*/
}
