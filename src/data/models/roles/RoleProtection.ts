
export default class RoleProtection {
    canWriteGroup: boolean;
    canWriteInvitation: boolean;
    canWriteKey: boolean;
    canWriteLanguage: boolean;
    canWriteProject: boolean;
    canDeleteProject: boolean;
    canWriteValue: boolean;
    canWriteUser: boolean;
    canWriteStatus: boolean;

    constructor() {
        this.canWriteGroup = false;
        this.canWriteInvitation = false;
        this.canWriteKey = false;
        this.canWriteLanguage = false;
        this.canWriteProject = false;
        this.canDeleteProject = false;
        this.canWriteValue = false;
        this.canWriteUser = false;
        this.canWriteStatus = false;
    }
}
