import { gql } from '@apollo/client';

// user
export const SIGN_IN = gql`mutation signIn($id: ID!, $email:String!, $name:String!) {
  sign_in(id:$id, email:$email,name:$name)
}`;
// export const CREATE_USER = gql``;
export const ADD_VEHICLE = gql`mutation addVehicle($user_id: ID!, $name: String!, $description: String!){
  add_vehicle(user_id: $user_id, name: $name, description: $description) {
    id
    name
    description
  }
}`;
export const REMOVE_VEHICLE = gql`mutation removeVehicle($user_id: ID!, $vehicle_id: ID!){
  remove_vehicle(user_id: $user_id, vehicle_id: $vehicle_id)
}`;

// mileage
export const CREATE_MILEAGE = gql`mutation createRequest($user_id: ID!, $request: MileageInputType!) {
  create_mileage(request: $request, user_id: $user_id) {
    id
    created_at
    current_status
  }
}`

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