import firebase from "firebase/app";
import "firebase/auth";
import store from "@/store/index";
import authService from "@/data/services/AuthService";

export class FirebaseHelper {
  static currentUser(): firebase.User {
    return firebase.auth().currentUser;
  }

  static isLoggedIn() {
    return firebase.auth().currentUser !== null;
  }

  static logout() {
    return firebase.auth().signOut();
  }

  static firebaseEmailSignUp(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  static firebaseEmailSignIn(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  static onAuthStateChanged() {
    return firebase.auth().onAuthStateChanged(async user =>  {
      store.commit("SET_USER", user);

      if(user != null) {
        if(store.state.canRetrieveUser) await authService.setUser();
      } else {
        store.commit('SET_APP_USER',null);
      }
      store.commit("SET_APPLICATION_READY");
    });
  }

  static firebaseCheckEmailExists(email: string) {
    return firebase.auth().fetchSignInMethodsForEmail(email);
  }

  static firebaseForgotPassword(email: string) {
    return firebase.auth().sendPasswordResetEmail(email)
  }
}

