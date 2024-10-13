import { Init } from "v8";
import z from "zod";

export enum SupportMessage {
    JoinRoom = 'JOIN_ROOM',
    SendMessage = 'SEND_MESSAGE',
    UpvoteMessage = 'UPVOTE_MESSAGE',
    GetMessages = 'GET_MESSAGES'
}

export type IncomingMessage = {
    type : SupportMessage.JoinRoom,
    payload : InitMessageType
} | {
    type : SupportMessage.SendMessage,
    payload : UserMessageType
} | {
    type : SupportMessage.UpvoteMessage,
    payload : UpvoteMessageType
} | {
    type : SupportMessage.GetMessages,
    payload : GetMessageType
}

export const InitMessage = z.object(
    {
        name : z.string(),
        userId : z.string(),
        roomId : z.string()
    }
)

export type InitMessageType = z.infer<typeof InitMessage>;

export const UserMessage = z.object({
    userId : z.string(),
    roomId : z.string(),
    message : z.string(),

})

export type UserMessageType = z.infer<typeof UserMessage>;

export const UpvoteMessage = z.object({
    userId : z.string(),
    roomId : z.string(),
    chatId : z.string(),
    
})

export type UpvoteMessageType = z.infer<typeof UpvoteMessage>;

export const GetMessages = z.object({
    roomId : z.string(),
    limit : z.number(),
    offset : z.number(),
    userId : z.string(),
})

export type GetMessageType = z.infer<typeof GetMessages>;