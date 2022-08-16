import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import Link from "next/link"
import { BASE_CHECK_API } from "../../../graphql/bases"
import { RECORD_DETAIL } from "../../../graphql/queries"
import { CHECK_DETAIL_RES } from "../../../graphql/responses"
import { Action, CheckDetail, Purchase } from "../../../types/checkrequests"
import dateFormat from "../../../utils/dateformat"
import titleCase from "../../../utils/titlecase"
import { authOptions } from "../../api/auth/[...nextauth]"

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { id } = context.query
    const api = `${BASE_CHECK_API}${RECORD_DETAIL}"${id}")${CHECK_DETAIL_RES}}`
    const checkdetail = await fetch(api).then(res => res.json())
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    return {
        props: {
            recorddata: sessionData ? checkdetail.data.detail : []
        }
    }
}

export default function RecordDetail({ recorddata }: { recorddata: CheckDetail }) {
    console.log(recorddata)
    const { receipts, purchases, created_at, credit_card, current_status, date, description, grant_id, is_active, order_total, user_id, action_history } = recorddata;
    const vendorName = recorddata.vendor.name;
    const { website, street, city, zip, state } = recorddata.vendor.address;
    return <main className={is_active ? 'active' : 'inactive'}>
        <p>{dateFormat(date)} Check Request</p>
        <p>for</p>
        <h3>{description}</h3>
        <h5>{order_total}</h5>
        {purchases.map((purchase: Purchase) => {
            const { amount, description, grant_line_item } = purchase;
            return <>
                <p>{description}</p>
                <p>{amount}</p>
                <p>{grant_line_item}</p>
            </>
        })}
        <hr />
        <h5>Credit Card</h5>
        {credit_card}
        <hr />
        <h5>Receipts</h5>
        {receipts.map((receipt: string) => <img src={receipt} />)}
        <hr />
        <h3>{vendorName}</h3>
        <p>{website}</p>
        <p>{street}</p>
        <p>{city}</p>
        <p>{state}</p>
        <p>{zip}</p>
        <h3>Links to User and Grant Pages</h3>
        <Link href={`/user/detail/${grant_id}`}><a>{grant_id}</a></Link>
        <br />
        <Link href={`/user/detail/${user_id}`}><a>User Profile</a></Link>
        <p>Created on {dateFormat(created_at)}</p>
        <h5>Current Status: {titleCase(current_status)}</h5>
        <h5>Action History</h5>
        {action_history.map((action: Action) => {
            const { id, user_id, created_at, status } = action;
            return <div key={id}>
                <p>{user_id}</p>
                <p>{created_at}</p>
                <p>{titleCase(status)}</p>
            </div>
        })}
    </main>
}