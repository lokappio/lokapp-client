import RoleProtection from "./RoleProtection";

export default class RoleTranslator extends RoleProtection {
    constructor() {
        super();
        this.canWriteValue = true;
    }
}
