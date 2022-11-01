import { Purchase } from "../types/checkrequests";

export default function PurchaseInput({purchase}: {purchase: Purchase}) {
    const {grant_line_item, description, amount} = purchase;
    return <form className="purchase-row">
        <label>Grant Line Item</label>
        <input defaultValue={grant_line_item} type="text" name="grant_line_item" />
        <label>Description</label>
        <input defaultValue={description} type="text" name="description" />
        <label>Amount</label>
        <input defaultValue={amount} type="number" name="amount" />
        <div className="hr"/>
    </form>
}