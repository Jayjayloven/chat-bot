import styles from "./sidebar.module.css";

export function Sidebar({
  setPrevChats,
  prevChats,
  selectedChat,
  setSelectedChat,
}) {
  function handlePrevChatClick(id) {
    const selected = prevChats.find((prevChat) => prevChat.id === id);
    setSelectedChat(selected);
  }

  function handleNewChat() {
    setPrevChats((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        chatName: `TEST${prev.length + 1}`,
        chats: [
          {
            role: "model",
            parts: [{ text: "Hello! How can I assist you today?" }],
          },
        ],
      },
    ]);
  }

  return (
    <div className={styles.ChatContainer}>
      <button className={styles.NewChatButton} onClick={handleNewChat}>
        NEW CHAT
      </button>
      {prevChats.map((chat) => (
        <button
          key={chat.id}
          className={`${styles.PrevChatButton} ${
            selectedChat.id === chat.id ? styles.PrevChatButtonActive : ""
          }`}
          onClick={() => handlePrevChatClick(chat.id)}
        >
          {" "}
          {chat.chatName}
        </button>
      ))}
    </div>
  );
}
