import config from "@/config";
import ApiService from "./ApiService";
import {FirebaseHelper} from "@/data/helpers/firebase";

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
        }

        return Promise.reject();
      });
  }

  public static isLoggedIn(): boolean {
    return FirebaseHelper.isLoggedIn();
  }
}

export default AuthService;
