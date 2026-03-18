import ListGroup from "./components/ListGroup";
import Events from "./components/Events";
import Alert from "./components/Alert.js";
import Button from "./components/Button.js"

let names=['alice','bob','car']
function App() {
  return <div>
    <Button color="primary" onClick={()=> console.log("clicked")}>
      the green button
    </Button>
    <ListGroup/>
    <Alert> an alert messsage</Alert>
    <ListGroup/>
    <Events name={names} heading="names" onSelectItem={(names) => console.log(names)}></Events>
   </div>
}

export default App
