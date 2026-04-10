import Card from "../components/Card";
import { mockData } from "../data/mockData";
import Table from "./Table";

function Sandboxes() {
  const data = mockData.sandboxes;
  const columns=[
    {label:"Sand Box ID",key:"name"},
    {label:"Status",key:"status"},
    {label:"Started",key:"started"},
    {label:"Duration",key:"duration"},
  ];

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Sandboxes</h2>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card title="Sandboxes Created" value={data.stats.created} />
        <Card title="Sandboxes Runtime" value={data.stats.runtime} />
        <Card title="Storage Used" value={data.stats.storage} />
      </div>

      <Table columns={columns} data={data.history} />
    </div>
  );
}

export default Sandboxes;
