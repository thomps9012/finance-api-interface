import { gql } from '@apollo/client';

// user
export const SIGN_IN = gql`mutation signIn($id: ID!, $email:String!, $name:String!) {
  sign_in(id:$id, email:$email,name:$name)
}`;
// export const CREATE_USER = gql``;
export const ADD_VEHICLE = gql`mutation addVehicle($name: String!, $description: String!){
  add_vehicle(name: $name, description: $description) {
    id
    name
    description
  }
}`;
export const REMOVE_VEHICLE = gql`mutation removeVehicle($vehicle_id: ID!){
  remove_vehicle(vehicle_id: $vehicle_id)
}`;

// mileage
export const CREATE_MILEAGE = gql`mutation createRequest($request: MileageInputType!, $grant_id: ID!) {
  create_mileage(request: $request, grant_id: $grant_id) {
    id
    created_at
    current_status
  }
}`

// petty cash
export const CREATE_PETTY_CASH = gql`mutation createRequest($request: PettyCashInput!, $grant_id: ID!) {
    create_petty_cash(request: $request, grant_id: $grant_id) {
      id
      created_at
    }
  }`;

// check request
export const CREATE_CHECK_REQ = gql`mutation createRequest($grant_id: ID!, $request: CheckRequestInput!, $vendor: VendorInput!) {
  create_check_request(request: $request, vendor: $vendor, grant_id: $grant_id) {
    id
    created_at
    current_status
  }
}`

// actions
export const APPROVE_REQUEST = gql`mutation approveRequest($request_id: ID!, $request_type: String!) {
  approve_request(request_id: $request_id, request_type: $request_type)
}`;
export const REJECT_REQUEST = gql`mutation rejectRequest($request_id: ID!, $request_type: String!) {
  reject_request(request_id: $request_id, request_type: $request_type)
}`;
export const ARCHIVE_REQUEST = gql`mutation archiveRequest($request_id: ID!, $request_type: String!) {
  archive_request(request_id: $request_id, request_type: $request_type)
}`