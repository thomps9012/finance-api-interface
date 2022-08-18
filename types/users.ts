import { CheckRequestOverview } from "./checkrequests";
import { MileageOverview } from "./mileage";
import { PettyCashOverview } from "./pettycash";



export interface UserInfo {
    id: string;
    name: string;
    last_login: string;
    incomplete_actions: [string];
}

export interface Vehicle {
    id: string;
    name: string;
    description: string;
}

export interface UserOverview {
    id: string;
    name: string;
    role: string;
    manager_id: string;
    incomplete_action_count: number;
    incomplete_actions: [string];
    last_login: string;
    mileage_requests: MileageOverview;
    check_requests: CheckRequestOverview;
    petty_cash_requests: PettyCashOverview;
    vehicles: [Vehicle];
}