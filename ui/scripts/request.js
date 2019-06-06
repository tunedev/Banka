const postRequest = async (url, requestData, token) => {
  let authorization;
  if (token) {
    authorization = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'default',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      authorization
    },
    body: JSON.stringify(requestData)
  });

  if (response.status === 201) {
    const responseData = await response.json();
    return responseData.data;
  } else {
    const responseData = await response.json();
    return responseData.error;
  }
};
