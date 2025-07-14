import { getBackgroundColor } from "@/lib/lib";
import { getUserFromId } from "@/server/lib";
import styles from "@/styles/navbar.module.css";
import UserProvider from "../protected/wrappers/UserProvider";
import NavbarDropdown from "./NavbarDropdown";

const size = 50;
interface PropsType {
  id: number;
}

export default async function ProfilePicture({ id }: PropsType) {
  const user = await getUserFromId(id);
  const initials = user!.name.slice(0, 2).toUpperCase();

  return (
    <UserProvider user={user}>
      <NavbarDropdown>
        <svg id={styles.profilePicture} width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2}
            fill={getBackgroundColor(initials)}
          />
          <text
            x="50%"
            y="50%"
            fill="white"
            fontSize={size / 2.5}
            fontFamily="Arial, sans-serif"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {initials}
          </text>
        </svg>
      </NavbarDropdown>
    </UserProvider>
  );
}
