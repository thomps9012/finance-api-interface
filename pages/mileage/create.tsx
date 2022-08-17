import { useMutation } from "@apollo/client"
import { useRouter } from "next/router";
import { useState } from "react";
import { CREATE_MILEAGE } from "../../graphql/mutations"

export default function CreateRequest() {
    const router = useRouter();
    const [addRequest, { data, loading, error }] = useMutation(CREATE_MILEAGE);
    const [requestDate, setDate] = useState("")
    const [purpose, setPurpose] = useState("")
    const [start_location, setTripStart] = useState("")
    const [destination, setDestination] = useState("")
    const [start_odometer, setStart] = useState(0)
    const [end_odometer, setEnd] = useState(start_odometer + 1)
    const [tolls, setTolls] = useState(0.0)
    const [parking, setParking] = useState(0.0)
    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;
    const checkOdo = () => { start_odometer >= end_odometer && alert('start mileage is too high and/or end mileage is too low') }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (start_odometer >= end_odometer) { alert('start mileage is too high and/or end mileage is too low'); return }
        const testUserID = "68125e1f-21c1-4f60-aab0-8efff5dc158e";
        addRequest({
            variables: {
                user_id: testUserID,
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
        data && router.push("/")
    }
    return <form id="mileage-form">
        <h4>Trip Date</h4>
        <input type="date" name="date" onChange={(e: any) => setDate(new Date(e.target.value).toISOString())} />
        <h4>Starting Location</h4>
        <input name="starting_location" id="start" maxLength={50} type="text" onChange={(e: any) => setTripStart(e.target.value)} />
        <span>{start_location.length}/50 characters</span>
        <h4>Destination</h4>
        <input name="destination" id="end" maxLength={50} type="text" onChange={(e: any) => setDestination(e.target.value)} />
        <span>{destination.length}/50 characters</span>
        <h4>Description</h4>
        <textarea rows={5} maxLength={75} name="description" value={purpose} onChange={(e: any) => setPurpose(e.target.value)} />
        <span>{purpose.length}/75 characters</span>
        <h4>Start Odometer</h4>
        <input name="start_odometer" max={end_odometer - 1} type="number" onChange={(e: any) => setStart(parseInt(e.target.value))} />
        <h4>End Odometer</h4>
        <input name="end_odometer" type="number" min={start_odometer + 1} onChange={(e: any) => setEnd(parseInt(e.target.value))} onBlur={checkOdo} />
        <h4>Tolls</h4>
        <input name="tolls" type="number" onChange={(e: any) => setTolls(parseFloat(e.target.value))} />
        <h4>Parking</h4>
        <input name="parking" type="number" onChange={(e: any) => setParking(parseFloat(e.target.value))} />
        <button onClick={handleSubmit}>Submit Mileage Request</button>
    </form>
}