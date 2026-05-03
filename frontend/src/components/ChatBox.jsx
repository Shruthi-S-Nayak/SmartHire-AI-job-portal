import React, { useState, useEffect, useRef } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ChatBox = ({ applicationId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, [applicationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await API.get(`/chat/${applicationId}`);
      setMessages(data.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const { data } = await API.post(`/chat/${applicationId}`, { content: newMessage });
      setMessages([...messages, data.message]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-4 text-gray-500">Loading messages...</div>;

  return (
    <div className="flex flex-col h-96 border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3 font-medium text-sm">💬 Messages</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-8">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender._id === user._id;
            return (
              <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${isMe ? "bg-blue-600 text-white" : "bg-white text-gray-800 border border-gray-200"}`}>
                  {!isMe && <p className="text-xs font-semibold mb-1 text-blue-600">{msg.sender.name}</p>}
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2 p-3 bg-white border-t border-gray-200">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="input flex-1 text-sm"
        />
        <button type="submit" className="btn-primary text-sm px-4">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
