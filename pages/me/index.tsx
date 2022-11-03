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
    hide_input_form();
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
  const show_input_form = () => {
    document
      .getElementById("vehicleInput")
      ?.setAttribute("id", "vehicleInput-shown");
  };
  const hide_input_form = () => {
    document
      .getElementById("vehicleInput-shown")
      ?.setAttribute("id", "vehicleInput");
  };
  const show_vehicles = () => {
    document.getElementById("vehicles")?.setAttribute("id", "vehicles-shown");
    document.getElementById("show-btn")?.setAttribute("id", "hide-btn");
    document.getElementById("hidden-btn")?.setAttribute("id", "shown-btn");
  };
  const hide_vehicles = () => {
    document.getElementById("vehicles-shown")?.setAttribute("id", "vehicles");
    document.getElementById("hide-btn")?.setAttribute("id", "show-btn");
    document.getElementById("shown-btn")?.setAttribute("id", "hidden-btn");
  };
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
        <div
          style={{
            maxWidth: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <h2>
            <a onClick={show_input_form} className="approve-btn">
              New Vehicle +
            </a>
          </h2>
          <form onSubmit={handleAdd} id="vehicleInput">
            <a className="reject-btn" onClick={hide_input_form}>
              Hide Form
            </a>
            <label>Name</label>
            <input type="text" max={20} name="name" />
            <label>Description</label>
            <input type="text" max={40} name="description" />
            <button type="submit" id="hidden">
              <a className="archive-btn">Add Vehicle</a>
            </button>
          </form>
          {vehicles?.length > 0 && (
            <a
              onClick={show_vehicles}
              id="show-btn"
              className="archive-btn"
              style={{ fontSize: "25px" }}
            >
              Show Vehicles
            </a>
          )}
          {vehicles && (
            <section id="vehicles">
              <a
                id="hidden-btn"
                className="reject-btn"
                onClick={hide_vehicles}
                style={{ fontSize: "25px" }}
              >
                Hide Vehicles
              </a>
              <br />
              {vehicles.map((vehicle: Vehicle) => {
                const { id, name, description } = vehicle;
                return (
                  <article
                    key={id}
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <h2>{name}</h2>
                    <a
                      onClick={() => removeVehicle(id)}
                      key={id}
                      className="reject-btn"
                      style={{ fontSize: "20px", marginTop: 20 }}
                    >
                      Remove
                    </a>
                  </article>
                );
              })}
            </section>
          )}
        </div>
        <div
          style={{
            position: "relative",
            textAlign: "right",
            color: "cadetblue",
            maxWidth: "50%",
            fontSize: 30,
          }}
        >
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
          {mileage_requests.total_requests > 0 ? (
            <>
              <h1>Mileage</h1>
              <Link href={`/me/mileage`}>
                <a>
                  <p className="req-overview">View All</p>
                </a>
              </Link>
              <p className="req-overview">
                {mileage_requests.total_requests} Total Request
                {mileage_requests.total_requests > 1 && "s"}
              </p>
              <Link
                href={`/mileage/detail/${mileage_requests.last_request.id}`}
              >
                <a>
                  <h1>
                    Most Recent{" "}
                    <span
                      className={mileage_requests.last_request.current_status}
                    >
                      {mileage_requests.last_request.current_status
                        .split("_")
                        .join(" ")}{" "}
                      Request
                    </span>
                  </h1>
                </a>
              </Link>
              <p className="req-overview">
                Date - {dateFormat(mileage_requests.last_request.date)}
              </p>
              <p className="req-overview">
                Created - {dateFormat(mileage_requests.last_request.created_at)}
              </p>
            </>
          ) : (
            <h1 className="ARCHIVED">
              {mileage_requests.total_requests} Mileage Requests
            </h1>
          )}
        </div>
        <div className="hr" />
        <div style={{ flexDirection: "column" }}>
          {check_requests.total_requests > 0 ? (
            <>
              <h1> Check Requests</h1>
              <Link href={`/me/checkRequests`}>
                <a>
                  <p className="req-overview">View All</p>
                </a>
              </Link>
              <p className="req-overview">
                {check_requests.total_requests} Total Request
                {check_requests.total_requests > 1 && "s"}
              </p>
              <Link
                href={`/check_request/detail/${check_requests.last_request.id}`}
              >
                <a>
                  <h1>
                    Most Recent{" "}
                    <span
                      className={check_requests.last_request.current_status}
                    >
                      {check_requests.last_request.current_status
                        .split("_")
                        .join(" ")}{" "}
                      Request
                    </span>
                  </h1>
                </a>
              </Link>
              <p className="req-overview">
                Date - {dateFormat(check_requests.last_request.date)}
              </p>
              <p className="req-overview">
                Created - {dateFormat(check_requests.last_request.created_at)}
              </p>
            </>
          ) : (
            <h1 className="ARCHIVED">
              {check_requests.total_requests} Check Requests
            </h1>
          )}
        </div>
        <div className="hr" />
        <div style={{ flexDirection: "column" }}>
          {petty_cash_requests.total_requests > 0 ? (
            <>
              <h1>Petty Cash Requests</h1>
              <Link href={`/me/pettyCash`}>
                <a>
                  <p className="req-overview">View All</p>
                </a>
              </Link>
              <p className="req-overview">
                {petty_cash_requests.total_requests} Total Request
                {petty_cash_requests.total_requests > 1 && "s"}
              </p>
              <Link
                href={`/petty_cash/detail/${petty_cash_requests.last_request.id}`}
              >
                <a>
                  <h1>
                    Most Recent{" "}
                    <span
                      className={
                        petty_cash_requests.last_request.current_status
                      }
                    >
                      {petty_cash_requests.last_request.current_status
                        .split("_")
                        .join(" ")}{" "}
                      Request
                    </span>
                  </h1>
                </a>
              </Link>
              <p className="req-overview">
                Date - {dateFormat(petty_cash_requests.last_request.date)}
              </p>
              <p className="req-overview">
                Created -{" "}
                {dateFormat(petty_cash_requests.last_request.created_at)}
              </p>
            </>
          ) : (
            <h1 className="ARCHIVED">
              {petty_cash_requests.total_requests} Petty Cash Requests
            </h1>
          )}
        </div>
      </div>
    </main>
  );
}
