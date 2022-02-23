import RoleProtection from "./RoleProtection";

export default class RoleManager extends RoleProtection {
    constructor() {
        super();
        this.canWriteGroup = true;
        this.canWriteInvitation = true;
        this.canWriteKey = true;
        this.canWriteLanguage = true;
        this.canWriteProject = true;
        this.canWriteValue = true;
        this.canWriteUser = true;
    }
}