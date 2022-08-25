export default function PurchaseInput() {
    return <form className="purchase-row">
        <label>Grant Line Item</label>
        <input type="text" name="grant_line_item" />
        <label>Description</label>
        <input type="text" name="description" />
        <label>Amount</label>
        <input type="number" name="amount" />
        <hr />
    </form>
}