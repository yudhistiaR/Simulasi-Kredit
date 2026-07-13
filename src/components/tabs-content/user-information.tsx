import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";

interface UserData {
	id: string;
	username: string;
	email: string;
	name: string;
}

export const UserInformationContent = ({
	userData,
}: {
	userData: UserData;
}) => {
	return (
		<FieldSet>
			<FieldGroup>
				<Field
					orientation="horizontal"
					className="grid grid-cols-[120px_1fr] items-center gap-4"
				>
					<FieldLabel htmlFor="username">Username</FieldLabel>
					<Input
						id="username"
						placeholder="Nama pengguna"
						defaultValue={userData.username}
					/>
				</Field>
				<Field
					orientation="horizontal"
					className="grid grid-cols-[120px_1fr] items-center gap-4"
				>
					<FieldLabel>Nama</FieldLabel>
					<Input placeholder="Nama pengguna" defaultValue={userData.name} />
				</Field>
				<Field
					orientation="horizontal"
					className="grid grid-cols-[120px_1fr] items-center gap-4"
				>
					<FieldLabel>Email</FieldLabel>
					<Input placeholder="Nama pengguna" defaultValue={userData.email} />
				</Field>
			</FieldGroup>
		</FieldSet>
	);
};
