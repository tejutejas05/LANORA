import { MouseEvent, useState } from "react";

//{items:[], heading:string}

interface Props{
  name:string[];
  heading:string;
  onSelectItem:(item:string) => void;

}


function Events({name,heading,onSelectItem}:Props) {
 
  //let names = ["alice", "bob", "car"];
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      <h2>list from Events</h2>
      {name.length === 0 && <p>no item found</p>}
      <ul className="list-group">
        {name.map((name,index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={name}
            onClick={() => {setSelectedIndex(index);
              onSelectItem(name);
            }} 
          >
            {name}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Events;