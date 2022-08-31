import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import createClient from "../../graphql/client";
import { authOptions } from "../api/auth/[...nextauth]";
import dateFormat from "../../utils/dateformat";
import Link from "next/link";
import { UserOverview } from "../../types/users";
import { Action } from "../../types/checkrequests";
import { gql } from "@apollo/client";
import styles from '../../styles/Home.module.css';
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const client = createClient(jwt);
    const GET_MY_INFO = gql`query me {
          me {
            incomplete_actions {
                id
                request_type
                request_id
                user {
                    name
                }
                status
                created_at
            }
            incomplete_action_count 
        }
    }`
    const res = await client.query({ query: GET_MY_INFO })
    return {
        props: {
            userdata: sessionData ? res.data.me : []
        }
    }
}

export default function MyInbox({ userdata }: { userdata: UserOverview }) {
    const { incomplete_actions } = userdata;
    console.table(incomplete_actions)
    return <main className={styles.main}>

        {incomplete_actions.length > 0 ? <>
            <h1>{userdata.incomplete_action_count} New Action Item{userdata.incomplete_action_count != 1 && `s`}</h1> <table>
                <thead>
                    <th className='table-cell'>Type</th>
                    <th className='table-cell'>Current Status</th>
                    <th className='table-cell'>Created At</th>
                    <th className='table-cell'>Requestor</th>
                </thead>
                <tbody>
                    {incomplete_actions?.map((action: Action) => {
                        const { id, request_id, request_type, user, status, created_at } = action;
                        let item_type, request_name;
                        switch (request_type) {
                            case 'petty_cash_requests':
                                item_type = 'petty_cash'
                                request_name = 'Petty Cash'
                                break;
                            case 'mileage_requests':
                                item_type = 'mileage'
                                request_name = 'Mileage'
                                break;
                            case 'check_requests':
                                item_type = 'check_request'
                                request_name = 'Check'
                                break;
                        }
                        return <Link href={`/${item_type}/detail/${request_id}`} key={id}>
                            <tr id='table-row' key={id} className={status}>
                                <td className='table-cell'>{request_name}</td>
                                <td className='table-cell'>{action.status}</td>
                                <td className='table-cell'>{dateFormat(action.created_at)}</td>
                                <td className='table-cell'>{action.user.name}</td>
                            </tr>
                        </Link>
                    })}
                </tbody>
            </table>
        </>
            : <h1>Nothing Todo Yet</h1>
        }
    </main>
}