import React, { useEffect, useRef, useState } from "react";
import './chat.css'
import { useLocation } from "react-router-dom";

const userId = Math.floor(Math.random() * 1000);
const ChatComponent = () => {
  const [chat, setChat] = useState([]);
  const inputtext = useRef(0);

  const [socket, setSocket] = useState(null);

  const state = useLocation();
  const name = state.state.username;
  const roomId = state.state.roomId;
  

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080", "echo-protocol");
    setSocket(ws);
 
    ws.onopen = (e) => {
      console.log("connected ");
      ws.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          payload: {
            name: name,
            userId: userId,
            roomId: roomId,
          },
        })
      );
      ws.send(
        JSON.stringify({
          type : "GET_MESSAGES",
          payload: {
            roomId : roomId,
            limit : 10,
            offset : 10,
            userId : userId
          }
        })
      )
    };


    ws.onmessage = function (e) {
      console.log(e.data);
      const payload = JSON.parse(e.data);
      console.log(payload);
      if (payload.type === "ADD_CHAT") {
        setChat((chat) => [...chat, payload.payload]);
      }

      if (payload.type === "UPDATE_CHAT") {
        setChat((chat) =>
          chat.map((chatItem) =>
            chatItem.chatId === payload.payload.chatId
              ? { ...chatItem, upvotes: payload.payload.upvotes }
              : chatItem
          )
        );
      }

      if( payload.type === 'GET_CHATS'){
        console.log(payload.payload)
        setChat((chat) =>  [...chat,...(payload.payload.reverse())]);
      }
    };
    return () => {
      ws.close();
    };
  }, []);

  const sendChat = () => {
    const text = inputtext.current.value;
    let id = Math.floor(Math.random() * 1000);
    const newchat = {
      message: text,
      userId: userId,
      roomId: roomId,
      chatId: id,
      upvotes: 0,
    };
    console.log(chat);
    console.log("send chat");
    socket.send(
      JSON.stringify({
        type: "SEND_MESSAGE",
        payload: newchat,
      })
    );
    inputtext.current.value = "";
  };

  const UpdateChat = (chatId) => {
    
    socket.send(
      JSON.stringify({
        type: "UPVOTE_MESSAGE",
        payload: {
          userId,
          roomId: roomId,
          chatId,
        },
      })
    );
  };

  return (
    <div className=" pt-6 background ">
      <div className=" mx-12">
        <div className="flex flex-row  justify-center mb-2 h-[89vh] bg-slate-950  text-white rounded-xl">
          <div className="flex flex-col border w-[40%]  p-2 border-white gap-3 ">
            <div className=" text-center text-xl mb-2">Add Chat</div>
            <div className="h-[89%] flex flex-col gap-6 rounded mx-2 px-2 overflow-y-auto">
              {chat.map((i) => (
                <div
                  key={i.chatId}
                  className="p-2 flex text-wrap rounded-2xl justify-between text-xl px-3 gap-3 bg-slate-800 "
                >
                  <div className="flex flex-col break-words">
                    <div className="text-xl min-h-10 max-w-[100%]">
                      {i.message}
                    </div>
                    <small className="text-xs mt-3">
                      upvotes : {i.upvotes}
                    </small>
                  </div>
                  <div>
                    <button
                      className="text-white "
                      onClick={() => UpdateChat(i.chatId)}
              
                    >
                      <svg
                        width="30px"
                        height="30px"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M6 15L12 9L18 15" stroke="white" />
                      </svg>
                    </button>
                    
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-row gap-3 mx-2 text-black font-semibold">
              <input
                ref={inputtext}
                type="text"
                name="inputtext"
                id="inputtext"
                className="w-full px-2"
              />
              <button
                onClick={() => sendChat()}
                className="bg-slate-500 p-2 px-4 rounded text-black"
              >
                Send
              </button>
            </div>
          </div>

          <div className="flex flex-col border w-[40%]  p-2  border-white gap-3 ">
            <div className="text-center text-xl mb-2">Intermediate Upvotes</div>
            <div className="h-[89%] flex flex-col gap-6 rounded mx-2 px-2 overflow-y-auto">
              {chat.map((i) => i.upvotes>=3 && i.upvotes<5?  (
                <div
                  key={i.chatId}
                  className="p-2 flex text-wrap rounded-2xl justify-between text-xl px-3 gap-3 bg-slate-800 "
                >
                   <div className="flex flex-col break-words">
                    <div className="text-xl min-h-10 max-w-[100%]">
                      {i.message}
                    </div>
                    <small className="text-xs mt-3">
                      upvotes : {i.upvotes}
                    </small>
                  </div>  

                </div>
              ): (<></>))}
            </div>
          </div>

          <div className="flex flex-col border w-[40%]  p-2  border-white gap-3 ">
            <div className="text-center text-xl mb-2">HighUpvotes</div>
            <div className="h-[89%] flex flex-col gap-6 rounded mx-2 px-2 overflow-y-auto">
              {chat.map((i) => i.upvotes>=5 ?  (
                <div
                  key={i.chatId}
                  className="p-2 flex text-wrap rounded-2xl justify-between text-xl px-3 gap-3 bg-slate-800 "
                >
                   <div className="flex flex-col break-words">
                    <div className="text-xl min-h-10 max-w-[100%]">
                      {i.message}
                    </div>
                    <small className="text-xs mt-3">
                      upvotes : {i.upvotes}
                    </small>
                  </div>  

                </div>
              ): (<></>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
