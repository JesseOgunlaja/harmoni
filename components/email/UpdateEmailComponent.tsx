interface PropsType {
  name: string;
  link: string;
}

export default function UpdateEmailComponent({ name, link }: PropsType) {
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
        Update email
      </h1>
      <p
        style={{
          boxSizing: "border-box",
          color: "rgba(0, 0, 0, 0.7)",
          marginBottom: "15px",
        }}
      >
        To update your email for account &quot;{name}&quot; please click the
        button below.
      </p>
      <a
        href={link}
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
        Update email
      </a>
    </div>
  );
}
