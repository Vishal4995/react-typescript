export default {
  api: {
    url: process.env.REACT_APP_PROD_API_URL,
    mode: 'cors'
  },
  socket: process.env.REACT_APP_PROD_SOCKET_URL
}
