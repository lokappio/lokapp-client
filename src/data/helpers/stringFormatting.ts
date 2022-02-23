export const firstChar = (stringToAnalyse: string) => (stringToAnalyse.charAt(0).toUpperCase())

export const optionalString = (basicString: string, optionalString: string) => {
    return (basicString + " " + optionalString);
};