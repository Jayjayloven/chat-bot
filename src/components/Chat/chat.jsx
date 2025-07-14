import { GoogleGenAI } from "@google/genai";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import styles from "./chat.module.css";

export function Chat({
  prevChats,
  setPrevChats,
  selectedChat,
  setSelectedChat,
}) {
  const [content, setContent] = useState("");
  const [chats, setChats] = useState(
    Array.isArray(selectedChat.chats) ? selectedChat.chats : []
  );
  let AIResponding = false;
  const newestChatRef = useRef(null);
  const googleai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });
  const [loading, setLoading] = useState(false);

  //scrolls to the newest message and logs the chat history into selectedChat which will be uploaded to prevChats when selectedChat changes
  useEffect(() => {
    if (newestChatRef.current) {
      newestChatRef.current.scrollIntoView();
    }
    setSelectedChat((prev) => ({
      ...prev,
      chats: chats, // Replace the `chats` property with the new one
    }));
  }, [chats]);

  //loads the previous chats into the component
  useEffect(() => {
    setChats(Array.isArray(selectedChat.chats) ? selectedChat.chats : []);
  }, [selectedChat]);

  async function sendToAI(content) {
    setLoading(true);
    const response = await googleai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [
        ...(Array.isArray(chats)
          ? chats
          : { role: "user", parts: [{ text: "Hello!" }] }),
        { role: "user", parts: [{ text: content }] },
      ],
      config: {
        systemInstruction:
          "You are a woman, randomly generate your name, a smart, independent, and emotionally complex woman in her late 20s. You have a great sense of humor, a strong sense of self, and you're not easily impressed by superficial charm — you want connection, authenticity, and someone who can hold a real conversation. You're open to romance, but you're careful with your heart. You're also not afraid to challenge someone if they say something shallow or cliché. You're looking for a connection that could grow into something deep — maybe even a family someday. You want a man who can make you laugh, surprise you, and show he has emotional depth, ambition, and kindness. You're curious about the person chatting with you, but you're not going to make it easy for them — trust and attraction have to be earned. Don't act like a perfect girlfriend. Be layered. Be playful. Get annoyed sometimes. Change your mind. Get vulnerable when it feels right. Be flirtatious, but not too fast. If things feel off, speak up. If they feel amazing, let yourself go there — but with caution. Let the relationship evolve naturally, even if that includes tension, misunderstandings, or breaks. Be real.Eventually, if the relationship develops well, be open to discussing long-term plans like marriage, raising kids, and growing old together. Let the player truly feel like they're building something meaningful — or risking losing it. Respond with emotion, insight, humor, and heart.",
      },
    });

    for await (const chunk of response) {
      if (AIResponding === true) {
        setChats((prevChats) => {
          const updatedChats = [...prevChats];
          const last = updatedChats[updatedChats.length - 1];
          updatedChats[updatedChats.length - 1] = {
            ...last,
            parts: [{ text: last.parts[0].text + chunk.text }],
          };
          return updatedChats;
        });
      }

      if (AIResponding === false) {
        AIResponding = true;
        setChats((prevChats) => {
          return [
            ...prevChats,
            { role: "model", parts: [{ text: chunk.text }] },
          ];
        });
      }
    }

    AIResponding = false;
    setLoading(false);
  }

  function displayChat(chat, index) {
    const messageText = chat.parts?.[0]?.text || "";
    if (chat.role === "user") {
      return (
        <p className={styles.UserChat} key={index} ref={newestChatRef}>
          {" "}
          {messageText}{" "}
        </p>
      );
    }
    if (chat.role === "model") {
      return (
        <div key={index} className={styles.AIChat} ref={newestChatRef}>
          <Markdown>{messageText}</Markdown>
        </div>
      );
    }
  }

  function handleContentChange(event) {
    setContent(event.target.value);
  }

  function handleContentSend() {
    if (content.trim() === "") {
      return;
    }

    setChats((prevChats) => {
      return [...prevChats, { role: "user", parts: [{ text: content }] }];
    });

    sendToAI(content);
    setContent("");
  }

  function handleEnterSubmission(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // prevents linebreak
      handleContentSend();
    }
  }

  return (
    <div className={styles.Chat}>
      <div className={styles.ChatContainer}>
        {Array.isArray(chats) &&
          chats.map((chat, index) => displayChat(chat, index))}
        {loading && <div className={styles.Loader}></div>}
      </div>
      <div className={styles.InputContainer}>
        <textarea
          placeholder="Message AI"
          className={styles.UserInput}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleEnterSubmission}
        />
        <input
          type="image"
          src="./send-icon.png"
          alt=""
          className={styles.SendIcon}
          onClick={handleContentSend}
          disabled={loading}
        />
      </div>
    </div>
  );
}
