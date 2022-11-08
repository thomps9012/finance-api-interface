export default function CategorySelect({
  state,
  setState,
}: {
  state: any;
  setState: any;
}) {
  const Categories = [
    "HOUSING",
    "EMPLOYMENT",
    "MENTAL_HEALTH",
    "ADMINISTRATIVE",
    "FINANCE",
  ];
  const handleChange = (event: any) => {
    const value = event.target.value;
    setState(value);
  };
  return (
    <>
      <h3>Request Category</h3>
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
