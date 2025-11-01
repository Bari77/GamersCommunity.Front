import { UserDto } from "../../features/auth/models/user.dto";

export class User {
    public constructor(public id: number) {}

    public static fromDto(dto: UserDto): User {
        return new User(dto.id);
    }
}
