export default class PETTY_CASH_API {
    static async getOne(id: string) {
        const api = `https://agile-tundra-78417.herokuapp.com/petty_cash_api?query=query{detail(id:"${id}"){id, user_id, grant_id, date, description, amount, receipts, created_at, action_history{id, user_id, status, created_at}, current_status, is_active}}`
        const recorddetail = await fetch(api).then(res => res.json())
        return recorddetail;
    }
}