import { formatCommentDate, promiseToast, validateWithSchema } from "@/lib/lib";
import { commentsSchema } from "@/lib/schema";
import { deleteComment, editComment } from "@/server/actions/projects";
import { FullComment } from "@/server/db/schema";
import styles from "@/styles/dialog/projectDisplay.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProfilePicture from "../ProfilePicture";
import { useRole } from "../wrappers/RoleProvider";
import { useUser } from "../wrappers/UserProvider";
import ManageCommentDropdown from "./ManageCommentDropdown";

interface PropsType {
  comment: FullComment;
}

export default function Comment({ comment }: PropsType) {
  const router = useRouter();
  const { role } = useRole()!;
  const { id: userId } = useUser()!;
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState(comment.content);

  function saveNewComment() {
    if (loading) return;

    if (!validateWithSchema(commentsSchema, newComment)) return;

    setLoading(true);
    promiseToast(
      new Promise((resolve, reject) => {
        editComment(newComment, comment.id).then((res) => {
          if (res.success) resolve(res.message);
          else reject(res.message);
        });
      }),
      {
        successFunction: () => {
          setIsEditing(false);
          setLoading(false);
          router.refresh();
        },
        errorFunction: () => setLoading(false),
      }
    );
  }

  function deleteButtonClick() {
    if (loading) return;
    setLoading(true);

    promiseToast(
      new Promise((resolve, reject) => {
        deleteComment(comment.id).then((res) => {
          if (res.success) resolve(res.message);
          else reject(res.message);
        });
      }),
      {
        successFunction: () => {
          setIsEditing(false);
          setLoading(false);
          router.refresh();
        },
        errorFunction: () => setLoading(false),
      }
    );
  }

  return (
    <div className={styles.comment} key={comment.id}>
      <div>
        <ProfilePicture name={comment.user.name} />
        <div>
          <p>{comment.user.name}</p>
          <p>{formatCommentDate(comment.createdAt)}</p>
        </div>
        {(comment.userId === userId ||
          role === "owner" ||
          role === "admin") && (
          <ManageCommentDropdown
            deleteButtonClick={deleteButtonClick}
            canEdit={comment.userId === userId}
            setIsEditing={setIsEditing}
          />
        )}
      </div>
      <div>
        {isEditing ? (
          <div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div>
              <button onClick={saveNewComment}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <p>{comment.content}</p>
        )}
      </div>
    </div>
  );
}
