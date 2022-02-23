# Roles

When inviting a user to collaborate with you on a project, you have to specify its role.

The new user's role can be one of the following:
- owner
- manager
- editor
- translator

### Owner

The default role given to the user creating a project. This user can do everything on a project: managing users, languages, translations, and even deleting the whole project.

The deletion of a project can only be done by its owner.

### Manager

A _manager_, as the _owner_, can do everything on a project, except deleting a project. 

### Editor

An _editor_ can't edit the project or its user, but can manage languages, groups and translations of a project. 

### Translator

A _translator_ is the role with the less permissions and can only manage translation values.

A user with this role isn't allowed to edit translation keys or languages.


## Adding a new role

These roles are defined in `/src/data/models/roles`.

The role's permissions are defined inside each role class, which extend `RoleProtection`.

```javascript
import RoleProtection from "./RoleProtection";

export default class MyNewRole extends RoleProtection {
    constructor() {
        super();  //To generate default values for permissions
        this.canWriteGroup = true;
        this.canWriteKey = true;
        this.canWriteLanguage = true;
        this.canWriteValue = true;
    }
}
```

From the client side, roles are used to restrict the user's interface. For instance, a _translator_ won't be able to access the project's settings.

However, keep in mind that the API also has this roles mechanism. Thus, if you change the `canWriteProject` variable for a _translator_ then your translator will be able to access the project's setting but won't be able to update the project as the API will respond a HTTP 403 error. 
To change a role, do it on both [client](https://github.com/lokappio/lokapp-client) and [API](https://github.com/lokappio/lokapp-api) sides. 