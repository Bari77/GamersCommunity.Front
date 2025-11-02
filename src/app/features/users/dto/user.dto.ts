export interface UserDto {
    id: number;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
    mail: string;
    lastConnection: string;
    idKeycloak: string;
}
