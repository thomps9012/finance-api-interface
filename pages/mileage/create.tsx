import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import CategorySelect from "../../components/categorySelect";
import GrantSelect from "../../components/grantSelect";
import createClient from "../../graphql/client";
import { CREATE_MILEAGE } from "../../graphql/mutations";
import { GET_GRANTS } from "../../graphql/queries";
import styles from "../../styles/Home.module.css";
import { GrantInfo } from "../../types/grants";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const sessionData = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  const jwt = sessionData?.user.token;
  const client = createClient(jwt);
  const res = await client.query({ query: GET_GRANTS });
  return {
    props: {
      grant_data: sessionData ? res.data.all_grants : [],
      jwt: jwt ? jwt : "",
    },
  };
};
export default function CreateRequest({
  grant_data,
}: {
  grant_data: GrantInfo[];
}) {
  const router = useRouter();
  const { data } = useSession();
  const jwt = data?.user.token;
  const [requestDate, setDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [start_location, setTripStart] = useState("");
  const [destination, setDestination] = useState("");
  const [start_odometer, setStart] = useState(0);
  const [end_odometer, setEnd] = useState(start_odometer + 1);
  const [tolls, setTolls] = useState(0.0);
  const [parking, setParking] = useState(0.0);
  const [grantID, setGrantID] = useState("");
  const [category, setCategory] = useState("");
  const checkOdo = () => {
    start_odometer >= end_odometer &&
      alert("start mileage is too high and/or end mileage is too low");
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (category === "") {
      alert("select a category");
      return;
    }
    if (grantID === "") {
      alert("select a grant");
      return;
    }
    if (requestDate === "") {
      alert("enter valid request date");
      return;
    }
    if (purpose === "") {
      alert("enter valid trip purpose");
      return;
    }
    if (start_location === "") {
      alert("enter valid start location");
      return;
    }
    if (destination === "") {
      alert("enter valid destination");
      return;
    }
    const client = createClient(jwt);
    const res = await client.mutate({
      mutation: CREATE_MILEAGE,
      variables: {
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
    res.data.create_mileage.created_at ? router.push("/me") : null;
  };
  return (
    <main className={styles.container}>
       <h1>New Mileage request</h1>
      <form id="mileage-form">
        <GrantSelect
          state={grantID}
          setState={setGrantID}
          grants={grant_data}
        />
        <CategorySelect state={category} setState={setCategory} />
        <h4>Trip Date</h4>
        <input
          type="date"
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
        <span>{destination.length}/50 characters</span>
        <h4>Trip Description</h4>
        <textarea
          rows={5}
          maxLength={75}
          name="description"
          value={purpose}
          onChange={(e: any) => setPurpose(e.target.value)}
        />
        <span>{purpose.length}/75 characters</span>
        <div className="hr" />
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
        <button onClick={handleSubmit}>Submit Request</button>
      </form>
    </main>
  );
}
