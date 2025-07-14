import styles from "./App.module.css";
import { Chat } from "./components/Chat/chat";
import { Sidebar } from "./components/Sidebar/sidebar";
import { useEffect, useState } from "react";

function App() {
  const [prevChats, setPrevChats] = useState([
    {
      id: 1,
      chatName: "TEST1",
      chats: {
        role: "model",
        parts: [{ text: "Hello! How can I assist you today?" }],
      },
    },
  ]);

  const [selectedChat, setSelectedChat] = useState({
    id: 1,
    chatName: "TEST1",
    chats: [
      {
        role: "model",
        parts: [{ text: "Hello! How can I assist you today?" }],
      },
    ],
  });

  useEffect(() => {
    setPrevChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? { ...chat, chats: selectedChat.chats }
          : chat
      )
    );
  }, [selectedChat]);

  return (
    <div className={styles.App}>
      <section className={styles.Header}>
        <img src="./chat-bot.png" alt="" className={styles.Logo} />
        <h4 className={styles.Title}>AI CHATBOT</h4>
      </section>
      <div className={styles.Main}>
        <Sidebar
          prevChats={prevChats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          setPrevChats={setPrevChats}
          className={styles.Sidebar}
        ></Sidebar>
        <Chat
          prevChats={prevChats}
          setPrevChats={setPrevChats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        ></Chat>
      </div>
    </div>
  );
}

export default App;
