import request from "../utils/request";
import endpoints from "../constants/apiEndpoints";
export const useDashboard = () => {

  const getSummaryUser = async (type) => {
    const response = await request.get(endpoints.DASHBOARD.UserSummary, {
      params: { type },
    });
    return response;
  };

  const getSummaryTestOrder = async (type) => {
    const response = await request.get(endpoints.DASHBOARD.TestOrderSummary, {
      params: { type },
    });
    return response;
  };
  
  const getStatisticsTestOrder = async (type) => {
    const response = await request.get(endpoints.DASHBOARD.TestOrderStatistics, {
        params: { type },
    });
    return response;
  };

    const getStatisticsPatient = async (type) => {
        const response = await request.get(endpoints.DASHBOARD.PatientStatistics, {
            params: { type},
        });
        return response;
    };

  

  return {
    getSummaryUser,
    getSummaryTestOrder,
    getStatisticsTestOrder,
    getStatisticsPatient,
  };
};
