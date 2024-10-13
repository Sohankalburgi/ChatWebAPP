import { Chat } from "../store/Store";

export enum SupportMessage{
    AddChat = "ADD_CHAT",
    UpdateChat = "UPDATE_CHAT",
    GetChatId = "GET_CHATID",
    GetChats = "GET_CHATS"
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
} | {
    type : SupportMessage.GetChatId,
    payload : Partial<MessagePayload>
} | {
    type : SupportMessage.GetChats,
    payload : Partial<MessagePayload[]>,
}

