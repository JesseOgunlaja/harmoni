import { useEffect } from "react";
import { ClientStream, createClientStream } from "streamthing";
import { useUser } from "@/components/protected/wrappers/UserProvider";
import { getRealtimeRolesToken } from "@/server/actions/utils";
import { FullComment, FullRole } from "@/server/db/schema";
import { env } from "@/server/env";

export function useRealtime(
	setRoles: React.Dispatch<React.SetStateAction<FullRole[]>>,
) {
	const user = useUser();

	useEffect(() => {
		let stream: ClientStream | undefined;
		getRealtimeRolesToken().then((token) => {
			stream = createClientStream({
				id: env.NEXT_PUBLIC_WEBSOCKET_SERVER_ID,
				region: env.NEXT_PUBLIC_WEBSOCKET_SERVER_REGION,
				token,
			});

			stream.receive("project-edited", (data) => {
				const { projectId, title, description, status } = JSON.parse(data);
				setRoles((currentRoles) => {
					return currentRoles.map((role) => {
						return role.projectId === Number(projectId)
							? {
									...role,
									project: {
										...role.project,
										title,
										description,
										status,
									},
								}
							: role;
					});
				});
			});

			stream.receive("project-status-changed", (data) => {
				const { projectId, newStatus } = JSON.parse(data);
				setRoles((currentRoles) =>
					currentRoles.map((role) =>
						role.projectId === projectId
							? { ...role, project: { ...role.project, status: newStatus } }
							: role,
					),
				);
			});

			stream.receive("project-member-added", (data) => {
				const { projectId, userId, user } = JSON.parse(data);
				setRoles((currentRoles) => {
					return currentRoles.map((role) => {
						return role.projectId === Number(projectId)
							? {
									...role,
									project: {
										...role.project,
										roles: [
											...role.project.roles,
											{
												projectId,
												userId: Number(userId),
												role: "regular",
												user,
											},
										],
									},
								}
							: role;
					});
				});
			});

			stream.receive("project-member-role-changed", (data) => {
				const { projectId, userId, newRole } = JSON.parse(data);
				setRoles((currentRoles) =>
					currentRoles.map((role) =>
						role.projectId === Number(projectId) &&
						role.userId === Number(userId)
							? {
									...role,
									project: {
										...role.project,
										roles: role.project.roles.map((member) =>
											member.userId === Number(userId)
												? { ...member, role: newRole }
												: member,
										),
									},
								}
							: role,
					),
				);
			});

			stream.receive("project-member-removed", (data) => {
				const { projectId, memberId } = JSON.parse(data);
				setRoles((currentRoles) =>
					user?.id === Number(memberId)
						? currentRoles.filter(
								(role) => role.projectId !== Number(projectId),
							)
						: currentRoles.map((role) =>
								role.projectId === Number(projectId)
									? {
											...role,
											project: {
												...role.project,
												roles: role.project.roles.filter(
													(member) => member.userId !== Number(memberId),
												),
											},
										}
									: role,
							),
				);
			});

			stream.receive("project-deleted", (projectId: string) => {
				setRoles((currentRoles) =>
					currentRoles.filter((role) => role.projectId !== Number(projectId)),
				);
			});

			stream.receive("new-comment", (data) => {
				const comment = JSON.parse(data) as FullComment;
				setRoles((currentRoles) =>
					currentRoles.map((role) =>
						role.projectId === comment.projectId
							? {
									...role,
									project: {
										...role.project,
										comments: [
											...role.project.comments,
											{ ...comment, createdAt: new Date(comment.createdAt) },
										],
									},
								}
							: role,
					),
				);
			});

			stream.receive("comment-deleted", (commentId: string) => {
				setRoles((currentRoles) =>
					currentRoles.map((role) =>
						role.project.comments.some(
							(comment) => comment.id === Number(commentId),
						)
							? {
									...role,
									project: {
										...role.project,
										comments: role.project.comments.filter(
											(comment) => comment.id !== Number(commentId),
										),
									},
								}
							: role,
					),
				);
			});
		});

		return () => {
			stream?.disconnect();
		};
	}, []);
}
