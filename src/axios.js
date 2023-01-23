import axios from "axios";
const instance = axios.create({
  baseURL:
    "https://ticket-tracker-server-3qz11svs8-jjoshi247-gmailcom.vercel.app/api/v1/",
});

export default instance;
