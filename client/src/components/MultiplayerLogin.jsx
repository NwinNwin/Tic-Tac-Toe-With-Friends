import React from "react";
import join from "../images/join.svg";
import exit from "../images/exit.svg";

export default function MultiplayerLogin(props) {
  return props.trigger ? (
    <div className="joinGameContainer">
      <h3>Join a Game</h3>
      <input
        type="text"
        placeholder="Name"
        onChange={(event) => {
          props.setUsername(event.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Room ID"
        onChange={(event) => {
          props.setRoom(event.target.value);
        }}
      />
      <button onClick={props.joinRoom}>
        <img src={join} alt="" className="join-btn-img" />
      </button>
      <button className="exit-btn" onClick={() => props.setMultiplayerPopUp(false)}>
        <img className="restart-logo" src={exit} alt="" />
      </button>
    </div>
  ) : (
    ""
  );
}
