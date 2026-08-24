import { alaCarte } from "@/content";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/** Single items, priced. No bundle required. */
export function AlaCarteTable() {
  if (alaCarte.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-left">
        <caption className="sr-only">Individual items and rates</caption>
        <thead>
          <tr>
            {["Item", "Price", "Unit"].map((head) => (
              <th key={head} scope="col" className={`${SPEC} pb-5 pr-6 font-normal text-fg-faint`}>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {alaCarte.map((item) => (
            <tr key={item.name} className="border-t border-rule">
              <th scope="row" className="py-4 pr-6 text-sm font-normal text-fg">
                {item.name}
              </th>
              <td className={`${SPEC} py-4 pr-6 whitespace-nowrap tabular-nums text-accent-text`}>
                {item.price}
              </td>
              <td className={`${SPEC} py-4 pr-6 whitespace-nowrap text-fg-faint`}>{item.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
