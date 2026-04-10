function Card({ title, value, style }) {
  return (
    <div className={"bg-gray-900 p-5 rounded-xl shadow "+style}>
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default Card;