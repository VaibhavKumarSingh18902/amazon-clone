import axios from "axios";
const instance=axios.create({
    baseURL:'http://127.0.0.1:5001/clone-e6dc1/us-central1/api'// the api(cloud func) url
});
export default instance;

