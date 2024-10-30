import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [grid, setGrid] = useState([]);
  const [gameStart, setGameStart] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [guess, setGuess] = useState({
    previous: -1,
    current: -1,
  });
  const [isWait, setIsWait] = useState(false);

  const createGame = () => {
    setClickCount(0);
    setGuess({ current: -1, previous: -1 });
    const values = new Array(8)
      .fill(1)
      .map((_) => Math.floor(Math.random() * 100) + 1)
      .slice(0, 8);

    const doubleValues = [...values, ...values];
    const arr = new Array(16).fill(1).map((item, id) => {
      return {
        id: id,
        value: doubleValues[id],
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
    if (remaining.length === 0) {
      alert(`Game Completed! you have used ${clickCount} clicks`);
      setGameStart(false);
      setClickCount(0);
    }
  };

  useEffect(() => {
    if (!gameStart) return;
    calculateWin();
  }, [grid]);

  const handleClick = (item) => {
    //check if box already open or is correct then return
    if (
      item.isCorrect ||
      guess.previous === item.id ||
      guess.current === item.id
    )
      return;
    if (isWait) return;
    //increment count for click
    setClickCount((prev) => prev + 1);

    //open the box
    setGrid((prev) => [
      ...prev.filter((el) => el.id !== item.id),
      { ...item, isHidden: false },
    ]);
    if (guess.current < 0) {
      setGuess((prev) => ({ ...prev, current: item.id }));
    } else {
      setGuess(() => ({ previous: guess.current, current: item.id }));
    }
  };

  useEffect(() => {
    if (guess.current < 0 || guess.previous < 0) return;
    setIsWait(true);
    const timeout = setTimeout(() => {
      checkCorrect();
      setIsWait(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [guess]);

  const checkCorrect = () => {
    const previous = grid.find((itm) => itm.id === guess.previous);
    const current = grid.find((itm) => itm.id === guess.current);

    if (!previous || !current) return;
    setGuess({ current: -1, previous: -1 });
    if (previous.value === current.value) {
      setGrid((prev) => [
        ...prev.filter((el) => el.id !== current.id && el.id !== previous.id),
        { ...current, isHidden: false, isCorrect: true },
        { ...previous, isHidden: false, isCorrect: true },
      ]);
    } else {
      setGrid((prev) => [
        ...prev.filter((el) => el.id !== current.id && el.id !== previous.id),
        { ...current, isHidden: true },
        { ...previous, isHidden: true },
      ]);
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
                  backgroundColor: `${
                    item.isCorrect ? "green" : item.isHidden ? "gray" : "blue"
                  }`,
                  transformStyle: "preserve-3d",
                  transform: `${
                    item.isHidden ? "rotateY(180deg)" : "rotateY(0deg)"
                  }`,
                }}
                key={item.id}
                onClick={() => (item.isCorrect ? "" : handleClick(item))}
                className="box"
              >
                <div className="back">{item.value}</div>
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
