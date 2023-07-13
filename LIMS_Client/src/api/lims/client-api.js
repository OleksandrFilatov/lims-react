import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class ClientAPI {
    async create(data) {
        try {
            const res = await axiosFetch.post('/create_client', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error(err.response.data.message);
        }
    }

    async update(data) {
        try {
            const res = await axiosFetch.post('/update_client', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error(err.response.data.message);
        }
    }

    async delete(id) {
        try {
            console.log(id);
            const res = await axiosFetch.post('/delete_client', { id: id })
            return res.data;
        } catch (err) {
            console.log(err.response.data)
            toast.error(err.response.data.message);
        }
    }

    async upload(data) {
        try {
            const res = await axiosFetch.post('/upload_client_csv', {
                data: data
            });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error(err.response.data.message);
        }

    }

    async getClients() {
        try {
            const res = await axiosFetch.get('/get_all_clients');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }
}

export const clientAPI = new ClientAPI();