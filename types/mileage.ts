import { Action } from "./checkrequests";
import { UserInfo } from "./users";

export interface MileageDetail {
    action_history: Action[];
    category: string;
    created_at: string;
    current_status: string;
    current_user: string;
    date: string;
    destination: string;
    end_odometer: number;
    grant_id: string;
    id: string;
    is_active: boolean;
    parking: number;
    reimbursement: number;
    start_odometer: number;
    starting_location: string;
    tolls: number;
    trip_mileage: number;
    trip_purpose: string;
    user_id: string;
}


export interface MileageOverview {
    created_at: Date;
    current_status: string;
    date: Date;
    grant_id: string;
    id: string;
    is_active: boolean;
    reimbursement: number;
    trip_mileage: number;
    user: UserInfo;
    user_id: string;
}

export interface MonthlyMileage {
    mileage: number;
    month: string;
    name: string;
    parking: number;
    reimbursement: number;
    requests: MileageDetail[];
    tolls: number;
    user_id: string;
    year: number;
}

export interface UserMileage {
    mileage: number;
    parking: number;
    reimbursement: number;
    requests: MileageDetail[]
    tolls: number;
    user: UserInfo;
}