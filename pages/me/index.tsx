// import { useSession } from "next-auth/react"
import { ADD_VEHICLE, REMOVE_VEHICLE } from "../../graphql/mutations";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
// import { GET_ME } from "../../graphql/queries";
import { authOptions } from "../api/auth/[...nextauth]";
import { UserOverview, Vehicle } from "../../types/users";
import dateFormat from "../../utils/dateformat";
import { useRouter } from "next/router";
import Link from "next/link";
import { gql } from "@apollo/client";
import createClient from "../../graphql/client";
// import { MileageOverview } from "../../types/mileage";
// import titleCase from "../../utils/titlecase";
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const client = createClient(jwt);
    const GET_MY_INFO = gql`query me {
        me {id, name, last_login, vehicles {id, name, description}, incomplete_actions {request_type, request_id, status, created_at}, incomplete_action_count, role, mileage_requests{requests{id, current_status, date}}, check_requests{requests{id, current_status, date}}}}`
    const res = await client.query({ query: GET_MY_INFO })
    console.log('ssr res', res)
    return {
        props: {
            userdata: sessionData ? res.data.me : [],
            jwt: jwt ? jwt : ""
        }
    }
}
// update query to user specific
export default function MePage({ userdata, jwt }: { userdata: UserOverview, jwt: string }) {
    const router = useRouter();
    const client = createClient(jwt)
    const handleAdd = async (e: any) => {
        e.preventDefault();
        const vehicleData = Object.fromEntries(new FormData(e.target))
        const res = await client.mutate({ mutation: ADD_VEHICLE, variables: { name: vehicleData.name, description: vehicleData.description } })
        console.log(res.data);
    }

    const removeVehicle = async (e: any) => {
        e.preventDefault();
        const vehicle_id = e.target.id;
        console.log(vehicle_id)
        const res = await client.mutate({ mutation: REMOVE_VEHICLE, variables: { vehicle_id } })
        console.log(res.data);
    }
    const showDiv = (e: any) => {
        e.preventDefault()
        document.getElementById('vehicleInput')?.setAttribute('style', 'display: block')
    }
    return <>
        <pre>{JSON.stringify(userdata, null, 2)}</pre>
        {/* <h2>{name}</h2>
        <h3>{role}</h3>
        <h3>Last Login on: {dateFormat(last_login)}</h3>
        <Link href="/me/inbox"><a>{incomplete_action_count} Inbox</a></Link> */}
        {userdata.vehicles.length > 0 && (<h3>Current Vehicles</h3>)}
        {userdata.vehicles?.map((vehicle: Vehicle) => {
            return <div key={vehicle.id}>
                <p>{vehicle.name}, {vehicle.description} <button id={vehicle.id} onClick={removeVehicle}>X</button> </p>
            </div>
        })}
        <button onClick={showDiv}>Add Vehicle</button>
        <form onSubmit={handleAdd} id='vehicleInput'>
            <label>Vehicle Name</label>
            <input type="text" max={20} name="name" />
            <label>Description</label>
            <input type="text" max={40} name="description" />
            <button type="submit">Add</button>
        </form>

        <Link href="/me/mileage"><a><h1>My Mileage</h1></a></Link>
        {userdata.mileage_requests.requests.map((mileage_req: any) => <div key={mileage_req.id}>

            <Link href={`/mileage/detail/${mileage_req.id}`}><a><p>{dateFormat(mileage_req.date)} {mileage_req.current_status}</p></a></Link>
        </div>
        )}

        <Link href="/me/checkRequests"><a><h1>My Check Requests</h1></a></Link>
        {userdata.check_requests.requests.map((check_req: any) => <div key={check_req.id}>

            <Link href={`/check_request/detail/${check_req.id}`}><a><p>{dateFormat(check_req.date)} {check_req.current_status}</p></a></Link>
        </div>
        )}

        {/* <Link href="/me/pettyCash"><a><h1>My Petty Cash</h1></a></Link> */}
    </>
}