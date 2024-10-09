
export enum SupportMessage{
    AddChat = "ADD_CHAT",
    UpdateChat = "UPDATE_CHAT"
}

type MessagePayload = {
    roomId : string;
    message : string;
    name : string;
    upvotes : number;
    chatId : string;
}

export type OutgoingMessage = {
    type : SupportMessage.AddChat,
    payload : MessagePayload
} | {
    type : SupportMessage.UpdateChat,
    payload : Partial<MessagePayload>
}

