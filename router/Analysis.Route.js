const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const AnalysisInputHistory = require('../models/AnalysisInputHistory')
const Material = require('../models/materials')
const CertificateType = require('../models/certificateTypes')
const router = express.Router()

router.post('/histories', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const data = await AnalysisInputHistory.find({
        labId: req.body.labId,
        analysisId: req.body.analysisId,
        obj: req.body.obj
    }).populate('user').sort({ date: -1 })

    return res.json(data)
})

router.post('/input_history', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const data = await AnalysisInputHistory.find({
        labId: req.body.labId,
    }).populate('user').sort({ date: -1 })

    return res.json(data)
})

router.post('/check_obj', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const result1 = await Material.aggregate([
            { $unwind: '$objectiveValues' },
            {
                $project: {
                    'objectiveValues.analysis': 1,
                    'objectiveValues.unit': 1,
                    'objectiveValues.id': 1
                }
            },
            {
                $match: {
                    'objectiveValues.analysis': mongoose.Types.ObjectId(req.body.aType),
                    'objectiveValues.id': mongoose.Types.ObjectId(req.body.objective),
                    'objectiveValues.unit': mongoose.Types.ObjectId(req.body.unit)
                }
            }
        ])
        if (result1.length > 0) {
            return res.json({ success: false, message: 'Already used in material' });
        }
        const result2 = await CertificateType.aggregate([
            { $match: { 'analysises.id': mongoose.Types.ObjectId(req.body.aType) } },
            {
                $project: {
                    analysises: 1
                }
            },
            { $unwind: '$analysises' },
            { $match: { 'analysises.id': mongoose.Types.ObjectId(req.body.aType) } },
            { $unwind: '$analysises.objectives' },
            { $project: { objectives: '$analysises.objectives' } },
            { $match: { objectives: { id: mongoose.Types.ObjectId(req.body.objective), unit: mongoose.Types.ObjectId(req.body.unit) } } }
        ]);
        if (result2.length > 0) {
            return res.json({ success: false, message: 'Already used in certificate type' });
        }
        return res.json({ success: true })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(err.message);
    }
})

module.exports = router