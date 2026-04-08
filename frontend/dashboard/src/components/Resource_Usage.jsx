import { mockData } from "../data/mockData";
import Card from "./Card";

function Resource_Usage(){
  const data=mockData.resourceUsage;
  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Resource Usage</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {data.stats.map((item,index)=>
          <Card 
            style="h-60"
            key={index} 
            title={item.title}
            value={item.value}/>
        )}
      </div>
    </div>
  )
}

export default Resource_Usage;