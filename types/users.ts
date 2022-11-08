import {
  Action,
  CheckDetail,
  CheckRequestOverview,
  Purchase,
  Vendor,
} from "./checkrequests";
import { MileageDetail, MileageOverview } from "./mileage";
import { PettyCashDetail, PettyCashOverview } from "./pettycash";

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  admin: boolean;
  permissions: string[];
  is_active: boolean;
  last_login: Date;
  vehicles: Vehicle[];
  incomplete_actions: Action[];
}

export interface Vehicle {
  id: string;
  name: string;
  description: string;
}

export interface UserOverview {
  id: string;
  name: string;
  admin: boolean;
  permissions: string[];
  vehicles: Vehicle[];
  incomplete_actions: Action[];
  incomplete_action_count: number;
  last_login: string;
  mileage_requests: AggregateMileage;
  check_requests: AggregateCheckRequest;
  petty_cash_requests: AggregatePettyCash;
}

export interface AggregateMileage {
  vehicles: Vehicle[];
  mileage: number;
  tolls: number;
  parking: number;
  reimbursement: number;
  total_requests: number;
  last_request: MileageDetail;
}
export interface AggregateCheckRequest {
  total_amount: number;
  receipts: string[];
  vendors: Vendor[];
  purchases: Purchase[];
  total_requests: number;
  last_request: CheckDetail;
}
export interface AggregatePettyCash {
  user: UserInfo;
  total_amount: number;
  total_requests: number;
  last_request: PettyCashDetail;
}
