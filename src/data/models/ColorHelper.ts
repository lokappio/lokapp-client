
export default class ColorHelper {
    type: string;
    color: string;

    constructor(type: string, color: string) {
        this.type = type
        this.color = color
    }
    
    public static map(json: any): ColorHelper {
        return new this(json.type, json.color);
    }
}
