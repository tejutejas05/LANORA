import Card from "./Card";
import { mockData } from "../data/mockData";
import Table from "./Table";

function Test_History() {
  const data = mockData.testHistory;
  const columns=[
    {label:"Agent", key:"agent"},
    {label:"Status", key:"status"},
    {label:"Created At", key:"createdAt"},
    {label:"Runtime", key:"runtime"},
    
  ]

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Test History</h2>
         <Table columns={columns} data={data.tests}/>
    </div>
  );
}

export default Test_History;

