import { gql } from "@apollo/client";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import createClient from "../../../graphql/client";
import { MileageDetail } from "../../../types/mileage";
import { authOptions } from "../../api/auth/[...nextauth]";
import styles from '../../../styles/Home.module.css';
import { useState } from "react";
import GrantSelect from "../../../components/grantSelect";
import dateFormat from "../../../utils/dateformat";
import { useRouter } from "next/router";
const MILEAGE_DETAIL = gql`query MileageDetail($id: ID!){
    mileage_detail(id: $id) {
      id
      date
      starting_location
      destination
      trip_purpose
      start_odometer
      end_odometer
      tolls
      parking
    }
  }`;
const EDIT_MILEAGE = gql`mutation editMileage($request_id: ID!, $grant_id: ID!, $request: MileageInputType!) {
    edit_mileage(request_id: $request_id, grant_id: $grant_id, request: $request){
        id
        date
        current_status
        action_history {
            id
            created_at
            status
        }
    }
}`;
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { id } = context.query
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const client = createClient(jwt);
    console.log(id)
    const res = await client.query({ query: MILEAGE_DETAIL, variables: { id } })
    return {
        props: {
            recorddata: sessionData ? res.data.mileage_detail : [],
            jwt: jwt ? jwt : ""
        }
    }
}

export default function EditMileage({ recorddata, jwt }: { recorddata: MileageDetail, jwt: string }) {
    const router = useRouter();
    const [requestDate, setDate] = useState(recorddata.date)
    const [purpose, setPurpose] = useState(recorddata.trip_purpose)
    const [start_location, setTripStart] = useState(recorddata.starting_location)
    const [destination, setDestination] = useState(recorddata.destination)
    const [start_odometer, setStart] = useState(recorddata.start_odometer)
    const [end_odometer, setEnd] = useState(recorddata.end_odometer)
    const [tolls, setTolls] = useState(recorddata.tolls)
    const [parking, setParking] = useState(recorddata.parking)
    const [grantID, setGrantID] = useState(recorddata.grant_id)
    const checkOdo = () => { start_odometer >= end_odometer && alert('start mileage is too high and/or end mileage is too low') }
    const editSubmit = async (e: any) => {
        e.preventDefault();
        const client = createClient(jwt);
        const res = await client.mutate({
            mutation: EDIT_MILEAGE,
            variables: {
                request_id: recorddata.id,
                grant_id: grantID,
                request: {
                    date: requestDate,
                    start_odometer: start_odometer,
                    end_odometer: end_odometer,
                    trip_purpose: purpose,
                    starting_location: start_location,
                    destination: destination,
                    tolls: tolls,
                    parking: parking
                }
            }
        })
        res.data.edit_mileage.id ? router.push(`/mileage/detail/${res.data.edit_mileage.id}`) : null;
    }
    return <main className={styles.main}>
        <form id="mileage-form">
            {/* <GrantSelect state={grantID} setState={setGrantID} /> */}
            <h4>Trip Date {dateFormat(requestDate)}</h4>
            <input type="date" value={requestDate} name="date" onChange={(e: any) => setDate(new Date(e.target.value).toISOString())} />
            <h4>Starting Location</h4>
            <input name="starting_location" value={start_location} id="start" maxLength={50} type="text" onChange={(e: any) => setTripStart(e.target.value)} />
            <br />
            <span>{start_location.length}/50 characters</span>
            <h4>Destination</h4>
            <input name="destination" id="end" value={destination} maxLength={50} type="text" onChange={(e: any) => setDestination(e.target.value)} />
            <br />
            <span>{destination.length}/50 characters</span>
            <h4>Description</h4>
            <textarea rows={5} maxLength={75} name="description" value={purpose} onChange={(e: any) => setPurpose(e.target.value)} />
            <br />
            <span>{purpose.length}/75 characters</span>
            <h4>Start Odometer</h4>
            <input name="start_odometer" value={start_odometer} max={end_odometer - 1} type="number" onChange={(e: any) => setStart(parseInt(e.target.value))} />
            <h4>End Odometer</h4>
            <input name="end_odometer" value={end_odometer} type="number" min={start_odometer + 1} onChange={(e: any) => setEnd(parseInt(e.target.value))} onBlur={checkOdo} />
            <h4>Tolls</h4>
            <input name="tolls" type="number" value={tolls} onChange={(e: any) => setTolls(parseFloat(e.target.value))} />
            <h4>Parking</h4>
            <input name="parking" type="number" value={parking} onChange={(e: any) => setParking(parseFloat(e.target.value))} />
            <br />
            <br />
            <button onClick={editSubmit}>Resubmit Request</button>
        </form>
    </main>
}