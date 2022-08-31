export default function GrantSelect({ state, setState }: any) {
    // hard code before api migration
    const grants = [{
        ID: "H79TI082369",
        Name: "BCORR"
    },
    {
        ID: "H79SP082264",
        Name: "HIV Navigator"
    },
    {
        ID: "H79SP082475",
        Name: "SPF (HOPE 1)"
    },
    {
        ID: "SOR_PEER",
        Name: "SOR Peer"
    },
    {
        ID: "SOR_HOUSING",
        Name: "SOR Recovery Housing"
    },
    {
        ID: "SOR_TWR",
        Name: "SOR 2.0 - Together We Rise"
    },
    {
        ID: "TANF",
        Name: "TANF"
    },
    {
        ID: "2020-JY-FX-0014",
        Name: "JSBT (OJJDP) - Jumpstart For A Better Tomorrow"
    },
    {
        ID: "SOR_LORAIN",
        Name: "SOR Lorain 2.0"
    },
    {
        ID: "H79SP081048",
        Name: "STOP Grant"
    },
    {
        ID: "H79TI083370",
        Name: "BSW (Bridge to Success Workforce)"
    },
    {
        ID: "H79SM085150",
        Name: "CCBHC"
    },
    {
        ID: "H79TI083662",
        Name: "IOP New Syrenity Intensive outpatient Program"
    },
    {
        ID: "H79TI085495",
        Name: "RAP AID (Recover from Addition to Prevent Aids)"
    },
    {
        ID: "H79TI085410",
        Name: "N MAT (NORA Medication-Assisted Treatment Program)"
    }]
    let handleChange = (event: any) => {
        const { name, value } = event.target;
        setState(value);
    }
    return <>
        <h3>Grant</h3>
        <select name={state} onChange={handleChange} defaultValue={state}>
            <option value="" disabled hidden>Select Grant...</option>
            <option value="N/A">None</option>
            {grants.map((grant: any) => {
                return <option key={grant.ID} value={grant.ID}>{grant.Name}</option>
            })}
        </select>
    </>
}