
interface Props{
    children: string;
    color?:'primary'| 'secondary'|'danger'|'success';
    onClick:() => void;
}

const Button = ({children, onClick,color="secondary"}:Props) => {
  return (
    <div>
        <button className={'btn btn-'+ color} onClick={onClick} >{children} </button>
    </div>
  )
}

export default Button;