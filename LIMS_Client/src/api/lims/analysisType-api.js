import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class AnalysisTypeAPI {
    async create(data) {
        try {
            const res = await axiosFetch.post('/create_analysisType', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error(err.response.data.message);
        }
    }

    async update(data) {
        try {
            const res = await axiosFetch.post('/update_analysisType', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error(err.response.data.message);
        }
    }

    async delete(id) {
        try {
            const res = await axiosFetch.post('/delete_analysisType', { id: id })
            return res.data;
        } catch (err) {
            console.log(err.response.data)
            toast.error(err.response.data.message);
        }
    }

    async upload(data) {
        try {
            const res = await axiosFetch.post('/upload_analysisType_csv', {
                data: data
            });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error(err.response.data.message);
        }

    }

    async getAnalysisTypes() {
        try {
            const res = await axiosFetch.get('/get_all_analysisTypes');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }

    async dragAnalysisType(id, sourceIndex, destIndex) {
        try {
            const res = await axiosFetch.put('/drag_analysisTypes', { id, sourceIndex, destIndex });
            return res.data;
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }
}

export const analysisTypeAPI = new AnalysisTypeAPI();