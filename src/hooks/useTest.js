import request from "../utils/request";
import endpoints from "../constants/apiEndpoints";
import axios from "axios";
export const useTest = () => {
  const getListTest = async ({ page, limit }) => {
    const response = await request.get(endpoints.TEST.Listtest, {
      params: { page, limit },
    });
    return response;
  };

  const createTest = async (data) => {
    const response = await request.post(endpoints.TEST.Createtest, data);
    return response;
  };

  const searchTest = async (body, page, limit) => {
    console.log(body);
    const response = await request.post(endpoints.TEST.Searchtest, body, {
      params: { page, limit },
    });
    return response;
  };

  const getTestDetail = async (id) => {
    const response = await request.get(endpoints.TEST.Gettestdetail(id));
    return response;
  };
  const Createcomment = async (data) => {
    const response = await request.post(endpoints.TEST.Createcomment, data);
    return response;
  };
  const Getcomment = async (orderId) => {
    const response = await request.get(endpoints.TEST.Getcomment(orderId));
    return response;
  };
  const Deletecomment = async (commentId) => {
    const response = await request.delete(
      endpoints.TEST.Deletecomment(commentId)
    );
    return response;
  };
  const Updatecomment = async (commentId, data) => {
    const response = await request.put(
      endpoints.TEST.Updatecomment(commentId),
      data
    );
    return response;
  };
  const getSearchPatient = async (keyword) => {
    const response = await request.get(endpoints.TEST.Searchpatient, {
      params: { keyword },
    });
    return response;
  };

  const deleteTest = async (id) => {
    const response = await request.delete(endpoints.TEST.Deletetest(id));
    return response;
  };
  const mockResulttest = async (testOrderId) => {
    const response = await request.get(endpoints.RESULT.MockResult, {
      params: { testOrderId },
    });
    return response;
  };
  const getReviewAI = async (testResultId) => {
    const response = await request.get(
      endpoints.TEST.GetReviewAI(testResultId)
    );
    return response;
  };

  const createReviewAI = async (testResultId) => {
    const response = await request.post(
      endpoints.TEST.GetReviewAI(testResultId)
    );
    return response;
  };
  const exportExcel = async (orderIds) => {
    const response = await request.post(
      endpoints.TEST.ExportExcel,
      {
        orderIds,
      },
      {
        responseType: "blob",
      }
    );
    return response;
  };
  const getLogTimeline = async () => {
    const response = await request.get(endpoints.TEST.LogTimeline);
    return response;
  };

  return {
    getListTest,
    createTest,
    searchTest,
    getTestDetail,
    Createcomment,
    Getcomment,
    Deletecomment,
    Updatecomment,
    getSearchPatient,
    deleteTest,
    mockResulttest,
    getReviewAI,
    createReviewAI,
    exportExcel,
    getLogTimeline,
  };
};
