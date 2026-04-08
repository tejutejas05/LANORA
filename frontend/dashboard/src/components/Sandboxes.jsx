import Card from "../components/Card";
import { mockData } from "../data/mockData";

function Sandboxes() {
  const data = mockData.sandboxes;
  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Sandboxes</h2>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card title="Sandboxes Created" value={data.stats.created} />
        <Card title="Sandboxes Runtime" value={data.stats.runtime} />
        <Card title="Storage Used" value={data.stats.storage} />
      </div>

      <div className="bg-gray-900 p-6 rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-4">Sandbox History</h3>

        <ul className="grid grid-cols-4 gap-90 text-gray-400 mb-3 gap-90">
          <li>Sand Box ID</li>
          <li>Status</li>
          <li>Started</li>
          <li>Duration</li>
        </ul>

        {data.history.map((test) => (
          <div
            key={test.id}
            className="flex gap-4 justify-between items-center border border-gray-700 p-3 rounded mb-2"
          >
            <span>{test.name}</span>
            <span>{test.status}</span>
            <span>{test.started}</span>
            <span>{test.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sandboxes;
