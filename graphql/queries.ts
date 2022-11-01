import { gql } from "@apollo/client";
// user
export const GET_MY_INBOX = gql`
  query me {
    me {
      id
      name
      last_login
      incomplete_action_count
      incomplete_actions {
        id
        request_id
        request_type
        status
        created_at
        user
      }
    }
  }
`;
export const GET_NOTIFICATIONS = gql`
  query me {
    me {
      id
      name
      last_login
      incomplete_action_count
    }
  }
`;
export const GET_MY_INFO = gql`
  query me {
    me {
      id
      permissions
      mileage_requests {
        mileage
        reimbursement
        total_requests
      }
      petty_cash_requests {
        total_amount
        total_requests
      }
      check_requests {
        total_requests
        total_amount
      }
      incomplete_action_count
      vehicles {
        id
        name
      }
    }
  }
`;
export const ALL_USERS = gql`
  query AllUsers {
    all_users {
      id
      name
      admin
      permissions
      email
      last_login
      is_active
    }
  }
`;
export const USER_OVERVIEW = gql`
  query UserOverview($id: ID!) {
    user_overview(id: $id) {
      id
      name
      admin
      permissions
      incomplete_action_count
      last_login
      mileage_requests {
        mileage
        total_requests
        last_request {
          id
          current_status
          date
          created_at
          is_active
        }
      }
      check_requests {
        total_amount
        total_requests
        last_request {
          id
          current_status
          date
          created_at
          is_active
        }
      }
      petty_cash_requests {
        total_amount
        total_requests
        last_request {
          id
          current_status
          date
          created_at
          is_active
        }
      }
    }
  }
`;
export const GET_USER_CHECK_REQUESTS = gql`
  query SingleUserCheckRequests(
    $id: ID!
    $start_date: String
    $end_date: String
  ) {
    user_check_requests(id: $id, start_date: $start_date, end_date: $end_date) {
      __typename
      user {
        id
        name
      }
      total_amount
      requests {
        id
        date
        category
        created_at
        order_total
        current_user
        current_status
        is_active
      }
    }
  }
`;
export const GET_USER_PETTY_CASH = gql`
  query UserPettyCash($user_id: ID!, $start_date: String, $end_date: String) {
    user_petty_cash_requests(
      user_id: $user_id
      start_date: $start_date
      end_date: $end_date
    ) {
      user {
        id
        name
      }
      total_amount
      requests {
        id
        date
        created_at
        amount
        current_user
        current_status
        category
        is_active
      }
    }
  }
`;
export const GET_USER_MILEAGE = gql`
  query UserMileage($id: ID!, $start_date: String, $end_date: String) {
    user_mileage(id: $id, start_date: $start_date, end_date: $end_date) {
      reimbursement
      mileage
      tolls
      parking
      user {
        id
        name
      }
      requests {
        id
        date
        reimbursement
        current_user
        current_status
        created_at
        category
        is_active
      }
    }
  }
`;
// // mileage
export const MILEAGE_DETAIL = gql`
  query MileageDetail($id: ID!) {
    mileage_detail(id: $id) {
      action_history {
        id
        status
        created_at
        user
      }
      category
      created_at
      current_status
      date
      destination
      end_odometer
      grant_id
      id
      is_active
      parking
      reimbursement
      starting_location
      start_odometer
      tolls
      trip_mileage
      trip_purpose
      user_id
    }
  }
`;
export const MILEAGE_OVERVIEW = gql`
  query MileageOverview {
    mileage_overview {
      id
      user {
        id
        name
      }
      grant_id
      created_at
      current_status
      date
      is_active
      reimbursement
      trip_mileage
    }
  }
`;
export const MONTHLY_MILEAGE = gql`
  query MonthlyMileageReport($month: Int!, $year: Int!) {
    mileage_monthly_report(month: $month, year: $year) {
      month
      year
      mileage
      name
      parking
      reimbursement
      tolls
      parking
      requests {
        id
        date
      }
    }
  }
`;
export const GRANT_MILEAGE = gql`
  query GrantMileageReport(
    $grant_id: ID!
    $start_date: String
    $end_date: String
  ) {
    grant_mileage_report(
      grant_id: $grant_id
      start_date: $start_date
      end_date: $end_date
    ) {
      grant {
        id
        name
      }
      mileage
      reimbursement
      parking
      tolls
      requests {
        id
        date
      }
    }
  }
`;
// // petty cash
export const PETTY_CASH_DETAIL = gql`
  query PettyCashRecordDetail($id: ID!) {
    petty_cash_detail(id: $id) {
      action_history {
        id
        status
        created_at
        user
      }
      amount
      category
      created_at
      current_user
      current_status
      date
      description
      grant_id
      id
      is_active
      receipts
      user_id
    }
  }
`;
export const PETTY_CASH_OVERVIEW = gql`
  query PettyCashOverview {
    petty_cash_overview {
      id
      user {
        id
        name
      }
      grant {
        id
        name
      }
      current_status
      is_active
      date
      amount
    }
  }
`;
export const GRANT_PETTY_CASH = gql`
  query AllPettyCash($grant_id: ID!, $start_date: String, $end_date: String) {
    grant_petty_cash_requests(
      grant_id: $grant_id
      start_date: $start_date
      end_date: $end_date
    ) {
      grant {
        id
        name
      }
      total_amount
      total_requests
      requests {
        id
        is_active
        current_status
        created_at
        user_id
        amount
        category
        created_at
        description
        date
        receipts
        user_id
      }
    }
  }
`;

// // check requests
export const CHECK_DETAIL = gql`
  query CheckRequestRecordDetail($id: ID!) {
    check_request_detail(id: $id) {
      id
      category
      created_at
      user_id
      purchases {
        amount
        description
        grant_line_item
      }
      action_history {
        id
        status
        created_at
        user
      }
      vendor {
        name
        address {
          street
          city
          state
          zip
          website
        }
      }
      credit_card
      date
      description
      grant_id
      order_total
      receipts
    }
  }
`;
export const CHECK_REQUEST_OVERVIEW = gql`
  query CheckRequestOverview {
    check_request_overview {
      id
      grant {
        id
        name
      }
      user {
        id
        name
      }
      is_active
      current_status
      created_at
      date
      order_total
    }
  }
`;
export const GRANT_CHECK_REQUEST = gql`
  query CheckRequestByGrant(
    $grant_id: ID!
    $start_date: String
    $end_date: String
  ) {
    grant_check_requests(
      grant_id: $grant_id
      start_date: $start_date
      end_date: $end_date
    ) {
      vendors {
        name
        address {
          street
          city
          state
          zip
          website
        }
      }
      grant {
        id
        name
      }
      total_amount
      total_requests
      requests {
        id
        is_active
        current_status
        created_at
        user_id
        category
        purchases {
          amount
          description
          grant_line_item
        }
        order_total
        category
        credit_card
      }
    }
  }
`;
