import RoleProtection from "./RoleProtection";

export default class RoleOwner extends RoleProtection {
    constructor() {
        super();
        this.canWriteGroup = true;
        this.canWriteInvitation = true;
        this.canWriteKey = true;
        this.canWriteLanguage = true;
        this.canWriteProject = true;
        this.canDeleteProject = true;
        this.canWriteValue = true;
        this.canWriteUser = true;
    }
}