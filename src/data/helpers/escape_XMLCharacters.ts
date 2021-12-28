import {Platform} from "@/data/models/enums/project";

const findAMPCharacters = (str: string): string => {
    const regexp = new RegExp(/((?!&amp;)[&])/g);
    const data = [...str.matchAll(regexp)].reverse();

    let output = str;
    data.forEach((match) => {
        const index = match.index;
        const remplacement = "&amp;";

        if (index !== undefined && index >= 0) {
            output = output.substring(0, index) + remplacement + output.substring(index + 1);
        }
    });
    return output;
}

export const escapeXMLCharacters = (platform: Platform, output: string) => {
    if (platform === Platform.ANDROID) {
        output = findAMPCharacters(output);
    }
    return output;
};