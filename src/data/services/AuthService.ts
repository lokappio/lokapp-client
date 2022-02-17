import config from "@/config";
import ApiService from "./ApiService";
import {FirebaseHelper} from "@/data/helpers/firebase";
import UserService from "@/data/services/UserService";
import store from "@/store";

class AuthService {
  static authUrl: string = config.baseUrl + "/auth";

  public static getToken(): Promise<string | null> {
    const currentUser = FirebaseHelper.currentUser();

    if (currentUser) {
      return currentUser.getIdToken(true);
    }
    return Promise.resolve(null);
  }

  public static logIn(email: string, password: string) {
    return FirebaseHelper.firebaseEmailSignIn(email, password);
  }

  public static logOut() {
    return FirebaseHelper.logout();
  }

  public static resetPassword(email: string) {
    return FirebaseHelper.firebaseCheckEmailExists(email)
    .then((result) => {
      if (result.length > 0) {
        return FirebaseHelper.firebaseForgotPassword(email);
      } else {
        throw "unknown_email";
      }
    });
  }

  public static register(email: string, password: string, pseudo: string) {
    const registerUrl: string = AuthService.authUrl + "/register";
    store.commit("SET_CAN_RETRIEVE_USER", false);

    return FirebaseHelper.firebaseEmailSignUp(email, password)
      .then((credentials) => {
        const user = credentials.user;

        if (user) {

          const mail = user.email;
          const bodyParameters = {
            username: pseudo,
            email: mail
          };

          return ApiService.postAPI(registerUrl, bodyParameters)
            .then(() => this.setUser())
            .catch((error) => console.log(error));
        }
      }).finally(() => store.commit("SET_CAN_RETRIEVE_USER", true));
  }

  public static async setUser(): Promise<void> {
    await UserService.getMe()
      .then((user) => store.commit('SET_APP_USER', user))
      .catch(() => FirebaseHelper.logout());
  }

  public static isLoggedIn(): boolean {
    return FirebaseHelper.isLoggedIn() && store.getters.appUser != null;
  }
}

export default AuthService;
