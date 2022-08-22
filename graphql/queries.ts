import { gql } from '@apollo/client';
// user
export const GET_MY_INBOX = gql`query me {
  me {
    id
    name
    manager_id
    last_login
    incomplete_action_count
    incomplete_actions {
      id
      status
      user {
        id
        name
      }
      request_id
      request_type
      created_at
    }
    }
}`
export const GET_ME = gql`query me {
  me {
    id
    name
    manager_id
    last_login
    incomplete_action_count
    vehicles {
      id
      name
      description
    }
    mileage_requests {
      mileage
      parking
      tolls
      requests {
        id
        current_status
        date
      }
      reimbursement
    }
    check_requests {
      vendors {
        name
      }
      requests {
        id
        current_status
        date
      }
      total_amount
    }
    petty_cash_requests {
      requests {
        id
        current_status
        date
      }
      total_amount
    }
  }
}`
export const GET_MY_MILEAGE = gql`
query me {
  me {
    id
    name
    last_login
    mileage_requests {
      mileage
      parking
      tolls
      requests {
        id
        current_status
        date
      }
      reimbursement
    }
  }
}
`;
export const GET_MY_PETTY_CASH = gql`query me {
  me {
    id
    name
    last_login
    petty_cash_requests {
      requests {
        id
        current_status
        date
      }
      total_amount
    }
  }
}`;
export const GET_MY_CHECKS = gql`query me {
  me {
    id
    name
    last_login
    check_requests {
      vendors {
        name
      }
      requests {
        id
        current_status
        date
      }
      total_amount
    }
  }
}
`;
export const ALL_USERS = gql`query{all_users{id manager_id name role email}}`;
export const USER_OVERVIEW = gql`query userOverview($id: ID!){
  user_overview(id: $id){
    id
    manager_id
    name
    role
    last_login
    incomplete_action_count
    mileage_requests {
        mileage
        parking
        tolls
        requests {
          id
          current_status
          date
        }
        reimbursement
      }
      check_requests {
        vendors {
          name
        }
        requests {
          id
          current_status
          date
        }
        total_amount
      }
      petty_cash_requests {
        requests {
          id
          current_status
          date
        }
        total_amount
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
      status
      user {
        id
        name
      }
      created_at
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
      status
      user {
        id
        name
      }
      created_at
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
      status
      user {
        id
        name
      }
      created_at
    }
    current_status
    is_active
  }
}`;