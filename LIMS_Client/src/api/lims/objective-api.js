import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class ObjectiveAPI {
    async create(data) {
        try {
            const res = await axiosFetch.post('/create_objective', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async update(data) {
        try {
            const res = await axiosFetch.post('/update_objective', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async delete(id) {
        try {
            const res = await axiosFetch.post('/delete_objective', { id: id })
            return res.data;
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }

    async upload(data) {
        try {
            const res = await axiosFetch.post('/upload_objective_csv', {
                data: data
            });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Internal server error');
        }

    }

    async getObjectives() {
        try {
            const res = await axiosFetch.get('/get_all_objectives');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }

    async dragObjective(id, sourceIndex, destIndex) {
        try {
            const res = await axiosFetch.put('/drag_objectives', { id, sourceIndex, destIndex });
            return res.data;
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }
}

export const objectiveAPI = new ObjectiveAPI();