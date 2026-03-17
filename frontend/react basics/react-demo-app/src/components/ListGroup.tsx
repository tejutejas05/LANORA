// import { Fragment } from "react/jsx-runtime";
// need to import this to use the Fragment 

function ListGroup() {
    let names = ['alice','bob','carr'];

    // const cond=names.length===0 ? <p>no names</p> : "names exist"; {/* just a variable with logic*/}

const Messages = ()=>{
    return names.length===0 ? <p>no names</p> : "names exist" 
}

  return (
     <>{/* // default fragment declaration */}
      {/*we can also use the <Fragment></Fragment> tag  */}
      <h2>list from list groups</h2>
        {Messages}
        {/* {cond} */}
        {/* items.length===0 && <p>no items found */}
        <ul className="list-group">
           {names.map(name => <li key={name}>{name}</li> )} {/* key may be a name.id etc etc 
          <li className="list-grp-item">1st item </li>
          <li className="list-grp-item">2nd item </li>
          <li className="list-grp-item">3rd item </li> */}
        </ul>
    </>
  );
}
export default ListGroup;
