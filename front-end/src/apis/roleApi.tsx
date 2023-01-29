import axiosClient from "./axiosClient";

const ROLE_API_ENDPOINT = "/role";

const roleApi = {
  getRoleList: () => {
    const url = ROLE_API_ENDPOINT + "/list";
    return axiosClient.get(url);
  },

  createRole: (data: any) => {
    const url = ROLE_API_ENDPOINT + "/create";
    return axiosClient.post(url, data);
  },

  updateRole: (roleId: string, data: any) => {
    const url = ROLE_API_ENDPOINT + `/${roleId}/update`;
    return axiosClient.put(url, data);
  },

  deleteRole: (roleId: string) => {
    const url = ROLE_API_ENDPOINT + `/${roleId}/delete`;
    return axiosClient.delete(url);
  },

  getRoleDetail: (roleId: any) => {
    const url = ROLE_API_ENDPOINT + `/${roleId}`;
    return axiosClient.get(url);
  },

  getRoleByAdminId: (adminId: any) => {
    const url = ROLE_API_ENDPOINT + `/admin/${adminId}`;
    return axiosClient.get(url);
  }
}

export default roleApi