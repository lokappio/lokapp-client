import RoleProtection from "./RoleProtection";

export default class RoleReviewer extends RoleProtection {
    constructor() {
        super();
        this.canWriteStatus = true;
    }
}
