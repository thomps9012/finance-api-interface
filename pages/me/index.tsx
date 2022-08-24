import { useSession } from "next-auth/react"
import { useMutation } from "@apollo/client";
import { ADD_VEHICLE, REMOVE_VEHICLE } from "../../graphql/mutations";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import createClient from "../../graphql/client";
import { GET_ME } from "../../graphql/queries";
import { authOptions } from "../api/auth/[...nextauth]";
import { UserOverview, Vehicle } from "../../types/users";
import dateFormat from "../../utils/dateformat";
import { useRouter } from "next/router";
import Link from "next/link";
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    console.log(sessionData?.Authorization, '\n sessionData JWT')
    const client = createClient(sessionData?.Authorization);
    const res = await client.query({ query: GET_ME, fetchPolicy: 'no-cache' })
    console.log(res.data, "userdata on server")
    return {
        props: {
            userdata: sessionData ? res.data.me : []
        }
    }
}
// update query to user specific
export default function MePage({ userdata }: { userdata: UserOverview }) {
    const router = useRouter();
    // console.log(userdata)
    const { vehicles, last_login, name, role, incomplete_action_count, incomplete_actions } = userdata;
    const { data } = useSession()
    const [addVehicle, { data: addData, loading: addLoading, error: addErr }] = useMutation(ADD_VEHICLE)
    const [removeVehicle, { data: removeData, loading: removeLoading, error: removeErr }] = useMutation(REMOVE_VEHICLE)
    if (addLoading || removeLoading) return 'Submitting...';
    if (addErr || removeErr) return `Submission error! ${addErr?.message || removeErr?.message}`;
    const handleAdd = async (e: any) => {
        const vehicleData = Object.fromEntries(new FormData(e.target))
        await addVehicle({
            variables: {
                name: vehicleData.name,
                description: vehicleData.description
            }
        })
        addData.add_vehicle.id && document.getElementById('vehicleInput')?.setAttribute('style', 'display: none')
        addData.add_vehicle.id && router.reload()
    }
    removeData?.remove_vehicle && router.reload();
    const showDiv = (e: any) => {
        e.preventDefault()
        document.getElementById('vehicleInput')?.setAttribute('style', 'display: block')
    }
    return <>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <h2>{name}</h2>
        <h3>{role}</h3>
        <h3>Last Login on: {dateFormat(last_login)}</h3>
        <Link href="/me/inbox"><a>{incomplete_action_count} Inbox</a></Link>
        {vehicles.length > 0 && (<h3>Current Vehicles</h3>)}
        {vehicles?.map((vehicle: Vehicle) => {
            return <div key={vehicle.id}>
                <p>{vehicle.name}</p>
                <p>{vehicle.description}</p>
                <button onClick={() => removeVehicle({ variables: { vehicle_id: vehicle.id } })}>X</button>
            </div>
        })}
        <button onClick={showDiv}>Add Vehicle</button>
        <form onSubmit={handleAdd} id='vehicleInput'>
            <label>Vehicle Name</label>
            <input type="text" max={20} name="name" />
            <label>Vehicle Name</label>
            <input type="text" max={40} name="description" />
            <button type="submit">Add</button>
        </form>

        <Link href="/me/mileage"><a><h1>My Mileage</h1></a></Link>

        <Link href="/me/checkRequests"><a><h1>My Check Requests</h1></a></Link>

        {/* <Link href="/me/pettyCash"><a><h1>My Petty Cash</h1></a></Link> */}
    </>
}