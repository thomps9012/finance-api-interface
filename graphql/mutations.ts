import { gql } from "@apollo/client";

// user
export const LOGIN =  gql `
mutation Login($id: String!, $email: String!, $name: String!, $permissions: String!, $admin: Boolean!) {
  login(id: $id, name: $name, email: $email, permissions: $permissions, admin: $admin)
}
`

export const CLEAR_NOTIFICATION = gql`
  mutation ClearSingleNotification($id: ID!) {
    clear_notification(notification_id: $id)
  }
`;
export const CLEAR_ALL_NOTIFICATIONS = gql`
  mutation ClearAllNotifications {
    clear_all_notifications
  }
`;
export const ADD_VEHICLE = gql`
  mutation addVehicle($name: String!, $description: String!) {
    add_vehicle(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;
export const REMOVE_VEHICLE = gql`
  mutation removeVehicle($vehicle_id: ID!) {
    remove_vehicle(vehicle_id: $vehicle_id)
  }
`;

// mileage
export const CREATE_MILEAGE = gql`
  mutation createRequest($request: mileage_input!, $grant_id: ID!) {
    create_mileage(request: $request, grant_id: $grant_id) {
      id
      created_at
      current_status
      current_user
    }
  }
`;
export const EDIT_MILEAGE = gql`
  mutation EditMileage(
    $request_id: ID!
    $request: mileage_input!
    $grant_id: ID!
  ) {
    edit_mileage(
      request: $request
      request_id: $request_id
      grant_id: $grant_id
    ) {
      id
      current_user
      current_status
      action_history {
        id
        user
        status
        created_at
      }
    }
  }
`;
export const APPROVE_MILEAGE = gql`
  mutation ApproveMileage(
    $request_id: ID!
    $request_category: request_category!
    $new_status: request_status!
    $exec_review: Boolean!
  ) {
    approve_request(
      new_status: $new_status
      exec_review: $exec_review
      request_id: $request_id
      request_type: MILEAGE
      request_category: $request_category
    )
  }
`;
export const REJECT_MILEAGE = gql`
  mutation RejectMileage($request_id: ID!) {
    reject_request(request_id: $request_id, request_type: MILEAGE)
  }
`;
export const ARCHIVE_MILEAGE = gql`
  mutation archiveRequest($request_id: ID!) {
    archive_request(request_id: $request_id, request_type: MILEAGE)
  }
`;

// petty cash
export const CREATE_PETTY_CASH = gql`
  mutation createRequest($request: petty_cash_input!, $grant_id: ID!) {
    create_petty_cash(request: $request, grant_id: $grant_id) {
      id
      created_at
      current_status
      current_user
    }
  }
`;
export const EDIT_PETTY_CASH = gql`
  mutation UpdatePettyCash(
    $request_id: ID!
    $request: petty_cash_input
    $grant_id: ID!
  ) {
    edit_petty_cash(
      request_id: $request_id
      request: $request
      grant_id: $grant_id
    ) {
      id
      current_user
      current_status
      action_history {
        id
        status
        user
        created_at
      }
    }
  }
`;
export const APPROVE_PETTY_CASH = gql`
  mutation ApprovePettyCash(
    $request_id: ID!
    $request_category: request_category!
    $new_status: request_status!
    $exec_review: Boolean!
  ) {
    approve_request(
      request_id: $request_id
      request_type: PETTY_CASH
      exec_review: $exec_review
      new_status: $new_status
      request_category: $request_category
    )
  }
`;
export const REJECT_PETTY_CASH = gql`
  mutation RejectPettyCash($request_id: ID!) {
    reject_request(request_id: $request_id, request_type: PETTY_CASH)
  }
`;
export const ARCHIVE_PETTY_CASH = gql`
  mutation archiveRequest($request_id: ID!) {
    archive_request(request_id: $request_id, request_type: PETTY_CASH)
  }
`;

// check request
export const CREATE_CHECK_REQ = gql`
  mutation createRequest(
    $grant_id: ID!
    $request: check_request_input!
    $vendor: vendor_input!
  ) {
    create_check_request(
      request: $request
      vendor: $vendor
      grant_id: $grant_id
    ) {
      id
      created_at
      current_status
      current_user
    }
  }
`;
export const EDIT_CHECK_REQ = gql`
  mutation EditCheckRequest(
    $request_id: ID!
    $request: check_request_input
    $grant_id: ID!
  ) {
    edit_check_request(
      request_id: $request_id
      request: $request
      grant_id: $grant_id
    ) {
      id
      current_user
      current_status
      action_history {
        id
        status
        user
        created_at
      }
    }
  }
`;
export const APPROVE_CHECK_REQUEST = gql`
  mutation ApproveCheckRequest(
    $request_id: ID!
    $request_category: request_category!
    $new_status: request_status!
    $exec_review: Boolean!
  ) {
    approve_request(
      request_id: $request_id
      request_type: CHECK
      request_category: $request_category
      new_status: $new_status
      exec_review: $exec_review
    )
  }
`;
export const REJECT_CHECK_REQUEST = gql`
  mutation RejectCheckRequest($request_id: ID!) {
    reject_request(request_id: $request_id, request_type: CHECK)
  }
`;
export const ARCHIVE_CHECK_REQUEST = gql`
  mutation archiveRequest($request_id: ID!) {
    archive_request(request_id: $request_id, request_type: CHECK)
  }
`;
