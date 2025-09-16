export const formatObjUtil = (obj: Record<string, any>) => {
  const formattedObj: Record<string, any> = {}; // Khởi tạo đối tượng mới

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      formattedObj[key] = value; // Chỉ thêm vào nếu giá trị không phải null, undefined hoặc chuỗi rỗng
    }
  });

  return formattedObj;
};
