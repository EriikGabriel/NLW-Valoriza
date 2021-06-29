import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string;
}


export function ensureAutheticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).end();
    }

    const [, token] = authToken.split(" ");

    try {
        const { sub } = verify(token, "4c1dbeff1e6fdf5826961cec3e277e65") as IPayload;

        request.user_id = sub

        return next();
    } catch (error) {
        return response.status(401).end();
    }

}