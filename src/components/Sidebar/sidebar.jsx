import { useEffect } from "react";
import styles from "./sidebar.module.css";

export function Sidebar({
  setPrevChats,
  prevChats,
  selectedChat,
  setSelectedChat,
}) {
  useEffect(() => {}, [selectedChat]);

  function handlePrevChatClick(id) {
    const selected = prevChats.find((prevChat) => prevChat.id === id);
    setSelectedChat(selected);
    buttonRef.styles.color.gray;
  }

  function handleNewChat() {
    setPrevChats((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        chatName: `TEST${prev.length + 1}`,
        chats: [
          { content: "Hello! How can I assist you today?", sender: "ai" },
        ],
      },
    ]);

    setSelectedChat(prevChats.at(-1));
  }

  return (
    <div className={styles.ChatContainer}>
      <button className={styles.NewChatButton} onClick={handleNewChat}>
        NEW CHAT
      </button>
      {prevChats.map((chat, index) => (
        <button
          key={index}
          className={`${styles.PrevChatButton} ${selectedChat.id === chat.id ? styles.PrevChatButtonActive : ''}`}
          onClick={() => handlePrevChatClick(chat.id)}
        >
          {" "}
          {chat.chatName}
        </button>
      ))}
    </div>
  );
}
