import { formatRole } from "@/lib/lib";
import "@/styles/utils/projectRolesTable.css";
import ManageUserDropdown from "../projects/ManageUserDropdown";
import { useRole } from "../wrappers/RoleProvider";

interface PropsType {
  isEditing?: boolean;
}

export default function ProjectRolesTable({ isEditing = true }: PropsType) {
  const role = useRole()!;
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          {isEditing && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {role.project.roles.map((roleItem, index) => (
          <tr key={index}>
            <td>{roleItem.user.name}</td>
            <td>{roleItem.user.email}</td>
            <td>{formatRole(roleItem.role)}</td>
            {isEditing && (
              <td>
                <ManageUserDropdown
                  projectId={role.project.id}
                  role={roleItem}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
