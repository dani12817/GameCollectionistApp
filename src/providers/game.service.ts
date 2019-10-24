import { Injectable } from "@angular/core";
import {AngularFireStorage} from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";

import { Game } from "../models/game";

@Injectable({
  providedIn: "root"
})
export class GameService {
    gameCollection = this.afs.collection<Game>("games");

    constructor(private storage: AngularFireStorage, private afs: AngularFirestore) { }

    createGame(gameData: Game, boxart) {
      return new Promise<any>((resolve, reject) => {
        const fileRef = this.storage.ref(`games/${gameData.game_code}.${boxart.name.split(".")[1]}`);
        const metaData = { contentType: boxart.type };

        fileRef.put(boxart, metaData).then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            gameData.image = downloadURL;
            this.gameCollection.doc(gameData.game_code).set(gameData);
            resolve(true);
          }).catch(err => reject(err));
        }).catch(err => reject(err));
      });
    }
}
