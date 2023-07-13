const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const Material = require('../models/materials')
const AnalysisTypes = require('../models/analysisTypes')
const Objective = require('../models/objectives');
const Unit = require('../models/units');
const Client = require('../models/clients');
const CertificateType = require('../models/certificateTypes')
const InputLab = require('../models/inputLab')
const CSV = require('csv-string');
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const objectives = await Objective.find().populate('units');
        const analysisTypes = await AnalysisTypes.find();
        const units = await Unit.find();
        const clients = await Client.find().select("_id, name");

        const materials = await Material.find().populate(['objectiveValues', 'clients', 'aTypesValues']);
        const obj_units = await Objective.aggregate([
            {
                $lookup: {
                    from: 'units',
                    localField: 'units',
                    foreignField: '_id',
                    as: 'unitsData'
                }
            },
            { $unwind: '$unitsData' },
            {
                $project: {
                    _id: 1,
                    objective: 1,
                    unit: '$unitsData.unit',
                    unit_id: '$unitsData._id',
                }
            },
            { $unwind: '$_id' },
            { $unwind: '$objective' },
            { $unwind: '$unit' },
            { $unwind: '$unit_id' },
            {
                "$addFields": {
                    "obj_id": { "$toString": "$_id" },
                    "u_id": { "$toString": "$unit_id" }
                }
            },
            { $unwind: '$obj_id' },
            { $unwind: '$u_id' },
            {
                $project: {
                    label: { $concat: ['$objective', ' ', '$unit'] },
                    value: { $concat: ['$obj_id', '-', '$u_id'] },
                }
            }
        ])
        res.send({ materials, objectives, analysisTypes, units, clients, obj_units });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
})

router.get('/clients/:id', async (req, res) => {
    const material = await Material.findById(req.params.id).populate('clients')
    const certTypes = await CertificateType.find({ material: req.params.id })
    return res.json({ material: material, certTypes: certTypes })
})

router.post('/check_client', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const result1 = await CertificateType.find({
            client: mongoose.Types.ObjectId(req.body.client),
            material: mongoose.Types.ObjectId(req.body.material)
        })
        if (result1.length > 0) {
            return res.json({ success: false, message: 'Already used in certificate type' });
        }
        const result2 = await InputLab.find({
            material_category: mongoose.Types.ObjectId(req.body.client),
            material: mongoose.Types.ObjectId(req.body.material)
        })
        if (result2.length > 0) {
            return res.json({ success: false, message: 'Already used in input laboratory' });
        }
        return res.json({ success: true })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json(err.message)
    }
})

router.post('/check_atype', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const result1 = await CertificateType.aggregate([
            { $unwind: '$analysises' },
            {
                $project: {
                    material: 1,
                    client: 1,
                    'analysisType': '$analysises.id'
                }
            },
            {
                $match: {
                    material: req.body.material,
                    client: mongoose.Types.ObjectId(req.body.client),
                    analysisType: mongoose.Types.ObjectId(req.body.analysisType)
                }
            }
        ])
        if (result1.length > 0) {
            return res.json({ success: false, message: 'Already used in Certificate Type' });
        }
        const result2 = await InputLab.aggregate([
            { $unwind: '$a_types' },
            {
                $project: {
                    material: 1,
                    client: 1,
                    'a_types': 1
                }
            },
            {
                $match: {
                    material: mongoose.Types.ObjectId(req.body.material),
                    client: mongoose.Types.ObjectId(req.body.client),
                    a_types: mongoose.Types.ObjectId(req.body.analysisType)
                }
            }
        ])
        if (result2.length > 0) {
            return res.json({ success: false, message: 'Already used in Input/Laboratory' });
        }
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json(err.message);
    }
})

router.post('/check_objective', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const result1 = await CertificateType.aggregate([
            { $unwind: '$analysises' },
            {
                $project: {
                    material: 1,
                    client: 1,
                    objectives: '$analysises.objectives'
                }
            },
            { $unwind: '$objectives' },
            {
                $project: {
                    material: 1,
                    client: 1,
                    objective: '$objectives.id'
                }
            },
            {
                $match: {
                    material: req.body.material,
                    client: mongoose.Types.ObjectId(req.body.client),
                    objective: mongoose.Types.ObjectId(req.body.objective)
                }
            }
        ])
        if (result1.length > 0) {
            return res.json({ success: false, message: 'Already used in Certificate Type' });
        }
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json(err.message);
    }
})

module.exports = router;