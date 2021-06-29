import { getCustomRepository } from "typeorm";
import { sign } from "jsonwebtoken";
import { UsersRepositories } from "../repositories/UserRepositories";
import { compare } from "bcryptjs";

interface IAutheticateRequest {
    email: string,
    password: string,
}

class AuthenticateUserService {
    async execute({ email, password }: IAutheticateRequest) {
        const usersRepositories = getCustomRepository(UsersRepositories);

        const user = await usersRepositories.findOne({
            email,
        })

        if (!user) {
            throw new Error("Email/Password incorrect!");
        }

        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            throw new Error("Email/Password incorrect!");
        }

        const token = sign({
            email: user.email
        }, "4c1dbeff1e6fdf5826961cec3e277e65", {
            subject: user.id,
            expiresIn: "1d"
        });

        return token;
    }
}

export { AuthenticateUserService };