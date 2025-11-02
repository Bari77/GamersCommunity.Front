import { UserDto } from "../dto/user.dto";

export class User {
    public constructor(public id: number) {}

    public static fromDto(dto: UserDto): User {
        return new User(dto.id);
    }
}
