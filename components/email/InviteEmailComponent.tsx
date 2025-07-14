interface PropsType {
  name: string;
  email: string;
  projectName: string;
  link: string;
}

export default function InviteEmailComponent({
  name,
  email,
  projectName,
  link,
}: PropsType) {
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
        New invite
      </h1>
      <p
        style={{
          boxSizing: "border-box",
          color: "rgba(0, 0, 0, 0.7)",
          marginBottom: "15px",
        }}
      >
        {name} ({email}) has invited you to &quot;{projectName}&quot;. To accept
        the invite click the button below.
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
        Accept invite
      </a>
    </div>
  );
}
