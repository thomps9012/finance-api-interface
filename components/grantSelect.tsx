import { GrantInfo } from "../types/grants";

export default function GrantSelect({ state, setState, grants }: {grants: GrantInfo[], state: any, setState: any}) {
    let handleChange = (event: any) => {
        const value = event.target.value;
        setState(value);
    }
    return <>
        <h3>Grant</h3>
        <select name={state} onChange={handleChange} defaultValue={state}>
            <option value="" disabled hidden>Select Grant...</option>
            <option value="N/A">None</option>
            {grants.map((grant: GrantInfo) => {
                const {id, name} = grant;
                return <option key={id} value={id}>{name}</option>
            })}
        </select>
    </>
}