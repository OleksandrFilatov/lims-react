import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class LaboratoryAPI {
    async create(data) {
        try {
            const res = await axiosFetch.post('/api/inputLabs', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async delete(id) {
        try {
            const res = await axiosFetch.delete(`/api/inputLabs/${id}`)
            return res.data;
        } catch (err) {
            toast.error(err.response.data);
        }
    }

    async getLaboratories() {
        try {
            const res = await axiosFetch.get('/api/inputLabs');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }

    async saveWeight(data) {
        try {
            const res = await axiosFetch.post("/api/inputLabs/saveWeight", data)
            return res.data;
        } catch (err) {
            console.log(err.response.data);
        }
    }

    async saveChargeDate(data) {
        try {
            const res = await axiosFetch.post("/api/inputLabs/saveCharge", data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
        }
    }

    async saveAnalaysisType(data) {
        try {
            const res = await axiosFetch.post("/api/inputLabs/saveAnalysisTypes", data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
        }
    }

    async getCertificateTemplates() {
        try {
            const res = await axiosFetch.get("/api/inputLabs/certTemplates");
            return res.data;
        } catch (err) {
            console.log(err.response.data);
        }
    }

    async saveStockData(data) {
        try {
            const res = await axiosFetch.post("/api/inputLabs/saveStockSample", data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
        }
    }

    async uploadFile(data) {
        try {
            const res = await axiosFetch.post("/api/inputLabs/upload_laboratory_csv", {
                data: data,
            });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
        }
    }
}

export const laboratoryAPI = new LaboratoryAPI();