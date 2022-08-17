import { gql } from '@apollo/client';
// user
export const ALL_USERS = gql`query{all_users{id manager_id name role email}}`;
export const USER_OVERVIEW = gql`query userOverview($id: ID!){user_overview(id: $id){id name role manager_id incomplete_action_count last_login
    mileage_requests {
        mileage
        parking
        tolls
        request_ids
        reimbursement
      }
      check_requests {
        vendors {
          name
        }
        receipts
        request_ids
        total_amount
        purchases {
            amount
            grant_line_item
            description
        }
      }
      petty_cash_requests {
        request_ids
        total_amount
        receipts
      }
    }}`;

// // mileage
export const MILEAGE_DETAIL = gql`query mileageDetail($id: ID!) {
  mileage_detail(id: $id) {
    id
    user_id
    date
    starting_location
    destination
    trip_purpose
    start_odometer
    end_odometer
    tolls
    parking
    trip_mileage
    reimbursement
    created_at
    action_history {
      id
      created_at
      status
      user_id
    }
    current_status
    is_active
  }
}`;

// // petty cash
export const PETTY_CASH_DETAIL = gql`query pettyCashDetail($id: ID!){
  petty_cash_detail(id: $id) {
    id
    user_id
    grant_id
    date
    description
    amount
    receipts
    created_at
    action_history {
      id
      created_at
      status
      user_id
    }
    current_status
    is_active
  }
}`;

// // check requests
export const CHECK_DETAIL = gql`query checkReqDetail($id: ID!) {
  check_request_detail(id: $id) {
    id
    user_id
    grant_id
    date
    vendor {
      name
      address {
        website
        street
        city
        state
        zip
      }
    }
    description
    purchases {
      amount
      description
      grant_line_item
    }
    receipts
    order_total
    credit_card
    created_at
    action_history {
      id
      created_at
      status
      user_id
    }
    current_status
    is_active
  }
}`;