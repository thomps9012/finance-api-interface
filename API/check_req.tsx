export default class CHECK_REQ_API {
    static async getOne(id: string) {
        const api = `https://agile-tundra-78417.herokuapp.com/check_request_api?query=query{detail(id:"${id}"){id, user_id, grant_id, date, vendor {name, address {website, street, city, state, zip}}, description, purchases {amount, grant_line_item, description}, receipts, order_total, credit_card, created_at, action_history{id, user_id, status, created_at}, current_status, is_active}}`
        const recorddetail = await fetch(api).then(res => res.json())
        return recorddetail;
    }
}