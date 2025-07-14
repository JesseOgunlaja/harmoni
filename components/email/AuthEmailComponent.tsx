interface PropsType {
  code: string;
  magicLink: string;
}

export default function AuthEmailComponent({ code, magicLink }: PropsType) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        fontFamily: "Segoe UI",
        maxWidth: "600px",
        margin: "0 auto",
        paddingTop: "25px",
        paddingBottom: "75px",
      }}
    >
      <h1
        style={{
          boxSizing: "border-box",
          fontWeight: 500,
          fontSize: "23px",
          marginBottom: "5px",
        }}
      >
        Sign up for Harmoni
      </h1>
      <p
        style={{
          boxSizing: "border-box",
          color: "rgba(0, 0, 0, 0.7)",
          marginBottom: "15px",
        }}
      >
        You can sign up by simply clicking the magic link, or by entering the
        code on the sign up page in Harmoni.
      </p>
      <p
        style={{
          boxSizing: "border-box",
          background: "#f4f4f4",
          border: "1px solid #eeeeee",
          padding: "10px",
          fontSize: "22px",
          fontFamily: "monospace",
          fontWeight: "500",
          color: "black",
          textAlign: "center",
          marginBottom: "20px",
          borderRadius: "10px",
        }}
      >
        {code}
      </p>
      <a
        href={magicLink}
        style={{
          boxSizing: "border-box",
          background: "#2383e2",
          display: "block",
          border: "1px solid #308bbf",
          padding: "10px",
          fontWeight: "500",
          textAlign: "center",
          color: "white",
          borderRadius: "10px",
          textDecoration: "none",
        }}
      >
        Sign in with Magic Link
      </a>
    </div>
  );
}
