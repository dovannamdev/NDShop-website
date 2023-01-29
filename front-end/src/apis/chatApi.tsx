import axiosClient from "./axiosClient";

const CHAT_API_ENDPOINT = "/chat";

const chatApi = {
  createUserChat: (userId: number, message: string) => {
    const url = CHAT_API_ENDPOINT + `/user/${userId}`;
    return axiosClient.post(url, { message });
  },

  getAllUserHaveChat: () => {
    const url = CHAT_API_ENDPOINT + `/user`;
    return axiosClient.get(url);
  },

  getUserChat: (userId: number) => {
    const url = CHAT_API_ENDPOINT + `/user/${userId}`;
    return axiosClient.get(url);
  },

  createUserChatReply: (userId: number, message: any, owner_reply: any) => {
    const url = CHAT_API_ENDPOINT + `/user/reply/${userId}`;
    return axiosClient.post(url, {message, owner_reply});
  },
};
export default chatApi;
