import React from "react";
import useModalStore from "../../store/useModalStore";

export default function MessageThreadView({ thread, ownerName }) {
  return (
    <div className="space-y-4 flex flex-col">
      {thread.map((msg, idx) => {
        const isMe = msg.senderName === ownerName;
        return (
          <div
            key={idx}
            className={`flex flex-col max-w-[85%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
          >
            <div className="text-[10px] text-muted-foreground mb-1 font-medium px-1">
              {msg.timestamp} • {msg.location}
            </div>
            <div
              className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                isMe
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
            {msg.urgency === "high" && (
              <span className="text-[10px] text-destructive mt-1 font-bold uppercase tracking-tighter">
                Acil İleti
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

MessageThreadView.open = (thread, ownerName, contactName) => {
  const { openModal } = useModalStore.getState();
  openModal(
    `${ownerName} & ${contactName}`,
    <MessageThreadView
      thread={thread}
      ownerName={ownerName}
      contactName={contactName}
    />,
  );
};
