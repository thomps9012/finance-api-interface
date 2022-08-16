// user
export const ALL_USERS_RES = `{id,manager_id,name,role,email}`;
export const USER_OVERVIEW_RES = `{id, incomplete_action_count, last_login, manager_id, name, role, check_requests {receipts, request_ids, purchases {description, grant_line_item, amount}, vendors {name}, total_amount}, mileage_requests { mileage, parking, tolls, request_ids, reimbursement}, petty_cash_requests {total_amount, receipts, request_ids}}`

// mileage
export const MILEAGE_DETAIL_RES = `{id, user_id, user{name, email, role}, date, starting_location, destination, trip_purpose, start_odometer, end_odometer, tolls, parking, trip_mileage, reimbursement, created_at, action_history{id, user_id, status, created_at}, current_status, is_active}`

// petty cash
export const PETTY_CASH_DETAIL_RES = `{id, user_id, grant_id, date, description, amount, receipts, created_at, action_history{id, user_id, status, created_at}, current_status, is_active}`
export const CREATE_PETTY_CASH = `{id, user_id, created_at}`

// check requests
export const CHECK_DETAIL_RES = `{id, user_id, grant_id, date, vendor {name, address {website, street, city, state, zip}}, description, purchases {amount, grant_line_item, description}, receipts, order_total, credit_card, created_at, action_history{id, user_id, status, created_at}, current_status, is_active}`