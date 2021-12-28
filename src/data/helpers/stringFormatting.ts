
export const userString = (beginOfString: string, userName: string) => {
    if (userName === null || userName.length === 0)
        return beginOfString;
    else
        return (beginOfString + ", " + userName);
}

export const firstChar = (stringToAnalyse: string) => {
    return (stringToAnalyse.charAt(0).toUpperCase());
}

export const optionalString = (basicString: string, optionalString: string) => {
    return (basicString + " " + optionalString);
};