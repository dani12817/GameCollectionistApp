import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomePage } from './home/home.page';
import { AddGamePage } from './add-game/add-game.page';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { PendingGamesPage } from './pending-games/pending-games.page';
import { MyLibraryPage } from './my-library/my-library.page';
import { GameDetailsPage } from './game-details/game-details.page';
import { UserDataPage } from './user-data/user-data.page';
import { UserProfilePage } from './user-profile/user-profile.page';
import { UserInfoTabPage } from './user-profile/user-info-tab/user-info-tab.page';

import { GameDetailsResolverService } from '../shared/resolvers/game-details-resolver.service';
import { AuthUserResolverService } from '../shared/resolvers/auth-user-resolver.service';
import { UserDataResolverService } from '../shared/resolvers/user-data-resolver.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomePage
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'request-game',
    component: AddGamePage
  },
  {
    path: 'create-game',
    component: AddGamePage
  },
  {
    path: 'pending-game/:game_code',
    component: AddGamePage,
    resolve: {
      gameData: GameDetailsResolverService
    }
  },
  {
    path: 'edit-game/:game_code',
    component: AddGamePage,
    resolve: {
      gameData: GameDetailsResolverService
    }
  },
  {
    path: 'pending-games',
    component: PendingGamesPage
  },
  {
    path: 'my-library',
    component: MyLibraryPage,
    resolve: {
      gameData: AuthUserResolverService
    }
  },
  {
    path: 'user/:nickname',
    component: UserProfilePage,
    resolve: {
      userData: UserDataResolverService
    },
    children: [
      {
        path: 'user-info-tab',
        component: UserInfoTabPage,
      },
    ]
  },
  {
    path: 'user-data',
    component: UserDataPage,
    resolve: {
      userData: AuthUserResolverService
    }
  },
  {
    path: ':game_code',
    component: GameDetailsPage,
    resolve: {
      gameData: GameDetailsResolverService
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
