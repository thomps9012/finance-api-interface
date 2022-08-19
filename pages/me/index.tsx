import { useSession } from "next-auth/react"
import { useMutation } from "@apollo/client";
import { ADD_VEHICLE, REMOVE_VEHICLE } from "../../graphql/mutations";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import client from "../../graphql/client";
import { GET_ME } from "../../graphql/queries";
import { authOptions } from "../api/auth/[...nextauth]";
import { UserOverview, Vehicle } from "../../types/users";
import dateFormat from "../../utils/dateformat";
import { useRouter } from "next/router";
import Link from "next/link";
const testUserID = '68125e1f-21c1-4f60-aab0-8efff5dc158e'
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    // update query to user specific
    const res = await client.query({ query: GET_ME, variables: { id: testUserID }, fetchPolicy: 'no-cache' })
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
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
        addData.add_vehicle.id && router.reload()
    }
    removeData?.remove_vehicle && router.reload();
    return <>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <h2>{name}</h2>
        <h3>{role}</h3>
        <h3>{incomplete_action_count} New Item Actions Since Last Login on: {dateFormat(last_login)}</h3>
        {/* {incomplete_actions?.map((action_id: string) => {
            return <div key={action_id}>
                <Link href={`/${item_type}/detail/${item_id}`}>
                    <a>{item_type} {created_at}</a>
                </Link>
            </div>
        })} */}
        <h3>Current Vehicles</h3>
        {vehicles?.map((vehicle: Vehicle) => {
            return <div key={vehicle.id}>
                <p>{vehicle.name}</p>
                <p>{vehicle.description}</p>
                <button onClick={() => removeVehicle({ variables: { vehicle_id: vehicle.id } })}>X</button>
            </div>
        })}
        <form onSubmit={handleAdd}>
            <label>Vehicle Name</label>
            <input type="text" max={20} name="name" />
            <label>Vehicle Name</label>
            <input type="text" max={40} name="description" />
            <button type="submit">Add Vehicle</button>
        </form>
        
        <Link href="/me/mileage"><a><h1>My Mileage</h1></a></Link>
        
        <Link href="/me/checkRequests"><a><h1>My Check Requests</h1></a></Link>
        
        <Link href="/me/pettyCash"><a><h1>My Petty Cash</h1></a></Link>
    </>
}