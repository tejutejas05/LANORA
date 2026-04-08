import Card from "../components/Card";
import { mockData } from "../data/mockData";

function Dashboard() {
  const data = mockData.dashboard;

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

     
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card title="Total Sandboxes" value={data.stats.sandboxes} />
        <Card title="Total Runtime" value={data.stats.runtime} />
        <Card title="Total Agents Tested" value={data.stats.agents} />
      </div>

      <div className="bg-gray-900 p-6 rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-4">Recent Tests</h3>
        <ul className="">
          <li className="text-lg font-semibold mb-3 ">Agent ID</li>
          <li className="text-lg font-semibold mb-3 ">Status</li>
          <li className="text-lg font-semibold mb-3 ">created at</li>
          <li className="text-lg font-semibold mb-3 ">Runtime</li>
        </ul>
        
        {data.recentTests.map((test) => (
          <div
            key={test.id}
            className="flex justify-between items-center border border-gray-700 p-3 rounded mb-2"
          >
            <span>{test.agent}</span>
            <span>{test.status}</span>
            <span>{test.createdAt}</span>
            <span>{test.runtime}</span>

            <button className="border px-3 py-1 rounded">
              view full logs
            </button>
          </div>
        ))}
      </div>


      <div className="grid grid-cols-2 gap-6">
        <Card title="Storage" value={`${data.storage} used`} />
        <Card title="Files Created" value={data.files} />
      </div>
    </div>
  );
}

export default Dashboard;