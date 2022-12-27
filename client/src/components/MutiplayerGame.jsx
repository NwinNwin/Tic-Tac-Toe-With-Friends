import React, { useState } from "react";
import { useEffect } from "react";
import { checkWin, checkTie } from "../utils";
import x from "../images/x.svg";
import o from "../images/o.svg";
import restart from "../images/restart.svg";

export default function MultiplayerGame({ socket, username, room }) {
  const [game, setGame] = useState([
    { id: 0, value: "" },
    { id: 1, value: "" },
    { id: 2, value: "" },
    { id: 3, value: "" },
    { id: 4, value: "" },
    { id: 5, value: "" },
    { id: 6, value: "" },
    { id: 7, value: "" },
    { id: 8, value: "" },
  ]);

  const [turn, setTurn] = useState("X");
  const [win, setWin] = useState([false, ""]);
  const [tie, setTie] = useState(false);
  const [winningBoxes, setWinningBoxes] = useState([]);
  const [sendingTurn, setSendingTurn] = useState("X");
  const [allowMove, setAllowMove] = useState(true);
  const [player, setPlayer] = useState("");

  useEffect(() => {
    let winning = checkWin(game);
    setWin(winning[0]);
    setTie(checkTie(game, win));
    setWinningBoxes(winning[1]);
  }, [turn]);

  //when each box get clicked (set box to that value, switch turn)
  function handleBoxClick(id) {
    setGame((prev) => prev.map((box) => (box.id === id && box.value === "" ? { ...box, value: turn } : box)));
    setTurn((prev) => (prev === "X" ? "O" : "X"));
    setSendingTurn((prev) => (prev === "X" ? "O" : "X"));
    setAllowMove(false);

    //send game, turn to other player
    // await socket.emit("send_game", { game: game, turn: turn, room: room });
  }

  async function sendGame() {
    await socket.emit("send_game", { game: game, turn: turn, room: room, username: username });
  }

  //restart game
  function restartGame() {
    setGame((prev) => prev.map((box) => ({ ...box, value: "" })));
    setTurn("X");
    setWin([false, ""]);
    setTie(false);
    setWinningBoxes([]);
    setSendingTurn("X");
  }

  useEffect(() => {
    sendGame();
  }, [sendingTurn]);

  useEffect(() => {
    const eventListener = (data) => {
      setGame(data.game);
      setTurn(data.turn);
      setAllowMove(true);
      setPlayer(data.username);
    };
    socket.on("receive_game", eventListener);
    return () => socket.off("receive_game", eventListener);
  }, [socket]);

  //render value in each box
  const renderBoard = game.map((ele) => (
    <div
      className={winningBoxes.includes(ele.id) ? "box winning-box" : "box"}
      onClick={() => {
        if (!win[0] && !tie && ele.value == "" && allowMove) {
          handleBoxClick(ele.id);
        }
      }}
    >
      {ele.value === "O" ? <img className="x-or-o" src={o} alt="" width="100%" /> : ele.value === "X" ? <img className="x-or-o" src={x} width="70%" height="70%" /> : ele.value}
    </div>
  ));

  return (
    <div className="game-container">
      <div className="result-container">
        <h1>{win[0] && !allowMove ? `GG EZ!` : win[0] && allowMove ? "lmao L!" : ""}</h1>
        <h1>{tie && !win[0] ? "TIE" : ""}</h1>
        <h1>{!tie && !win[0] && !allowMove ? `${player} 'S TURN` : ""}</h1>
      </div>
      <div className="board">{renderBoard}</div>
      <button onClick={restartGame} className="restart-btn">
        <img className="restart-logo" src={restart} alt="" />
      </button>
    </div>
  );
}