import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from '../app/app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { HomePage } from '../app/home/home.page';
import { AddGamePage } from '../app/add-game/add-game.page';
import { LoginPage } from '../app/login/login.page';
import { RegisterPage } from '../app/register/register.page';
import { PendingGamesPage } from 'src/app/pending-games/pending-games.page';
import { MyLibraryPage } from 'src/app/my-library/my-library.page';
import { GameDetailsPage } from 'src/app/game-details/game-details.page';
import { AddOtherModalPage } from './add-other-modal/add-other-modal.page';
import { UserGameDetailsPage } from './modals/user-game-details/user-game-details';
import { UserDataPage } from '../app/user-data/user-data.page';
import { UserProfilePage } from '../app/user-profile/user-profile.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  entryComponents: [AddOtherModalPage, UserGameDetailsPage],
  declarations: [
    HomePage,
    AddGamePage,
    LoginPage, RegisterPage,
    PendingGamesPage,
    MyLibraryPage,
    GameDetailsPage,
    AddOtherModalPage,
    UserGameDetailsPage,
    UserDataPage, UserProfilePage
  ]
})
export class SharedModule {}
