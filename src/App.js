import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [grid, setGrid] = useState([]);
  const [gameStart, setGameStart] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [guess, setGuess] = useState({
    previous: -1,
  });

  const createGame = () => {
    setClickCount(0);
    setGuess({ previous: -1 });
    const values = new Array(8)
      .fill(1)
      .map((item) => Math.floor(Math.random() * 100) + 1);
    const arr = new Array(16).fill(1).map((item, id) => {
      return {
        id: id,
        value: values[id % 8],
        isHidden: true,
        isCorrect: false,
      };
    });
    const shuffleArr = arr
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((item, id) => ({ ...item.item, id }));
    setGrid(shuffleArr);
    setGameStart(true);
  };

  useEffect(() => {
    createGame();
    setGameStart(true);
  }, []);

  const calculateWin = () => {
    const remaining = grid.filter((item) => !item.isCorrect);
    console.log(remaining.length);
    if (remaining.length === 2) {
      alert(`Game Completed! you have used ${clickCount} clicks`);
      setClickCount(0);
    }
  };

  const handleClick = (item) => {
    if (guess.previous === item.id || item.isCorrect) return;
    setClickCount((prev) => prev + 1);
    if (guess.previous < 0) {
      setGuess((prev) => ({ previous: item.id }));
      setGrid((prev) => [
        ...prev.filter((el) => el.id !== item.id),
        { ...item, isHidden: false },
      ]);
    } else {
      const previous = grid.find((item) => item.id === guess.previous);
      if (previous.value === item.value) {
        setGrid((prev) => [
          ...prev.filter((el) => el.id !== item.id && el.id !== previous.id),
          { ...item, isHidden: false, isCorrect: true },
          { ...previous, isHidden: false, isCorrect: true },
        ]);
        setGuess({ previous: -1 });
        calculateWin();
      } else {
        setGuess({ previous: -1 });
        setGrid((prev) => [
          ...prev.filter((el) => el.id !== item.id && el.id !== previous.id),
          { ...item, isHidden: true },
          { ...previous, isHidden: true },
        ]);
      }
    }
  };

  const handleNewGame = () => {
    createGame();
  };

  return (
    <div className="App">
      <h1>Memory Game </h1>
      <hr />
      <div className="grid-container">
        {grid &&
          grid
            .sort((a, b) => a.id - b.id)
            .map((item) => (
              <div
                style={{
                  backgroundColor: `${item.isCorrect ? "green" : "blue"}`,
                }}
                key={item.id}
                onClick={() => (item.isCorrect ? "" : handleClick(item))}
                className="box"
              >
                {item.isHidden ? "" : item.value}
              </div>
            ))}
      </div>
      <hr />
      <div>
        Number of Clicks : <span>{clickCount}</span>
      </div>

      <div className="btnBox">
        <button onClick={() => handleNewGame()}>New Game</button>
      </div>
    </div>
  );
}
