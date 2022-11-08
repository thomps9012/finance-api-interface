import { Address } from "../types/checkrequests";
import { states } from "../utils/stateList";

export default function VendorInput({ setName, setAddress, address, name }: {setName: any, setAddress: any, name: string, address: Address}) {
    const handleNameChange = (e: any) => {
        setName(e.target.value)
    }
    const handleAddressChange = (e: any) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value })
    }
    const {website, street, city, state, zip} = address;
    return <form>
        <h2>Vendor</h2>
        <h3>Name</h3>
        <input defaultValue={name} type='text' name='vendor-name' onChange={handleNameChange} />
        <h4>Website</h4>
        <input defaultValue={website} type='text' name='website' onChange={handleAddressChange} />
        <h4>Address</h4>
        <input defaultValue={street} type='text' name='street' onChange={handleAddressChange} />
        <h4>City</h4>
        <input defaultValue={city} type='text' name='city' onChange={handleAddressChange} />
        <h4>State</h4>
        <select defaultValue={state} name='state' onChange={handleAddressChange} >
            <option value="" disabled hidden>State Select</option>
            {states.map((state: string) => <option key={state} value={state}>{state}</option>)}
        </select>
        <h4>Zip</h4>
        <input defaultValue={zip} type='text' name='zip' onChange={handleAddressChange} />
        <br />
    </form>
}