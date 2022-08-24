import { Action } from "./checkrequests";

export interface MileageDetail {
    id: string;
    grant_id: string;
    user_id: string;
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
    current_user: string;
    is_active: string;
}


export interface MileageOverview {
    mileage: number;
    parking: number;
    reimbursement: number;
    requests: [MileageDetail];
    last_request: MileageDetail;
    tolls: number;
}