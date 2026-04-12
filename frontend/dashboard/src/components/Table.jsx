function Table({ columns, data }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      <div className="grid grid-cols-4 gap-4 text-gray-400 mb-3">
        {columns.map((col, index) => (
          <span key={index}>{col.label}</span>
        ))}
      </div>

      {data.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-4 gap-4 items-center border border-gray-700 p-3 rounded mb-2 hover:bg-gray-800 transition"
        >
          {columns.map((col, i) => {
            const value = row[col.key];

            if (col.key === "status") {
              return (
                <span
                  key={i}
                  className={
                    value === "Running"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {value}
                </span>
              );
            }

            return <span key={i}>{value}</span>;
          })}
        </div>
      ))}
    </div>
  );
}

export default Table;