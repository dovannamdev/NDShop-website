const { mysql } = require("../configs/mysql.config");

const ChatModel = {
  getUserChatMessage: async (userId) => {
    try {
      const userChat =
        await mysql.query(`SELECT ucr.userId as clientId, ucr.message AS replyMessage, ucr.chatDate, urr.fullName as adFullname  
      FROM  userChat ucr
      LEFT JOIN Users urr ON ucr.userId = urr._id
      WHERE ucr.userId=${Number(userId)} AND ucr.ownerReply is null ORDER BY chatDate ASC`);

      const userReply =
        await mysql.query(`SELECT ucr.userId as clientId, ucr.ownerReply as ownerId, ucr.message AS replyMessage, ucr.chatDate, ad.fullName as adFullname  
      FROM  userChat ucr
      LEFT JOIN Admins ad ON ucr.ownerReply = ad._id
      WHERE ucr.ownerReply is not null AND ucr.userId=${Number(userId)} ORDER BY chatDate ASC`);
      
      const allChat = userChat.concat(userReply)
      allChat.sort(function (x, y) {
        return x.chatDate - y.chatDate;
      });
      return allChat || [];
    } catch (error) {
      console.log("getUserChatMessage error >>>> ", error);
      return [];
    }
  },

  createUserChat: async (userId, message) => {
    try {
      const res = await mysql.query(
        `INSERT INTO userChat(userId, message, chatDate) VALUES(${Number(
          userId
        )}, '${message}', Now())`
      );
      return res ? true : false;
    } catch (error) {
      console.log("createUserChat error >>>> ", error);
      return false;
    }
  },

  createUserChatReply: async (userId, message, ownerReply) => {
    try {
      const res = await mysql.query(
        `INSERT INTO userChat(userId, ownerReply, message, chatDate) VALUES(${Number(
          userId
        )}, ${Number(ownerReply)},'${message}', Now())`
      );
      return res ? true : false;
    } catch (error) {
      console.log("createUserChat error >>>> ", error);
      return false;
    }
  },

  getAllUserHaveChat: async () => {
    try {
      const response = await mysql.query(
        `SELECT ur._id, ur.fullName,
        (SELECT userChat.chatDate from userChat where userChat.userId = ur._id ORDER BY userChat.chatDate DESC LIMIT 1) as newCreatedMessage 
        FROM userChat uc JOIN users ur ON uc.userId = ur._id GROUP BY ur._id`
      );
      const allUser = [];
      if (response) allUser?.push(...response);

      allUser?.sort(function (x, y) {
        return new Date(y.newCreatedMessage) - new Date(x.newCreatedMessage);
      });

      const obj = {};
      for (const item of allUser) {
        if (!obj[item._id]?._id) {
          obj[item._id] = item;
        }
      }

      const output = Object.values(obj);
      output?.sort(function (x, y) {
        return new Date(y.newCreatedMessage) - new Date(x.newCreatedMessage);
      });
      return output || [];
    } catch (error) {
      console.log("getAllUserHaveChat error >>>> ", error);
      return [];
    }
  },
};

module.exports = ChatModel;
