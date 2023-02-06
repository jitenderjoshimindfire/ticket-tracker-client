import axios from "axios";
const instance = axios.create({
  baseURL: "https://ticket-tracker-server.vercel.app/api/v1/",
});

export default instance;
