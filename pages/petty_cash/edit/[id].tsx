import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import createClient from "../../../graphql/client";
import { PettyCashDetail } from "../../../types/pettycash";
import { useState } from "react";
import styles from '../../../styles/Home.module.css';
import GrantSelect from "../../../components/grantSelect";
import ReceiptUpload from "../../../components/receiptUpload";
import dateFormat from "../../../utils/dateformat";
import { GrantInfo } from "../../../types/grants";
import CategorySelect from "../../../components/categorySelect";
import { EDIT_PETTY_CASH } from "../../../graphql/mutations";
import { PETTY_CASH_DETAIL, GET_GRANTS } from "../../../graphql/queries";
import { getCookie } from "cookies-next";

export const getServerSideProps = async ({
    req,
    res,
  }: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => {
    const jwt = getCookie("jwt", { req, res });
    const client = createClient(jwt);
    const { id } = req.query;
    const response = await client.query({ query: PETTY_CASH_DETAIL, variables: { id } })
    const grants = await client.query({ query: GET_GRANTS });
    return {
        props: {
            recorddata: jwt != undefined ? response.data.petty_cash_detail : [],
            jwt: jwt ? jwt : "",
            grants: jwt != undefined ? grants.data.all_grants : []
        }
    }
}

export default function EditRecord({ recorddata, jwt, grants }: { jwt: string, recorddata: PettyCashDetail, grants: GrantInfo[] }) {
    const router = useRouter();
    const [category, setCategory] = useState(recorddata.category)
    const [receipts, setReceipts] = useState(recorddata.receipts);
    const [requestDate, setDate] = useState(recorddata.date)
    const [description, setDescription] = useState(recorddata.description)
    const [amount, setAmount] = useState(recorddata.amount)
    const [grantID, setGrantID] = useState(recorddata.grant_id)
    const submitEdit = async (e: any) => {
        e.preventDefault();
        const client = createClient(jwt);
        const res = await client.mutate({
            mutation: EDIT_PETTY_CASH, variables: {
                request_id: recorddata.id, 
                grant_id: grantID, 
                request: {
                    category: category,
                    amount: amount,
                    description: description,
                    receipts: receipts,
                    date: requestDate
                }
            }
        })
        res.data.edit_petty_cash.current_status ? router.push(`/petty_cash/detail/${res.data.edit_petty_cash.id}`) : null;
    }
    return <main className={styles.main}>
        <form id='petty-cash-form'>
            <GrantSelect state={grantID} setState={setGrantID} grants={grants}/>
            <CategorySelect state={category} setState={setCategory} />
            <h4>Amount</h4>
            <input type="number" value={amount} onChange={(e: any) => setAmount(parseFloat(e.target.value))} />
            <h4>Date {dateFormat(requestDate)}</h4>
            <input type="date" value={requestDate} name="date" onChange={(e: any) => setDate(new Date(e.target.value).toISOString())} />
            <h4>Description</h4>
            <textarea rows={5} maxLength={75} name="description" value={description} onChange={(e: any) => setDescription(e.target.value)} />
            <br />
            <span>{description.length}/75 characters</span>
            <h4>{receipts.length} Attached</h4>
            <span className="description">Limit of 5 Receipts per Request</span>
            <span className="description">Allowed File Types are .png, .jpg</span>
            <ReceiptUpload receipts={receipts.map((receipt: any, i: number) => receipt= {data_url: receipt, file: {name: 'image'+i}})} setReceipts={setReceipts} />
            <br />
            <button className='submit' onClick={submitEdit}>Resubmit Request</button>
        </form>
    </main>
}