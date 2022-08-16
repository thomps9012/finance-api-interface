import { Action } from "./checkrequests";
import { UserInfo } from "./users";

export interface MileageDetail {
    id: string;
    user_id: string;
    user: UserInfo;
    date: string;
    starting_location: string;
    destination: string;
    trip_purpose: string;
    start_odometer: number;
    end_odometer: number;
    tolls: number;
    parking: number;
    trip_mileage: number;
    reimbursement: number;
    created_at: string;
    action_history: [Action];
    current_status: string;
    is_active: string;
}


export interface MileageOverview {
    mileage: number;
    parking: number;
    reimbursement: number;
    request_ids: [string];
    tolls: number;
}