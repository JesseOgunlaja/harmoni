import styles from "@/styles/dialog/projectDisplay.module.css";
import { useRole } from "../wrappers/RoleProvider";
import Comment from "./Comment";
import PostCommentForm from "./PostCommentForm";

export default function ProjectComments() {
  const { project } = useRole()!;

  return (
    <div id={styles.comments}>
      <p>Comments ({project.comments.length})</p>
      {project.comments
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      <PostCommentForm />
    </div>
  );
}
