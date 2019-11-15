import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";

import { Game } from "../models/game";

@Injectable({
  providedIn: "root"
})
export class GameService {
  constructor(private storage: AngularFireStorage, private afs: AngularFirestore) { }

  getAllGames(pending?: boolean): Promise<Game[]> {
    return new Promise<Game[]>((resolve, reject) => {
      this.afs.collection<Game>(pending ? 'pendingGames' : 'games').valueChanges().subscribe(response => {
        resolve(response);
      }, err => reject(err));
    });
  }

  getGameByGameCode(game_code: string, pending?: boolean): Promise<Game> {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection<Game>(pending ? 'pendingGames' : 'games').doc<Game>(game_code).valueChanges().subscribe(response => {
        resolve(new Game(response));
      }, err => reject(err));
    });
  }

  createGame(gameData: Game, boxart, pending: boolean): Promise<Game> {
    if (boxart) {
      return this.saveWithBoxart(boxart, Object.assign({}, gameData), false);
    } else { return this.saveGameData(Object.assign({}, gameData)); }
  }

  saveWithBoxart(gameData: Game, boxart, pending: boolean) {
	  return new Promise<any>((resolve, reject) => {
		const fileRef = this.storage.ref(`games/${gameData.game_code}.${boxart.name.split(".")[1]}`);
    const metaData = { contentType: boxart.type };
    console.log(gameData, boxart, pending);

		fileRef.put(boxart, metaData).then(snapshot => {
		  snapshot.ref.getDownloadURL().then(downloadURL => {
			gameData.image = downloadURL;
			gameData.namecode = this.generateNameCode(gameData.name);
			this.afs.collection<Game>(pending ? 'pendingGames' : 'games').doc(gameData.game_code).set(gameData);
			resolve(true);
		  }).catch(err => reject(err));
		}).catch(err => reject(err));
	  });
  }

  updateGame(gameData: Game, boxart): Promise<Game> {
    if (boxart) {
      return this.saveWithBoxart(boxart, Object.assign({}, gameData), false);
    } else { return this.saveGameData(Object.assign({}, gameData)); }
  }
  
  private saveGameData(gameData): Promise<Game> {
    return new Promise<Game>((resolve, reject) => {
      this.afs.collection<Game>('games').doc(gameData.game_code).set(gameData);
      resolve(gameData);
    });
  }

  private generateNameCode(name: string): string {
    name = name.toLowerCase();
    name = name.replace('(', '').replace(')', '').replace('.', '').replace(',', '').replace('!', '').replace('?', '').replace(':', '').replace('/', '');
    return name;
  }

  deleteGame(game_code: string, pending?: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.afs.collection<Game>(pending ? 'pendingGames' : 'games').doc<Game>(game_code).delete().then(() => {
        console.log("deleted", game_code);
        resolve();
      }).catch(err => reject(err));
    });
  }

  gameExist(game_code: string): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      this.getGameByGameCode(game_code).then(response => {
        if (response.game_code === null || response.game_code === undefined) {
          resolve(false);
        } else { resolve (true); }
      }).catch(err => reject(err));
    });
  }
}
