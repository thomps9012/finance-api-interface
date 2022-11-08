import {
  NextApiRequest,
  NextApiResponse,
} from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import GrantSelect from "../../../components/grantSelect";
import PurchaseInput from "../../../components/purchaseInput";
import ReceiptUpload from "../../../components/receiptUpload";
import VendorInput from "../../../components/vendorInput";
import createClient from "../../../graphql/client";
import { CheckDetail } from "../../../types/checkrequests";
import styles from "../../../styles/Home.module.css";
import dateFormat from "../../../utils/dateformat";
import { CHECK_DETAIL, GET_GRANTS } from "../../../graphql/queries";
import { EDIT_CHECK_REQ } from "../../../graphql/mutations";
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
  const response = await client.query({
    query: CHECK_DETAIL,
    variables: { id },
  });
  const grants = await client.query({ query: GET_GRANTS });
  return {
    props: {
      recorddata: jwt != undefined ? response.data.check_request_detail : [],
      jwt: jwt ? jwt : "",
      grants: jwt != undefined ? grants.data.all_grants : [],
    },
  };
};

export default function EditCheckRequest({
  recorddata,
  jwt,
  grants,
}: {
  recorddata: CheckDetail;
  jwt: string;
  grants: GrantInfo[];
}) {
  const router = useRouter();
  const [receipts, setReceipts] = useState(recorddata.receipts);
  const [category, setCategory] = useState(recorddata.category);
  const [grantID, setGrantID] = useState(recorddata.grant_id);
  const [vendorName, setVendorName] = useState(recorddata.vendor.name);
  const [vendorAddress, setVendorAddress] = useState(recorddata.vendor.address);
  const [creditCard, setCreditCard] = useState(recorddata.credit_card);
  const [requestDate, setDate] = useState(recorddata.date);
  const [rowCount, setRows] = useState(recorddata.purchases.length);
  const [description, setDescription] = useState(recorddata.description);
  console.log(recorddata.purchases);
  const addPurchase = (e: any) => {
    e.preventDefault();
    rowCount < 5 ? setRows(rowCount + 1) : null;
  };
  const removePurchase = (e: any) => {
    e.preventDefault();
    setRows(rowCount - 1);
  };
  const submitEdit = async (e: any) => {
    e.preventDefault();
    if (grantID === "") {
      alert("select a grant");
      return;
    }
    console.log(requestDate);
    let purchaseArr = [];
    const purchaseRows = document.getElementsByClassName("purchase-row");
    for (let i = 0; i < purchaseRows.length; i++) {
      const purchaseData = Object.fromEntries(
        new FormData(purchaseRows[i] as HTMLFormElement)
      );
      purchaseArr.push(purchaseData);
    }
    const client = createClient(jwt);
    const res = await client.mutate({
      mutation: EDIT_CHECK_REQ,
      variables: {
        request_id: recorddata.id,
        grant_id: grantID,
        request: {
          category: category,
          receipts: receipts,
          date: requestDate,
          purchases: purchaseArr,
          credit_card: creditCard,
          description: description,
        },
      },
    });
    res.data.edit_check_request.id
      ? router.push(`/check_request/detail/${res.data.edit_check_request.id}`)
      : null;
  };
  return (
    <main className={styles.main}>
      <form>
        <h4>Grant</h4>
        <GrantSelect state={grantID} setState={setGrantID} grants={grants} />
        <CategorySelect state={category} setState={setCategory} />
        <h4>Date {dateFormat(requestDate)}</h4>
        <input
          type="date"
          value={requestDate}
          name="date"
          onChange={(e: any) => setDate(new Date(e.target.value).toISOString())}
        />
        <h4>Description</h4>
        <textarea
          rows={5}
          maxLength={75}
          name="description"
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
        />
        <br />
        <span>{description.length}/75 characters</span>
        <VendorInput
          setAddress={setVendorAddress}
          setName={setVendorName}
          name={vendorName}
          address={vendorAddress}
        />
        <h3>Purchases</h3>
        <span className="description">Limit of 5 Purchases per Request</span>
        <br />
        <br />
        <PurchaseInput row={1} purchase={recorddata.purchases[0]} />
        <hr />
        {rowCount >= 2 && (
          <>
            <PurchaseInput
              row={2}
              purchase={
                recorddata.purchases[1]
                  ? recorddata.purchases[1]
                  : { grant_line_item: "", description: "", amount: 0.0 }
              }
            />
            <hr />
          </>
        )}
        {rowCount >= 3 && (
          <>
            <PurchaseInput
              row={3}
              purchase={
                recorddata.purchases[2]
                  ? recorddata.purchases[2]
                  : { grant_line_item: "", description: "", amount: 0.0 }
              }
            />
            <hr />
          </>
        )}
        {rowCount >= 4 && (
          <>
            <PurchaseInput
              row={4}
              purchase={
                recorddata.purchases[3]
                  ? recorddata.purchases[3]
                  : { grant_line_item: "", description: "", amount: 0.0 }
              }
            />
            <hr />
          </>
        )}
        {rowCount >= 5 && (
          <>
            <PurchaseInput
              row={5}
              purchase={
                recorddata.purchases[4]
                  ? recorddata.purchases[4]
                  : { grant_line_item: "", description: "", amount: 0.0 }
              }
            />
            <hr />
          </>
        )}
        <br />
        <button onClick={addPurchase}>Add</button>
        <button onClick={removePurchase}>Remove Last</button>
        <h3>Company Credit Card Used</h3>
        <select
          name="creditCard"
          value={creditCard}
          onChange={(e: any) => setCreditCard(e.target.value)}
        >
          <option value="" disabled hidden>
            Select Credit Card..
          </option>
          <option value="N/A">No Card</option>
          <option value="1234">Card 1</option>
          <option value="5678">Card 2</option>
        </select>
        <h4>{receipts.length} Attached</h4>
        <span className="description">Limit of 5 Receipts per Request</span>
        <span className="description">
          Allowed File Types are .png, .jpg, .pdf
        </span>
        <ReceiptUpload receipts={receipts} setReceipts={setReceipts} />
        <br />
        <button className="submit" onClick={submitEdit}>
          Resubmit Request
        </button>
      </form>
    </main>
  );
}
