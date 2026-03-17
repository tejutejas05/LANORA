function Events() {
  let names = ["alice", "bob", "car"];

  return (
    <>
      <h2>list from Events</h2>
      {names.length === 0 && <p>no item found</p>}
      <ul className="class-name-group">
        {names.map((name) => (
          <li 
            className="list-froup-name" 
            key={name}
            onClick={()=>console}
            >
            {name}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Events;
