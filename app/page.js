export default function Home() {
  return (
    <main className="empty">
      <img
        className="logo"
        src="/capgemini-logo.png"
        alt="Capgemini"
        width={300}
      />

      <p className="tag">Build Challenge</p>

      <h1>Your canvas is empty</h1>
      <p className="lead">
        Tell Claude what you&apos;d like to build, and it will appear right here.
      </p>

      <p className="example">
        Try: &ldquo;Build me a tool to collect customer feedback.&rdquo;
      </p>

      <p className="hint">You have 2 hours — just describe your idea in your own words.</p>
    </main>
  );
}
