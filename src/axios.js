import axios from "axios";
const instance = axios.create({
  baseURL:
    //"http://127.0.0.1:8000/api/v1/",
    "https://ticket-tracker-server.vercel.app/api/v1/",
});

export default instance;
