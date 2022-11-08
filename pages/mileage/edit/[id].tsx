import { NextApiRequest, NextApiResponse } from "next";
import createClient from "../../../graphql/client";
import { MileageDetail } from "../../../types/mileage";
import styles from "../../../styles/Home.module.css";
import { useState } from "react";
import GrantSelect from "../../../components/grantSelect";
import dateFormat from "../../../utils/dateformat";
import { useRouter } from "next/router";
import { EDIT_MILEAGE } from "../../../graphql/mutations";
import { MILEAGE_DETAIL, GET_GRANTS } from "../../../graphql/queries";
import { GrantInfo } from "../../../types/grants";
import CategorySelect from "../../../components/categorySelect";
import { getCookie } from "cookies-next";

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const { id } = req.query;
  const jwt = getCookie("jwt", { req, res });
  const client = createClient(jwt);
  const response = await client.query({ query: MILEAGE_DETAIL, variables: { id } });
  const grants = await client.query({ query: GET_GRANTS });
  return {
    props: {
      recorddata: jwt != undefined ? response.data.mileage_detail : [],
      jwt: jwt ? jwt : "",
      grants: jwt != undefined ? grants.data.all_grants : [],
    },
  };
};

export default function EditMileage({
  recorddata,
  jwt,
  grants,
}: {
  recorddata: MileageDetail;
  jwt: string;
  grants: GrantInfo[];
}) {
  const router = useRouter();
  const [category, setCategory] = useState(recorddata.category);
  const [requestDate, setDate] = useState(recorddata.date);
  const [purpose, setPurpose] = useState(recorddata.trip_purpose);
  const [start_location, setTripStart] = useState(recorddata.starting_location);
  const [destination, setDestination] = useState(recorddata.destination);
  const [start_odometer, setStart] = useState(recorddata.start_odometer);
  const [end_odometer, setEnd] = useState(recorddata.end_odometer);
  const [tolls, setTolls] = useState(recorddata.tolls);
  const [parking, setParking] = useState(recorddata.parking);
  const [grantID, setGrantID] = useState(recorddata.grant_id);
  const checkOdo = () => {
    start_odometer >= end_odometer &&
      alert("start mileage is too high and/or end mileage is too low");
  };
  const editSubmit = async (e: any) => {
    e.preventDefault();
    const client = createClient(jwt);
    const res = await client.mutate({
      mutation: EDIT_MILEAGE,
      variables: {
        request_id: recorddata.id,
        grant_id: grantID,
        request: {
          category: category,
          date: requestDate,
          start_odometer: start_odometer,
          end_odometer: end_odometer,
          trip_purpose: purpose,
          starting_location: start_location,
          destination: destination,
          tolls: tolls,
          parking: parking,
        },
      },
    });
    res.data.edit_mileage.id
      ? router.push(`/mileage/detail/${res.data.edit_mileage.id}`)
      : null;
  };
  return (
    <main className={styles.main}>
      <form id="mileage-form">
        <GrantSelect state={grantID} setState={setGrantID} grants={grants} />
        <CategorySelect state={category} setState={setCategory} />
        <h4>Trip Date {dateFormat(requestDate)}</h4>
        <input
          type="date"
          value={requestDate}
          name="date"
          onChange={(e: any) => setDate(new Date(e.target.value).toISOString())}
        />
        <h4>Starting Location</h4>
        <input
          name="starting_location"
          value={start_location}
          id="start"
          maxLength={50}
          type="text"
          onChange={(e: any) => setTripStart(e.target.value)}
        />
        <br />
        <span>{start_location.length}/50 characters</span>
        <h4>Destination</h4>
        <input
          name="destination"
          id="end"
          value={destination}
          maxLength={50}
          type="text"
          onChange={(e: any) => setDestination(e.target.value)}
        />
        <br />
        <span>{destination.length}/50 characters</span>
        <h4>Description</h4>
        <textarea
          rows={5}
          maxLength={75}
          name="description"
          value={purpose}
          onChange={(e: any) => setPurpose(e.target.value)}
        />
        <br />
        <span>{purpose.length}/75 characters</span>
        <h4>Start Odometer</h4>
        <input
          name="start_odometer"
          value={start_odometer}
          max={end_odometer - 1}
          type="number"
          onChange={(e: any) => setStart(parseInt(e.target.value))}
        />
        <h4>End Odometer</h4>
        <input
          name="end_odometer"
          value={end_odometer}
          type="number"
          min={start_odometer + 1}
          onChange={(e: any) => setEnd(parseInt(e.target.value))}
          onBlur={checkOdo}
        />
        <h4>Tolls</h4>
        <input
          name="tolls"
          type="number"
          value={tolls}
          onChange={(e: any) => setTolls(parseFloat(e.target.value))}
        />
        <h4>Parking</h4>
        <input
          name="parking"
          type="number"
          value={parking}
          onChange={(e: any) => setParking(parseFloat(e.target.value))}
        />
        <div className="hr" />
        <br />
        <button onClick={editSubmit}>Resubmit Request</button>
      </form>
    </main>
  );
}
