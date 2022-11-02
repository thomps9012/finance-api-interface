import { ADD_VEHICLE, REMOVE_VEHICLE } from "../../graphql/mutations";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { UserOverview, Vehicle } from "../../types/users";
import dateFormat from "../../utils/dateformat";
import { useRouter } from "next/router";
import Link from "next/link";
import createClient from "../../graphql/client";
import styles from "../../styles/Home.module.css";
import { GET_MY_INFO } from "../../graphql/queries";

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
  const res = await client.query({ query: GET_MY_INFO });
  console.log("ssr res", res);
  return {
    props: {
      userdata: sessionData ? res.data.me : [],
      jwt: jwt ? jwt : "",
    },
  };
};
export default function MePage({
  userdata,
  jwt,
}: {
  userdata: UserOverview;
  jwt: string;
}) {
  const router = useRouter();
  const client = createClient(jwt);
  const handleAdd = async (e: any) => {
    e.preventDefault();
    const vehicleData = Object.fromEntries(new FormData(e.target));
    var inputs = e.target.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
    }
    const res = await client.mutate({
      mutation: ADD_VEHICLE,
      variables: {
        name: vehicleData.name,
        description: vehicleData.description,
      },
    });
    res.data.add_vehicle ? router.push("/me") : null;
  };

  const removeVehicle = async (vehicle_id: string) => {
    console.log(vehicle_id);
    const res = await client.mutate({
      mutation: REMOVE_VEHICLE,
      variables: { vehicle_id },
    });
    res.data.remove_vehicle ? router.push("/me") : null;
  };
  const { mileage_requests, vehicles, check_requests, petty_cash_requests } =
    userdata;
  return (
    <main className={styles.container}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <div style={{ padding: 20 }}>
          {vehicles?.length > 0 && <h2>Current Vehicles</h2>}
          {vehicles?.map((vehicle: Vehicle) => {
            const { id, name, description } = vehicle;
            return (
              <a onClick={() => removeVehicle(id)} key={id}>
                <h1 className="remove">X</h1>
                <div style={{ textAlign: "left" }}>
                  <h3>{name}</h3>
                  <h4>{description}</h4>
                  <hr />
                </div>
              </a>
            );
          })}
        </div>
        <form onSubmit={handleAdd} id="vehicleInput">
          <h2>Add Vehicle</h2>
          <label>Name</label>
          <input type="text" max={20} name="name" />
          <label>Description</label>
          <input type="text" max={40} name="description" />
          <br />
          <button
            type="submit"
            className="submit"
            style={{ padding: 10, margin: 10 }}
          >
            Add Vehicle
          </button>
        </form>
        <div style={{
          marginTop: 100,
          textAlign: 'right',
          color: 'cadetblue',
          maxWidth: '30%',
          fontSize: 30
        }}>
          <a href="/directDeposit.pdf" download>
            <h3>Download Direct Deposit Form</h3>
          </a>
        </div>
      </div>
      <div className="hr" />
      <div
        style={{
          margin: 10,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flexDirection: "column" }}>
          <h3>Mileage</h3>
          {mileage_requests.total_requests > 0 ? (
            <>
              <Link href={`/me/mileage`}>
                <a>View All</a>
              </Link>
              <p>{mileage_requests.total_requests} Total Requests</p>
              <Link
                href={`/mileage/detail/${mileage_requests.last_request.id}`}
              >
                <a>
                  <h4>Most Recent Request</h4>
                </a>
              </Link>
              <h3 className={mileage_requests.last_request.current_status}>
                {mileage_requests.last_request.current_status
                  .split("_")
                  .join(" ")}
              </h3>
              <p>Date - {dateFormat(mileage_requests.last_request.date)}</p>
              <p>
                Created - {dateFormat(mileage_requests.last_request.created_at)}
              </p>
            </>
          ) : (
            <p className="ARCHIVED">
              {mileage_requests.total_requests} Total Requests
            </p>
          )}
        </div>
        <div style={{ flexDirection: "column" }}>
          <h3>Check Requests</h3>
          {check_requests.total_requests > 0 ? (
            <>
              <Link href={`/me/checkRequests`}>
                <a>View All</a>
              </Link>
              <p>{check_requests.total_requests} Total Requests</p>
              <Link
                href={`/check_request/detail/${check_requests.last_request.id}`}
              >
                <a>
                  <h4>Most Recent Request</h4>
                </a>
              </Link>
              <h3 className={check_requests.last_request.current_status}>
                {check_requests.last_request.current_status
                  .split("_")
                  .join(" ")}
              </h3>
              <p>Date - {dateFormat(check_requests.last_request.date)}</p>
              <p>
                Created - {dateFormat(check_requests.last_request.created_at)}
              </p>
            </>
          ) : (
            <p className="ARCHIVED">
              {check_requests.total_requests} Total Requests
            </p>
          )}
        </div>
        <div style={{ flexDirection: "column" }}>
          <h3>Petty Cash Requests</h3>
          {petty_cash_requests.total_requests > 0 ? (
            <>
              <Link href={`/me/pettyCash`}>
                <a>View All</a>
              </Link>
              <p>{petty_cash_requests.total_requests} Total Requests</p>
              <Link
                href={`/petty_cash/detail/${petty_cash_requests.last_request.id}`}
              >
                <a>
                  <h4>Most Recent Request</h4>
                </a>
              </Link>
              <h3 className={petty_cash_requests.last_request.current_status}>
                {petty_cash_requests.last_request.current_status
                  .split("_")
                  .join(" ")}
              </h3>
              <p>Date - {dateFormat(petty_cash_requests.last_request.date)}</p>
              <p>
                Created -{" "}
                {dateFormat(petty_cash_requests.last_request.created_at)}
              </p>
            </>
          ) : (
            <p className="ARCHIVED">
              {petty_cash_requests.total_requests} Total Requests
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
