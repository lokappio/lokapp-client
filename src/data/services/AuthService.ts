import config from "@/config";
import firebase from "firebase/app";
import "firebase/auth";
import ApiService from "./ApiService";

class AuthService {
  static authUrl: string = config.baseUrl + "/auth";

  public static getToken(): Promise<string | null> {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      return currentUser.getIdToken(true).then((token) => {
        return token;
      });
    }
    return Promise.resolve(null);
  }

  public static logIn(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  public static logOut() {
    return firebase.auth().signOut();
  }

  public static resetPassword(email: string) {
    return firebase.auth().fetchSignInMethodsForEmail(email)
    .then((result) => {
      if (result.length > 0) {
        return firebase.auth().sendPasswordResetEmail(email);
      } else {
        throw "unknown_email";
      }
    });
  }

  public static register(email: string, password: string, pseudo: string) {
    const registerUrl: string = AuthService.authUrl + "/register";

    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((credentials: firebase.auth.UserCredential) => {
        const user = credentials.user;
        
        if (user) {
          const mail = user.email;
          const bodyParameters = {
            username: pseudo,
            email: mail
          };

          return ApiService.postAPI(registerUrl, bodyParameters)
        }

        return Promise.reject()
      });
  }

  public static isLoggedIn(): boolean {
    return firebase.auth().currentUser !== null;
  }
}

export default AuthService;
