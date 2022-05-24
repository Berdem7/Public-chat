import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3010");

function App() {
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");
  const [receivedMsg, setReceivedMsg] = useState("");
  const [username, setUsername] = useState("");
  const [sentMsg, setSentMsg] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3010/`).then((res) => {
      const chat = res.data.messages;
      setData([...chat]);
    });
  }, [receivedMsg]);

  const sendMessage = (e) => {
    console.log(e);

    socket.emit("sendMsg", { msg });
    axios
      .post("http://localhost:3010/", { user: username, chat: msg })
      .then(() => console.log("success"))
      .catch((err) => {
        console.error(err);
      });
    // setData((prev) => [prev, ...{ user: 2, chat: msg }]);
  };

  function handleSubmit(e) {
    e.preventDefault();
    setUsername(e.target[0].value);
  }

  function handleMsgSubmit(e) {
    e.preventDefault();
    sendMessage();
    setSentMsg(e.target[0].value);
    // console.log(e.target[0].value);
    // e.target[0].value = "";
  }

  useEffect(() => {
    console.log(data);
    socket.on("receiveMsg", (data) => {
      setReceivedMsg(data.msg);
    });
  }, [socket]);
  return (
    <section className="App">
      <div className="Content_cta">
        <form onSubmit={handleSubmit}>
          {username ? (
            <input placeholder={username} />
          ) : (
            <input placeholder="username" />
          )}

          <button type="submit">Set Username</button>
        </form>
        {data.map((e, id) => {
          return (
            <div className="messages" key={id}>
              {e.user}: {e.chat}
              {/* <form class="deleteMsg" method="delete" action="/">
                <input id="invisible" type="text" name="delete" value={id} />
                <button className="deleteButton" type="submit">
                  <img src="frontend/public/images/remove.png" alt=""></img>
                  Delete msg
                </button>
              </form> */}
            </div>
          );
        })}
      </div>
      <div>
        {sentMsg ? <p>You said "{sentMsg}"</p> : <p></p>}

        {receivedMsg ? (
          <p>{data[data.length - 1].user} has sent a message</p>
        ) : (
          <p></p>
        )}
      </div>

      <form onSubmit={handleMsgSubmit}>
        <input
          placeholder="Message"
          onChange={(event) => {
            setMsg(event.target.value);
          }}
        />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}

export default App;
