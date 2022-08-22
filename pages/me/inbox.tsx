import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import createClient from "../../graphql/client";
import { GET_MY_INBOX } from "../../graphql/queries";
import { authOptions } from "../api/auth/[...nextauth]";
import dateFormat from "../../utils/dateformat";
import Link from "next/link";
import { UserOverview } from "../../types/users";
import { Action } from "../../types/checkrequests";
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const client = await createClient(sessionData?.Authorization);
    const res = await client.query({ query: GET_MY_INBOX, fetchPolicy: 'no-cache' })
    console.log(res.data, "userdata on server")
    return {
        props: {
            userdata: sessionData ? res.data.me : []
        }
    }
}

export default function MyInbox({ userdata }: { userdata: UserOverview }) {
    const { incomplete_actions } = userdata;
    console.log(incomplete_actions)
    return <main>
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
            return <div key={id}>
                <Link href={`/${item_type}/detail/${request_id}`}>
                    <a>{request_name} Request</a>
                </Link>
                <br />
                <p>{user.name}</p>
                <p>{status}</p>
                <small>{created_at}</small>
            </div>
        })}
    </main>
}