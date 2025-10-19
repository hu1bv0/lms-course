import request from '../utils/request';
import endpoints from '../constants/apiEndpoints';




export const useRole = () => {
const getlistRoles = async () => {
    const response = await request.get(endpoints.ROLE.Listrole);
    return response;
};
const getlistPrivileges = async () => {
    const response = await request.get(endpoints.ROLE.Listprivilege);
    return response;
};
const createRole = async (data) => {
    const response = await request.post(endpoints.ROLE.CreateRole, data);
    return response;
};
const deleteRole = async (roleCode) => {
    const response = await request.delete(endpoints.ROLE.DeleteRole(roleCode));
    return response;
}

const Getdetailrole = async (roleCode) => {
    const response = await request.get(endpoints.ROLE.Getdetailrole(roleCode));
    return response;
}
const updateRole = async (roleCode, data) => {
    const response = await request.put(endpoints.ROLE.UpdateRole(roleCode), data);
    return response;
}

return { getlistRoles,getlistPrivileges,createRole,deleteRole,Getdetailrole,updateRole };
}