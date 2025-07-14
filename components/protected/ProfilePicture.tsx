import { getBackgroundColor } from "@/lib/lib";
import styles from "@/styles/dialog/projectDisplay.module.css";

const size = 35;
interface PropsType {
  name: string;
}

export default function ProfilePicture({ name }: PropsType) {
  const initials = name.slice(0, 2).toUpperCase();

  return (
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
  );
}
