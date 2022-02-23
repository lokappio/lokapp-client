# Authentication

To identify the user on Lokapp's API, the client has to add a Bearer token (JWT) within the `Authorization` header.

## Requirements 

### Firebase configuration

Specify your Firebase configuration inside `.env`:

```
  VUE_APP_FIREBASE_API_KEY=your firebase api key
  VUE_APP_FIREBASE_AUTH_DOMAIN=your firebase auth domain
  VUE_APP_FIREBASE_PROJECT_ID=your firebase project id
  VUE_APP_FIREBASE_STORAGE_BUCKET=your firebase storage bucket
  VUE_APP_FIREBASE_MESSAGINGSENDER_ID=your firebase messaging sender id
  VUE_APP_FIREBASE_APP_ID=your firebase app id
```

## Authenticated request

Every time you need to call an endpoint of the API requiring your user to be authenticated, then you need to add a JWT inside the `Authorization` header:
```
Authorization: Bearer the_JWT_of_your_authenticated_user
```
