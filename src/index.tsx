import React, { useCallback, useEffect, useState } from "react";
import { render } from "react-dom";
import generateRandomWord from "random-words";

interface Data {
  id: string;
  data: string;
}

const DATA_CHUNK = 10;

function fetchData() {
  return new Promise<Data[]>((resolve, reject) => {
    const data: Data[] = Array.from(Array(DATA_CHUNK).keys(), (index) => {
      return { id: index.toString(), data: generateRandomWord() };
    });
    // Mock some errors during request
    return Math.random() > 0.5 ? resolve(data) : reject("Error during request");
  });
}

const Catalog = React.memo(() => {
  const [count, setCount] = useState<number>(0);
  const [record, setRecord] = useState<Record<string, Data>>({});

  const handleError = useCallback((error: Error) => {
    console.error(error.message);
  },[]);

  useEffect(() => {
    fetchData()
      .then((res) => {
        res.forEach((result) => setRecord(prev => ({ ...prev, [result.id]: result })));
      })
      .catch((error) => handleError(error));
  }, [count, handleError, record]); // handleError

  return (
    <div className="App">
      <ul>
        {Object.values(record).map((item) => {
          return (
            <li>
              {item.id}:{item.data}
            </li>
          );
        })}
      </ul>
      <hr />
      This was {count} time you fetched data
      <button onClick={() => setCount(count + 1)}>Fetch more</button>
    </div>
  );
});

const rootElement = document.getElementById("root");
render(<Catalog />, rootElement, () =>
  console.log("Render of <Catalog /> component")
);
