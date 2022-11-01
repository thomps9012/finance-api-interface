export default function CategorySelect({
  state,
  setState,
}: {
  state: any;
  setState: any;
}) {
  const Categories = [
    "IOP",
    "INTAKE",
    "PEERS",
    "ACT_TEAM",
    "IHBT",
    "PERKINS",
    "MENS_HOUSE",
    "NEXT_STEP",
    "LORAIN",
    "PREVENTION",
    "ADMINISTRATIVE",
    "FINANCE",
  ];
  const handleChange = (event: any) => {
    const value = event.target.value;
    setState(value);
  };
  return (
    <>
      <h3>Request Location / Category</h3>
      <select
        name={state}
        onChange={handleChange}
        defaultValue={state}
      >
        <option value="" disabled hidden>Select Category...</option>
        {Categories.map((category) => <option value={category} key={category}>{category.toLowerCase().split("_").join(" ")}</option>)}
        </select>
    </>
  );
}
