export default function inputDate(input: string){
    var date = new Date(input);
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
    date.getUTCDate(), date.getUTCHours(),
    date.getUTCMinutes(), date.getUTCSeconds());
    
    console.log(new Date(now_utc));
    console.log(date.toISOString());
    return date.toISOString();
}