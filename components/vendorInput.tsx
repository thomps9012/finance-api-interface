import { states } from "../utils/stateList";

export default function VendorInput({ setName, setAddress, address, name }: any) {
    const handleNameChange = (e: any) => {
        setName(e.target.value)
    }
    const handleAddressChange = (e: any) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value })
    }
    return <form>
        <h4>Vendor Name</h4>
        <input defaultValue={name} type='text' name='vendor-name' onChange={handleNameChange} />
        <h4>Vendor Address</h4>
        <h5>Website</h5>
        <input defaultValue={address.website} type='text' name='website' onChange={handleAddressChange} />
        <h5>Address</h5>
        <input defaultValue={address.street} type='text' name='website' onChange={handleAddressChange} />
        <h5>City</h5>
        <input defaultValue={address.city} type='text' name='city' onChange={handleAddressChange} />
        <h5>State</h5>
        <select defaultValue={address.state} name='state' onChange={handleAddressChange} >
            <option value="" disabled hidden>State Select</option>
            {states.map((state: string) => <option key={state} value={state}>{state}</option>)}
        </select>
        <h5>Zip</h5>
        <input defaultValue={address.zip} type='text' name='zip' onChange={handleAddressChange} />
    </form>
}