export default class USER_API {
    static async getAll () {
        const all_api = "https://agile-tundra-78417.herokuapp.com/user_api?query=query{all{id,manager_id,name,role,email}}";
        const userdata = await fetch(all_api).then(res => res.json())
        return userdata;
    }
    static async getOverview(id:string){
        console.log(id)
        const user_api = `https://agile-tundra-78417.herokuapp.com/user_api?query=query{overview(id:"${id}"){id, incomplete_action_count, last_login, manager_id, name, role, check_requests {receipts, request_ids, purchases {description, grant_line_item, amount}, vendors {name}, total_amount}, mileage_requests { mileage, parking, tolls, request_ids, reimbursement}, petty_cash_requests {total_amount, receipts, request_ids}}}`;
        const useroverview = await fetch(user_api).then(res => res.json());
        return useroverview;
    }
}