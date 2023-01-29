import axiosClient from "./axiosClient";

const COMMENT_API_ENDPOINT = "/comment";

const commentApi = {
  createProductComment: (commentData: any) => {
    const url = COMMENT_API_ENDPOINT;
    return axiosClient.post(url, commentData);
  },

  getCommentByProductCode: (productCode: any, offset: number, limit: number, status?: number) => {
    const url = COMMENT_API_ENDPOINT + `/list`;
    return axiosClient.get(url, { params: { productCode, offset, limit, status } });
  },

  createCommentChildren: (commentData: any) => {
    const url = COMMENT_API_ENDPOINT + "/children";
    return axiosClient.post(url, commentData);
  },

  deleteProductComment: (commentId: number) => {
    const url = COMMENT_API_ENDPOINT;
    return axiosClient.delete(url, { params: { commentId } });
  },

  deleteChildrenComment: (childrenId: number) => {
    const url = COMMENT_API_ENDPOINT + "/children";
    return axiosClient.delete(url, { params: { childrenId } });
  },

  updateProductCommentStatus: (commentId: number, status: number) => {
    const url = COMMENT_API_ENDPOINT + "/status";
    return axiosClient.put(url, { commentId, status } );
  },

  updateChildrenCommentStatus: (childrenId: number, status: number) => {
    const url = COMMENT_API_ENDPOINT + "/children/status";
    return axiosClient.put(url, { childrenId, status });
  },
};
export default commentApi;
