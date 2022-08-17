export default class MILEAGE_API {
    static async getOne(id: string) {
        const api = `https://agile-tundra-78417.herokuapp.com/mileage_api?query=query{detail(id:"${id}"){id, user_id, user{name, email, role}, date, starting_location, destination, trip_purpose, start_odometer, end_odometer, tolls, parking, trip_mileage, reimbursement, created_at, action_history{id, user_id, status, created_at}, current_status, is_active}}`
        const recorddetail = await fetch(api).then(res => res.json())
        return recorddetail;
    }
}