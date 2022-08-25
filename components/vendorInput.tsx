import { states } from "../utils/stateList";

export default function VendorInput({ setName, setAddress, address }: any) {
    const handleNameChange = (e: any) => {
        setName(e.target.value)
    }
    const handleAddressChange = (e: any) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value })
    }
    return <form>
        <h4>Vendor Name</h4>
        <input type='text' name='vendor-name' onChange={handleNameChange} />
        <h4>Vendor Address</h4>
        <h5>Website</h5>
        <input type='text' name='website' onChange={handleAddressChange} />
        <h5>Address</h5>
        <input type='text' name='website' onChange={handleAddressChange} />
        <h5>City</h5>
        <input type='text' name='city' onChange={handleAddressChange} />
        <h5>State</h5>
        <select name='state' defaultValue="" onChange={handleAddressChange} >
            <option value="" disabled hidden>State Select</option>
            {states.map((state: string) => <option key={state} value={state}>{state}</option>)}
        </select>
        <h5>Zip</h5>
        <input type='text' name='zip' onChange={handleAddressChange} />
    </form>
}