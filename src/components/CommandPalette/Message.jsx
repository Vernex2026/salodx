export default function Message({ role, content, streaming }) {
  const isUser = role === "user";
  return (
    <div>
      <div
        className={`cmdk-message-role cmdk-message-role--${isUser ? "user" : "assistant"}`}
      >
        {isUser ? "Ty" : "Vernex Agent"}
      </div>
      <div
        className={`cmdk-message-body cmdk-message-body--${isUser ? "user" : "assistant"}`}
      >
        {content}
        {streaming && <span className="cmdk-cursor">▍</span>}
      </div>
    </div>
  );
}
