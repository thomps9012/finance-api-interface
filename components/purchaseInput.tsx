export default function PurchaseInput({purchase, row}: any) {
    return <form className="purchase-row">
        <h3 style={{color: 'cadetblue'}}>--- {row} ---</h3>
        <label>Grant Line Item</label>
        <input defaultValue={purchase.grant_line_item} type="text" name="grant_line_item" />
        <label>Description</label>
        <input defaultValue={purchase.description} type="text" name="description" />
        <label>Amount</label>
        <input defaultValue={purchase.amount} type="number" name="amount" />
    </form>
}