import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class GeologyAPI {
    async create() {
        try {
            const res = await axiosFetch.post('/api/geology');
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async update(data) {
        try {
            const res = await axiosFetch.post('/update_geology', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async delete(id) {
        try {
            const res = await axiosFetch.delete('/api/geology/' + id)
            return res.data;
        } catch (err) {
            console.log(err.response.data)
            toast.error('Internal server error');
        }
    }

    async upload(data) {
        try {
            const res = await axiosFetch.post('/upload_geology_csv', {
                data: data
            });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Internal server error');
        }

    }

    async getGeologies() {
        try {
            const res = await axiosFetch.get('/api/geology');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }

    async createGeneral(data) {
        try {
            const res = await axiosFetch.post('/api/geology/general', data);
            return res.data;
        } catch (err) {
            toast.error(err.response.data)
        }
    }

    async createMarkscheiderei(data) {
        try {
            const res = await axiosFetch.post('/api/geology/markscheiderei', data);
            return res.data;
        } catch (err) {
            toast.error(err.response.data)
        }
    }

    async createLaboratory(data) {
        try {
            const res = await axiosFetch.post('/api/geology/laboratory', data);
            return res.data;
        } catch (err) {
            toast.error(err.response.data)
        }
    }

    async createGeoGeology(data) {
        try {
            const res = await axiosFetch.post('/api/geology/geology', data);
            return res.data;
        } catch (err) {
            toast.error(err.response.data)
        }
    }

    async shiftGeology(data) {
        try {
            const res = await axiosFetch.put('/api/geology/shift', data);
            return res.data;
        } catch (err) {
            toast.error(err.response.data)
        }
    }

    async getGeologyComments(id) {
        try {
            const res = await axiosFetch.post('/api/geology/comments', { id });
            return res.data;
        } catch (err) {
            toast.error(err.response.data)
        }
    }

    async createGeologyLabObjective(data) {
        try {
            const res = await axiosFetch.post('/api/geology/geology_lab_objectives', data);
            return res.data;
        } catch (err) {
            toast.error(err.response.data);
        }
    }

    async getGeologyLabObjectives() {
        try {
            const res = await axiosFetch.get('/api/geology/geology_lab_objectives');
            return res.data;
        } catch (err) {
            toast.error(err.response.data);
        }
    }

    async deleteGeologyLabObjective(id) {
        try {
            const res = await axiosFetch.delete('/api/geology/geology_lab_objectives/' + id);
            return res.data.success;
        } catch (err) {
            toast.error(err.response.data);
        }
    }

    async uploadGeologyLabObjectives(data) {
        try {
            const res = await axiosFetch.post('/api/geology/upload_geology_lab_objective_csv', { data });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Internal server error');
        }

    }
}

export const geologyAPI = new GeologyAPI();