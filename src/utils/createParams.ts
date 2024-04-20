const createParams = (data: { [key: string]: any }) => {
  const params = new URLSearchParams();

  Object.entries(data)
    .filter(([_, v]) => v !== undefined)
    .forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((value) => params.append(`${k}[]`, value));
      } else {
        params.append(k, String(v));
      }
    });

  return params;
};

export default createParams;
