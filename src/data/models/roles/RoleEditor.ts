import RoleProtection from "./RoleProtection";

export default class RoleEditor extends RoleProtection {
    constructor() {
        super();
        this.canWriteGroup = true;
        this.canWriteKey = true;
        this.canWriteLanguage = true;
        this.canWriteValue = true;
    }
}