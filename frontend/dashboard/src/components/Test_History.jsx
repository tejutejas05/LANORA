import Card from "./Card";
import { mockData } from "../data/mockData";

function Test_History(){
    const data = mockData.testHistory;

    return(
         <div className="bg-gray-900 p-6 rounded-xl mb-6">
            <h3 className="text-lg font-semibold mb-4">Test History</h3>

            <ul className="grid grid-cols-4 gap-90 text-gray-400 mb-3 ">
                <li>Agent ID</li>
                <li>Status</li>
                <li>Created At</li>
                <li>Runtime</li>
            </ul>
            {data.testHistory.map((test)=>{
                <div
                    key={test.id}
                    className="flex gap-4 justify-between items-center border border-gray-700 p-3 rounded mb-2"
                >
                <span>{test.agent}</span>
                <span>{test.status}</span>
                <span>{test.createdAt}</span>
                <span>{test.runtime}</span>

                <button className="border px-3 py-1 rounded ">view full logs

                </button>
                </div>
            })}
        </div>
    );
}

export default Test_History;

