export default function titleCase(string: string) {
    let strArr = string.toLowerCase().split(" ")
    for (let i = 0; i < strArr.length; i++) {
        strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
    }
    return strArr.join(" ");
}