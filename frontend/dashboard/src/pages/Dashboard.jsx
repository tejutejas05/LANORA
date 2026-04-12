import Card from "../components/Card";
import Table from "../components/Table";
import { mockData } from "../data/mockData";

function Dashboard() {
  const data = mockData.dashboard;

  const columns = [
    { label: "Agent", key: "agent" },
    { label: "Status", key: "status" },
    { label: "Created At", key: "createdAt" },
    { label: "Runtime", key: "runtime" },
  ];

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

   
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card title="Total Sandboxes" value={data.stats.sandboxes} />
        <Card title="Total Runtime" value={data.stats.runtime} />
        <Card title="Total Agents Tested" value={data.stats.agents} />
      </div>

   
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Recent Tests</h3>
        <Table columns={columns} data={data.recentTests} />
      </div>

    
      <div className="grid grid-cols-2 gap-6">
        <Card title="Storage" value={`${data.storage} used`} />
        <Card title="Files Created" value={data.files} />
      </div>
    </div>
  );
}

export default Dashboard;