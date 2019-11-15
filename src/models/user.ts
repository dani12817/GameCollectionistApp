export class User {
    name: string;
    admin?: boolean;
    uid: string;
    avatar?: string;
    email: string;
    games?: {gamecode: string, reference: firebase.firestore.DocumentReference, price?: number, currency?: string}[];

    constructor(userData: firebase.auth.UserCredential) {
        this.email = userData.user.email;
        this.name = userData.user.email.split('@')[0];
        this.uid = userData.user.uid;
        this.admin = false;
        this.avatar = null;
        this.games = [];
    }
}
  