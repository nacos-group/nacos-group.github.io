export const request = async (url, method = "GET", headers = {}, body = {}) => {
  const res = await fetch(url, { headers, method, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(res.statusText);
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error)
  } else {
    return data;
  }
};