import { Message } from "@/models/User.model";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>
    userAcceptMessage?: boolean
}