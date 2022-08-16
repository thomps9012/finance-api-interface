export default function dateFormat(date: string) {
    let simpleDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(date))
    return simpleDate;
}