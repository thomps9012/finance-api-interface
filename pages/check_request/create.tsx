import { CREATE_CHECK_REQ } from "../../graphql/mutations";
import GrantSelect from "../../components/grantSelect";
import { useState } from "react";
import ReceiptUpload from "../../components/receiptUpload";
import VendorInput from "../../components/vendorInput";
import PurchaseInput from "../../components/purchaseInput";
import { useRouter } from "next/router";
import createClient from "../../graphql/client";
import styles from "../../styles/Home.module.css";
import { NextApiRequest, NextApiResponse } from "next";
import { GET_GRANTS } from "../../graphql/queries";
import { GrantInfo } from "../../types/grants";
import CategorySelect from "../../components/categorySelect";
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
  const response = await client.query({ query: GET_GRANTS });
  return {
    props: {
      grant_data: jwt != undefined ? response.data.all_grants : [],
      jwt: jwt != undefined ? jwt : "",
    },
  };
};
export default function CreateRequest({
  grant_data,
  jwt
}: {
  grant_data: GrantInfo[];
  jwt: string;
}) {
  const router = useRouter();
  const [receipts, setReceipts] = useState([]);
  const [grantID, setGrantID] = useState("");
  const [category, setCategory] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorAddress, setVendorAddress] = useState({
    website: "",
    street: "",
    city: "",
    state: "",
    zip: 0,
  });
  const [creditCard, setCreditCard] = useState("");
  const [requestDate, setDate] = useState("");
  const [rowCount, setRows] = useState(1);
  const [description, setDescription] = useState("");
  const addPurchase = (e: any) => {
    e.preventDefault();
    rowCount < 5 ? setRows(rowCount + 1) : null;
  };
  const removePurchase = (e: any) => {
    e.preventDefault();
    setRows(rowCount - 1);
  };
  const submitRequest = async (e: any) => {
    e.preventDefault();
    console.log(vendorAddress);
    if (category === "") {
      alert("select a category");
      return;
    }
    if (grantID === "") {
      alert("select a grant");
      return;
    }
    if (vendorName === "") {
      alert("enter vendor name");
      return;
    }
    if (vendorAddress.website === "") {
      alert("enter complete vendor address");
      return;
    }
    if (vendorAddress.street === "") {
      alert("enter complete vendor address");
      return;
    }
    if (vendorAddress.city === "") {
      alert("enter complete vendor address");
      return;
    }
    if (vendorAddress.state === "") {
      alert("enter complete vendor address");
      return;
    }
    if (vendorAddress.zip === 0) {
      alert("enter complete vendor address");
      return;
    }
    if (creditCard === "") {
      alert("enter credit card option");
      return;
    }
    if (requestDate === "") {
      alert("enter valid request date");
      return;
    }
    if (description === "") {
      alert("enter purchase description");
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
      mutation: CREATE_CHECK_REQ,
      variables: {
        vendor: {
          name: vendorName,
          address: vendorAddress,
        },
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
    res.data.create_check_request.created_at ? router.push("/me") : null;
  };

  return (
    <main className={styles.container}>
      <h1>New Check request</h1>
      <form>
        <GrantSelect
          state={grantID}
          setState={setGrantID}
          grants={grant_data}
        />
        <CategorySelect state={category} setState={setCategory} />
        <h3>Date</h3>
        <input
          type="date"
          name="date"
          onChange={(e: any) => setDate(new Date(e.target.value).toISOString())}
        />
        <h3>Description</h3>
        <textarea
          rows={5}
          maxLength={75}
          name="description"
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
        />
        <span>{description.length}/75 characters</span>
        <br />
        <VendorInput
          setAddress={setVendorAddress}
          setName={setVendorName}
          address={vendorAddress}
          name={vendorName}
        />
        <h2>Purchases</h2>
        <span className="description">Limit 5 Purchases per Request</span>
        <br />
        <PurchaseInput
          row={1}
          purchase={{ grant_line_item: "", description: "", amount: 0.0 }}
        />
        {rowCount >= 2 && (
          <PurchaseInput
            row={2}
            purchase={{ grant_line_item: "", description: "", amount: 0.0 }}
          />
        )}
        {rowCount >= 3 && (
          <PurchaseInput
            row={3}
            purchase={{ grant_line_item: "", description: "", amount: 0.0 }}
          />
        )}
        {rowCount >= 4 && (
          <PurchaseInput
            row={4}
            purchase={{ grant_line_item: "", description: "", amount: 0.0 }}
          />
        )}
        {rowCount >= 5 && (
          <PurchaseInput
            row={5}
            purchase={{ grant_line_item: "", description: "", amount: 0.0 }}
          />
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <a onClick={addPurchase} className="archive-btn">
            Add Purchase
          </a>
          <a onClick={removePurchase} className="reject-btn">
            Remove Last
          </a>
        </div>
        <h3>Company Credit Card Used?</h3>
        <select
          name="creditCard"
          value={creditCard}
          onChange={(e: any) => setCreditCard(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled hidden>
            Select Credit Card..
          </option>
          <option value="N/A">No</option>
          <option value="1234">Card Ending in 1234</option>
          <option value="5678">Card Ending in 5678</option>
        </select>
        <h3>Receipts</h3>
        <span className="description">
          Limit 5 Receipts in PNG or JPEG Format
        </span>
        <ReceiptUpload receipts={receipts} setReceipts={setReceipts} />
        <br />
        <a className="archive-btn" onClick={submitRequest}>
          Submit Request
        </a>
        <br />
      </form>
    </main>
  );
}
