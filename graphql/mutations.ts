import { gql } from '@apollo/client';

// user
// export const CREATE_USER = gql``;

// mileage

// petty cash
export const CREATE_PETTY_CASH = gql`mutation createRequest($user_id: ID!, $request: PettyCashInput!, $grant_id: ID!) {
    create_petty_cash(request: $request, user_id: $user_id, grant_id: $grant_id) {
      id
      created_at
    }
  }`;

// check request
export const CREATE_CHECK_REQ = gql`mutation createRequest($user_id: ID!, $request: CheckRequestInput!, $vendor: VendorInput!) {
  create_check_request(request: $request, user_id: $user_id, vendor: $vendor) {
    id
    created_at
    current_status
  }
}`