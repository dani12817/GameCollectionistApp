import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from '@angular/fire/storage';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userLogged: User;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, private storage: AngularFireStorage) { }

  loginEmailPass(loginData: {email: string, password: string}) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(loginData.email, loginData.password).then(response => {
        this.getLoggedInUser().then(userLogged => {
          console.log("loginEmailPass signInWithEmailAndPassword", userLogged);
          if (userLogged === undefined) {
            // console.log("initializeUser");
            this.userLogged = this.initializeUser(response);
          } else { this.userLogged = userLogged; }
          resolve(response);
        }, err => reject(err));
      }, err => reject(err));
    });
  }

  registerUser(loginData, avatar){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(loginData.email, loginData.password).then(response => {
        loginData.uid = response.user.uid;
        this.createWithAvatar(loginData, avatar).then(response => {
          resolve(response);
        }, err => reject(err));
      }, err => reject(err));
    })
  }

  private createWithAvatar(loginData, avatar) {
	  return new Promise<any>((resolve, reject) => {
  		const fileRef = this.storage.ref(`users/${loginData.uid}`);
      const metaData = { contentType: avatar.type };
      console.log("createWithAvatar");
  
  		fileRef.put(avatar, metaData).then(snapshot => {
  		  snapshot.ref.getDownloadURL().then(downloadURL => {
    			loginData.avatar = downloadURL;
          this.userLogged = this.initializeUser(loginData, true);
    			resolve(true);
  		  }).catch(err => reject(err));
  		}).catch(err => reject(err));
	  });
  }
  
  getLoggedInUser(): Promise<User> {
    return new Promise((resolve, reject) => {      
      if(this.userLogged) { resolve(this.userLogged); }
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          let sub = this.afs.collection<User[]>("usersGameLibrary").doc(user.uid).valueChanges().subscribe((userLibrary: User) => {
            sub.unsubscribe();
            this.userLogged = userLibrary;
            resolve(userLibrary);
          });
        } else {
          resolve(null);
        }
      }), (err) => resolve(null);
    });
  }

  initializeUser(userData, register?: boolean): User{
    let user = new User(userData, register);
    console.log("initializeUser", user);
    this.afs.collection<User[]>("usersGameLibrary").doc(register ? userData.uid : userData.user.uid).set(Object.assign({}, user));
    return user;
  }
}
