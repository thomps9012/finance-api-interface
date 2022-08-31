import { ADD_VEHICLE, REMOVE_VEHICLE } from "../../graphql/mutations";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { UserOverview, Vehicle } from "../../types/users";
import dateFormat from "../../utils/dateformat";
import { useRouter } from "next/router";
import Link from "next/link";
import createClient from "../../graphql/client";
import styles from '../../styles/Home.module.css';
import { gql } from "@apollo/client";

const GET_MY_INFO = gql`query me {
    me {
      id
      name
      vehicles {
        id
        name
        description
      }
      mileage_requests {
        requests {
          id
          current_status
          date
        }
      }
      check_requests {
        requests {
          id
          current_status
          date
        }
      }
      petty_cash_requests {
        requests {
          id
          current_status
          date
        }
      }
    }
  }`;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const sessionData = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )
  const jwt = sessionData?.user.token
  const client = createClient(jwt);
  const res = await client.query({ query: GET_MY_INFO })
  console.log('ssr res', res)
  return {
    props: {
      userdata: sessionData ? res.data.me : [],
      jwt: jwt ? jwt : ""
    }
  }
}
export default function MePage({ userdata, jwt }: { userdata: UserOverview, jwt: string }) {
  const router = useRouter();
  const client = createClient(jwt)
  const handleAdd = async (e: any) => {
    e.preventDefault();
    const vehicleData = Object.fromEntries(new FormData(e.target))
    var inputs = e.target.getElementsByTagName('input')
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = '';
    }
    const res = await client.mutate({ mutation: ADD_VEHICLE, variables: { name: vehicleData.name, description: vehicleData.description } })
    res.data.add_vehicle ? router.push('/me') : null;
  }

  const removeVehicle = async (vehicle_id: string) => {
    console.log(vehicle_id)
    const res = await client.mutate({ mutation: REMOVE_VEHICLE, variables: { vehicle_id } })
    res.data.remove_vehicle ? router.push('/me') : null;
  }
  return <main className={styles.container}>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <div style={{ padding: 20 }}>
        {userdata.vehicles?.length > 0 && (<h2>Current Vehicles</h2>)}
        {userdata.vehicles?.map((vehicle: Vehicle) => {
          return <div key={vehicle.id} style={{ textAlign: 'left' }}>
            <h3>{vehicle.name}<a style={{ marginLeft: 15 }} onClick={() => removeVehicle(vehicle.id)} className='remove'>X</a> </h3>
            <h4>{vehicle.description}</h4>
            <hr />
          </div>
        })}
      </div>
      <form onSubmit={handleAdd} id='vehicleInput'>
        <h3>New Vehicle</h3>
        <label>Name</label>
        <input type="text" max={20} name="name" />
        <label>Description</label>
        <input type="text" max={40} name="description" />
        <button type="submit" className="submit" style={{ padding: 10, margin: 10 }}>Add Vehicle</button>
      </form>
    </div>

    <Link href="/me/mileage"><a><h1>My Mileage</h1></a></Link>
    {userdata.mileage_requests.requests.slice(0, 3).map((mileage_req: any) => <div key={mileage_req.id}>

      <Link href={`/mileage/detail/${mileage_req.id}`}><a><p className={mileage_req.current_status}>{dateFormat(mileage_req.date)} {mileage_req.current_status}</p></a></Link>
    </div>
    )}

    <Link href="/me/checkRequests"><a><h1>My Check Requests</h1></a></Link>
    {userdata.check_requests.requests.slice(0, 3).map((check_req: any) => <div key={check_req.id}>

      <Link href={`/check_request/detail/${check_req.id}`}><a><p className={check_req.current_status}>{dateFormat(check_req.date)} {check_req.current_status}</p></a></Link>
    </div>
    )}

    <Link href="/me/pettyCash"><a><h1>My Petty Cash</h1></a></Link>
    {userdata.petty_cash_requests.requests.slice(0, 3).map((petty_cash_req: any) => <div key={petty_cash_req.id}>
      <Link href={`/petty_cash/detail/${petty_cash_req.id}`}><a><p className={petty_cash_req.current_status}>{dateFormat(petty_cash_req.date)} {petty_cash_req.current_status}</p></a></Link>
    </div>
    )}

  </main>
}