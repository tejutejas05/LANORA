import './index.css'

function Message(){

    const name='idiot';
    if (name)
        return <h2>hello{ name}</h2>;
    return <h2>hello World</h2>;
}

export default Message;