// 获取题库列表
export const getBankList = async (pageNumber = 1, pageSize = 6) => {
  const response = await fetch(`http://localhost:7001/bank/list?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return response.json();
};

// 获取题库详情
export const getBankDetail = async (bankId) => {
  const response = await fetch(`http://localhost:7001/bank/${bankId}`);
  return response.json();
};
