import { promiseToast } from "@/lib/lib";
import { addComment } from "@/server/actions/projects";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import ProfilePicture from "../ProfilePicture";
import { useRole } from "../wrappers/RoleProvider";
import { useUser } from "../wrappers/UserProvider";

export default function PostCommentForm() {
  const user = useUser()!;
  const router = useRouter();
  const { projectId } = useRole()!;
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  function formSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    promiseToast(
      new Promise((resolve, reject) => {
        addComment(comment, projectId).then((res) => {
          if (res.success) resolve(res.message);
          else reject(res.message);
        });
      }),
      {
        successFunction: () => {
          setComment("");
          router.refresh();
          setLoading(false);
        },
        errorFunction: () => setLoading(false),
      }
    );
  }

  return (
    <form onSubmit={formSubmit}>
      <label htmlFor="new-comment-textarea">
        <ProfilePicture name={user.name} />
      </label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        id="new-comment-textarea"
        placeholder="Add a comment..."
      />
      <button type="submit">Post Comment</button>
    </form>
  );
}
