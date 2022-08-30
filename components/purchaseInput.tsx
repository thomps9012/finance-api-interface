export default function PurchaseInput({purchase}: any) {
    return <form className="purchase-row">
        <label>Grant Line Item</label>
        <input defaultValue={purchase.grant_line_item} type="text" name="grant_line_item" />
        <label>Description</label>
        <input defaultValue={purchase.description} type="text" name="description" />
        <label>Amount</label>
        <input defaultValue={purchase.amount} type="number" name="amount" />
        <hr />
    </form>
}