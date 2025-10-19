import request from "../utils/request";
import endpoints from "../constants/apiEndpoints";

export const usePatient = () => {
  const getListPatient = async ({ page, limit, keyword }) => {
    const response = await request.get(endpoints.PATIENT.Listpatient, {
      params: { page, limit, keyword },
    });
    return response;
  };
  const createPatient = async (data) => {
    const response = await request.post(endpoints.PATIENT.Createpatient, data);
    return response;
  };
  const getPatientDetail = async (id) => {
    const response = await request.get(endpoints.PATIENT.Getpatientdetail(id));
    return response;
  };

  const updatePatient = async (id, data) => {
    const response = await request.put(
      endpoints.PATIENT.Updatepatient(id),
      data
    );
    return response;
  };

  const deletePatient = async (id) => {
    const url = endpoints.PATIENT.Deletepatient(id);
    console.log("Deleting patient at URL:", url);
    const response = await request.delete(endpoints.PATIENT.Deletepatient(id));
    return response;
  };

  return {
    getListPatient,
    createPatient,
    getPatientDetail,
    updatePatient,
    deletePatient,
  };
};
