const express = require('express')
const passport = require('passport')
const router = express.Router()
const mongoose = require('mongoose');
const moment = require('moment');
const CSV = require('csv-string');
const Geology = require('../models/GeologyModel');
const OreType = require('../models/oreModel');
const MovementHistory = require('../models/movementModel');
const GeoGeneral = require('../models/GeoGeneralHistory');
const GeoMarkscheiderei = require('../models/GeoMarkscheidereiHistory');
const GeoLaboratory = require('../models/GeoLaboratoryHistory');
const GeoGeology = require('../models/GeoGeologyHistory');
const GeologyLabObjective = require('../models/GeologyLabObjective');
const Objective = require('../models/objectives');
const Unit = require('../models/units');

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const ids = await Geology.find().select('id');
        const params = ids.map(id => mongoose.Types.ObjectId(id.id));
        const geologies = await getGeologiesData(params);
        return res.json(geologies);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const geologies = await Geology.find();
        let geo_id = 1;
        if (geologies.length) {
            const max_id = Math.max.apply(Math, geologies.map(data => data.geology_id));
            if (max_id === geologies.length) {
                geo_id = max_id + 1;
            } else {
                var a = geologies.map(data => Number(data.geology_id));
                var missing = new Array();

                for (var i = 1; i <= max_id; i++) {
                    if (a.indexOf(i) == -1) {
                        missing.push(i);
                    }
                }
                geo_id = Math.min.apply(Math, missing)
            }
        }
        const geology = await Geology.create({
            geology_id: geo_id
        });

        const geology_lab_objectives = await GeologyLabObjective.find();
        let objective_values = [];
        geology_lab_objectives.map(data => {
            objective_values.push({
                obj: data._id,
                analysisType: null,
                value: 0,
                reason: null
            })
        })

        const newGeoLaboratory = await GeoLaboratory.create({
            date: { value: new Date(), reason: null },
            level: { value: '', reason: null },
            subset: { value: '', reason: null },
            thickness: { value: 0, reason: null },
            distance: { value: 0, reason: null },
            objective_values: objective_values,
            weight: { value: 0, reason: null },
            geology: geology._id,
            user: req.user._id,
            comment: '',
            reg_date: new Date()
        });
        geology.laboratory = newGeoLaboratory._id;
        await geology.save();
        const added_geology = await getGeologyData(geology._id);
        return res.json(added_geology);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.post('/general', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const check_geology = await Geology.findOne({
            geology_id: req.body.geology_id,
            _id: { $ne: mongoose.Types.ObjectId(req.body.id) }
        });
        if (check_geology) {
            return res.status(400).json('ID already exists');
        }
        const newGeoGeneral = await GeoGeneral.create({
            hole_id: { value: req.body.values.hole_id.value, reason: req.body.values.hole_id.reason ? mongoose.Types.ObjectId(req.body.values.hole_id.reason) : null },
            materialType: { value: req.body.values.materialType.value, reason: req.body.values.materialType.reason ? mongoose.Types.ObjectId(req.body.values.materialType.reason) : null },
            geology: req.body.id,
            user: req.user._id,
            comment: req.body.comment,
            reg_date: new Date()
        });
        const geology = await Geology.findById(mongoose.Types.ObjectId(req.body.id));
        geology.general = newGeoGeneral._id;
        geology.geology_id = req.body.geology_id;
        await geology.save();

        const updated_geology = await getGeologyData(req.body.id);
        return res.json(updated_geology);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.post('/markscheiderei', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const newGeoMarkscheiderei = await GeoMarkscheiderei.create({
            east: { value: req.body.values.east.value, reason: req.body.values.east.reason ? mongoose.Types.ObjectId(req.body.values.east.reason) : null },
            north: { value: req.body.values.north.value, reason: req.body.values.north.reason ? mongoose.Types.ObjectId(req.body.values.north.reason) : null },
            elev: { value: req.body.values.elev.value, reason: req.body.values.elev.reason ? mongoose.Types.ObjectId(req.body.values.elev.reason) : null },
            length: { value: req.body.values.length.value, reason: req.body.values.length.reason ? mongoose.Types.ObjectId(req.body.values.length.reason) : null },
            category: { value: req.body.values.category.value, reason: req.body.values.category.reason ? mongoose.Types.ObjectId(req.body.values.category.reason) : null },
            to: { value: req.body.values.to.value, reason: req.body.values.to.reason ? mongoose.Types.ObjectId(req.body.values.to.reason) : null },
            azimut: { value: req.body.values.azimut.value, reason: req.body.values.azimut.reason ? mongoose.Types.ObjectId(req.body.values.azimut.reason) : null },
            dip: { value: req.body.values.dip.value, reason: req.body.values.dip.reason ? mongoose.Types.ObjectId(req.body.values.dip.reason) : null },
            geology: req.body.id,
            user: req.user._id,
            comment: req.body.comment,
            reg_date: new Date()
        });
        const geology = await Geology.findById(mongoose.Types.ObjectId(req.body.id));
        geology.markscheiderei = newGeoMarkscheiderei._id;
        await geology.save();

        const updated_geology = await getGeologyData(req.body.id);
        return res.json(updated_geology);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.post('/laboratory', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const newGeoLaboratory = await GeoLaboratory.create({
            date: { value: req.body.fixedValues.date.value, reason: req.body.fixedValues.date.reason ? mongoose.Types.ObjectId(req.body.fixedValues.date.reason) : null },
            level: { value: req.body.fixedValues.level.value, reason: req.body.fixedValues.level.reason ? mongoose.Types.ObjectId(req.body.fixedValues.level.reason) : null },
            subset: { value: req.body.fixedValues.subset.value, reason: req.body.fixedValues.subset.reason ? mongoose.Types.ObjectId(req.body.fixedValues.subset.reason) : null },
            thickness: { value: req.body.fixedValues.thickness.value, reason: req.body.fixedValues.thickness.reason ? mongoose.Types.ObjectId(req.body.fixedValues.thickness.reason) : null },
            distance: { value: req.body.fixedValues.distance.value, reason: req.body.fixedValues.distance.reason ? mongoose.Types.ObjectId(req.body.fixedValues.distance.reason) : null },
            objective_values: req.body.objValues,
            weight: { value: req.body.fixedValues.weight.value, reason: req.body.fixedValues.weight.reason ? mongoose.Types.ObjectId(req.body.fixedValues.weight.reason) : null },
            geology: req.body.id,
            user: req.user._id,
            comment: req.body.comment,
            reg_date: new Date()
        });

        const geology = await Geology.findById(mongoose.Types.ObjectId(req.body.id));
        geology.laboratory = newGeoLaboratory._id;
        await geology.save();

        const updated_geology = await getGeologyData(req.body.id);
        return res.json(updated_geology);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.get('/values', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const geology = await Geology.findById(req.query.id);
        if (!geology) {
            return res.status(400).json({ message: 'Not exist' });
        }
        const general = await GeoGeneral.findById(mongoose.Types.ObjectId(geology.general));
        const markscheiderei = await GeoMarkscheiderei.findById(mongoose.Types.ObjectId(geology.markscheiderei));
        const laboratory = await GeoLaboratory.findById(mongoose.Types.ObjectId(geology.laboratory));
        const geogeology = await GeoGeology.findById(mongoose.Types.ObjectId(geology.geology));
        return res.json({ general, markscheiderei, laboratory, geogeology });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

router.post('/geology', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const newGeoGeology = await GeoGeology.create({
            sample: { value: req.body.values.sample.value, reason: req.body.values.sample.reason ? mongoose.Types.ObjectId(req.body.values.sample.reason) : null },
            from: { value: req.body.values.from.value, reason: req.body.values.from.reason ? mongoose.Types.ObjectId(req.body.values.from.reason) : null },
            to: { value: req.body.values.to.value, reason: req.body.values.to.reason ? mongoose.Types.ObjectId(req.body.values.to.reason) : null },
            thk: { value: req.body.values.thk.value, reason: req.body.values.thk.reason ? mongoose.Types.ObjectId(req.body.values.thk.reason) : null },
            oreType: { value: req.body.values.oreType.value, reason: req.body.values.oreType.reason ? mongoose.Types.ObjectId(req.body.values.oreType.reason) : null },
            rxqual: { value: req.body.values.rxqual.value, reason: req.body.values.rxqual.reason ? mongoose.Types.ObjectId(req.body.values.rxqual.reason) : null },
            fest: { value: req.body.values.fest.value, reason: req.body.values.fest.reason ? mongoose.Types.ObjectId(req.body.values.fest.reason) : null },
            locker: { value: req.body.values.locker.value, reason: req.body.values.locker.reason ? mongoose.Types.ObjectId(req.body.values.locker.reason) : null },
            sanding: { value: req.body.values.sanding.value, reason: req.body.values.sanding.reason ? mongoose.Types.ObjectId(req.body.values.sanding.reason) : null },
            drills: { value: req.body.values.drills.value, reason: req.body.values.drills.reason ? mongoose.Types.ObjectId(req.body.values.drills.reason) : null },
            geology: req.body.id,
            user: req.user._id,
            comment: req.body.comment,
            reg_date: new Date()
        });

        const geology = await Geology.findById(mongoose.Types.ObjectId(req.body.id));
        geology.geology = newGeoGeology._id;
        await geology.save();

        const updated_geology = await getGeologyData(req.body.id);
        return res.json(updated_geology);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

const getGeologiesData = async (ids) => {
    try {
        const data = await Geology.aggregate([
            {
                $match: { _id: { $in: ids } }
            },
            {
                $lookup: {
                    from: 'geogenerals',
                    localField: 'general',
                    foreignField: '_id',
                    as: 'general_data'
                }
            },
            {
                $lookup: {
                    from: 'geomarkscheidereis',
                    localField: 'markscheiderei',
                    foreignField: '_id',
                    as: 'markscheiderei_data'
                }
            },
            {
                $lookup: {
                    from: 'geolaboratories',
                    localField: 'laboratory',
                    foreignField: '_id',
                    as: 'laboratory_data'
                }
            },
            {
                $lookup: {
                    from: 'geogeologies',
                    localField: 'geology',
                    foreignField: '_id',
                    as: 'geology_data'
                }
            },
            { $unwind: '$laboratory_data' },
            { $unwind: '$laboratory_data.objective_values' },
            {
                $lookup: {
                    from: 'geology_lab_objectives',
                    localField: 'laboratory_data.objective_values.obj',
                    foreignField: '_id',
                    as: 'laboratory_data.objective_values.obj'
                }
            },
            { $unwind: '$laboratory_data.objective_values.obj' },
            {
                $lookup: {
                    from: 'objectives',
                    localField: 'laboratory_data.objective_values.obj.objective',
                    foreignField: '_id',
                    as: 'laboratory_data.objective_values.obj.objective'
                }
            },
            {
                $lookup: {
                    from: 'units',
                    localField: 'laboratory_data.objective_values.obj.unit',
                    foreignField: '_id',
                    as: 'laboratory_data.objective_values.obj.unit'
                }
            },
            { $unwind: '$laboratory_data.objective_values.obj.objective' },
            { $unwind: '$laboratory_data.objective_values.obj.unit' },
            {
                "$group": {
                    "_id": { _id: "$_id", lab_id: "$laboratory_data._id" },
                    "geology_id": { "$first": "$geology_id" },
                    "general": { "$first": "$general" },
                    "general_data": { "$first": "$general_data" },
                    "markscheiderei": { "$first": "$markscheiderei" },
                    "markscheiderei_data": { "$first": "$markscheiderei_data" },
                    "geology": { "$first": "$geology" },
                    "geology_data": { "$first": "$geology_data" },
                    "laboratory": { "$first": "$laboratory" },
                    "lab_date": { "$first": "$laboratory_data.date" },
                    "level": { "$first": "$laboratory_data.level" },
                    "subset": { "$first": "$laboratory_data.subset" },
                    "thickness": { "$first": "$laboratory_data.thickness" },
                    "distance": { "$first": "$laboratory_data.distance" },
                    "weight": { "$first": "$laboratory_data.weight" },
                    "reg_date": { "$first": "$laboratory_data.reg_date" },
                    "comment": { "$first": "$laboratory_data.comment" },
                    "lab_geology": { "$first": "$laboratory_data.geology" },
                    "user": { "$first": "$laboratory_data.user" },
                    "objective_values": { "$push": "$laboratory_data.objective_values" },
                    "check_status": { "$first": "$check_status" },
                    "date": { "$first": "$date" },
                }
            },
            {
                $addFields: {
                    laboratory_data: {
                        "date": "$lab_date",
                        "level": "$level",
                        "subset": "$subset",
                        "thickness": "$thickness",
                        "distance": "$distance",
                        "weight": "$weight",
                        "reg_date": "$reg_date",
                        "comment": "$comment",
                        "geology": "$lab_geology",
                        "user": "$user",
                        "objective_values": "$objective_values",
                    }
                }
            },
            {
                $project: {
                    "_id": "$_id._id",
                    "geology_id": 1,
                    "general": 1,
                    "general_data": 1,
                    "markscheiderei": 1,
                    "markscheiderei_data": 1,
                    "geology": 1,
                    "geology_data": 1,
                    "laboratory": 1,
                    "check_status": 1,
                    "date": 1,
                    "laboratory_data": 1
                }
            }
        ])
        return data;
    } catch (err) {
        return err.message;
    }
}

const getGeologyData = async (id) => {
    try {
        const data = await Geology.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'geogenerals',
                    localField: 'general',
                    foreignField: '_id',
                    as: 'general_data'
                }
            },
            {
                $lookup: {
                    from: 'geomarkscheidereis',
                    localField: 'markscheiderei',
                    foreignField: '_id',
                    as: 'markscheiderei_data'
                }
            },
            {
                $lookup: {
                    from: 'geolaboratories',
                    localField: 'laboratory',
                    foreignField: '_id',
                    as: 'laboratory_data'
                }
            },
            {
                $lookup: {
                    from: 'geogeologies',
                    localField: 'geology',
                    foreignField: '_id',
                    as: 'geology_data'
                }
            },
            { $unwind: '$laboratory_data' },
            { $unwind: '$laboratory_data.objective_values' },
            {
                $lookup: {
                    from: 'geology_lab_objectives',
                    localField: 'laboratory_data.objective_values.obj',
                    foreignField: '_id',
                    as: 'laboratory_data.objective_values.obj'
                }
            },
            { $unwind: '$laboratory_data.objective_values.obj' },
            {
                $lookup: {
                    from: 'objectives',
                    localField: 'laboratory_data.objective_values.obj.objective',
                    foreignField: '_id',
                    as: 'laboratory_data.objective_values.obj.objective'
                }
            },
            {
                $lookup: {
                    from: 'units',
                    localField: 'laboratory_data.objective_values.obj.unit',
                    foreignField: '_id',
                    as: 'laboratory_data.objective_values.obj.unit'
                }
            },
            { $unwind: '$laboratory_data.objective_values.obj.objective' },
            { $unwind: '$laboratory_data.objective_values.obj.unit' },
            {
                "$group": {
                    "_id": { _id: "$_id", lab_id: "$laboratory_data._id" },
                    "geology_id": { "$first": "$geology_id" },
                    "general": { "$first": "$general" },
                    "general_data": { "$first": "$general_data" },
                    "markscheiderei": { "$first": "$markscheiderei" },
                    "markscheiderei_data": { "$first": "$markscheiderei_data" },
                    "geology": { "$first": "$geology" },
                    "geology_data": { "$first": "$geology_data" },
                    "laboratory": { "$first": "$laboratory" },
                    "lab_date": { "$first": "$laboratory_data.date" },
                    "level": { "$first": "$laboratory_data.level" },
                    "subset": { "$first": "$laboratory_data.subset" },
                    "thickness": { "$first": "$laboratory_data.thickness" },
                    "distance": { "$first": "$laboratory_data.distance" },
                    "weight": { "$first": "$laboratory_data.weight" },
                    "reg_date": { "$first": "$laboratory_data.reg_date" },
                    "comment": { "$first": "$laboratory_data.comment" },
                    "lab_geology": { "$first": "$laboratory_data.geology" },
                    "user": { "$first": "$laboratory_data.user" },
                    "objective_values": { "$push": "$laboratory_data.objective_values" },
                    "check_status": { "$first": "$check_status" },
                    "date": { "$first": "$date" },
                }
            },
            {
                $addFields: {
                    laboratory_data: {
                        "date": "$lab_date",
                        "level": "$level",
                        "subset": "$subset",
                        "thickness": "$thickness",
                        "distance": "$distance",
                        "weight": "$weight",
                        "reg_date": "$reg_date",
                        "comment": "$comment",
                        "geology": "$lab_geology",
                        "user": "$user",
                        "objective_values": "$objective_values",
                    }
                }
            },
            {
                $project: {
                    "_id": "$_id._id",
                    "geology_id": 1,
                    "general": 1,
                    "general_data": 1,
                    "markscheiderei": 1,
                    "markscheiderei_data": 1,
                    "geology": 1,
                    "geology_data": 1,
                    "laboratory": 1,
                    "check_status": 1,
                    "date": 1,
                    "laboratory_data": 1
                }
            }
        ])
        return data[0];
    } catch (err) {
        return err.message;
    }
}

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const geology = await Geology.findById(req.params.id);
        if (!geology) {
            return res.status(400).json({ message: 'Geology does not exist' });
        }
        await geology.remove();

        await GeoGeneral.deleteMany({ geology: req.params.id });
        await GeoMarkscheiderei.deleteMany({ geology: req.params.id });
        await GeoLaboratory.deleteMany({ geology: req.params.id });
        await GeoGeology.deleteMany({ geology: req.params.id });
        await MovementHistory.deleteMany({ geology_id: req.params.id });

        const ids = await Geology.find().select('id');
        const params = ids.map(id => mongoose.Types.ObjectId(id.id));
        const geologies = await getGeologiesData(params);
        return res.json(geologies);
    } catch (err) {
        return res.status(500).json(err.message);
    }
})

router.put('/shift', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const geology = await Geology.findById(req.body.id);

        const list = ['Input Required', 'Check', 'Checked / To be Exported', 'Export Finished'];
        await MovementHistory.create({
            geology_id: req.body.id,
            from: list[Number(geology.check_status)],
            to: list[Number(req.body.step)],
            reason: req.body.reason,
            user: req.user._id,
            date: new Date()
        });

        if (geology.check_status < 4) {
            geology.check_status = req.body.step;
        }
        await geology.save();

        const updated_geology = await getGeologyData(req.body.id);
        return res.json(updated_geology);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.post('/comments', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const comments = await MovementHistory
            .find({ geology_id: req.body.id })
            .populate(['user'])
        return res.json(comments);
    } catch (err) {
        return res.status(500).json(err.message);
    }
})

router.post('/exported', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const availables = await Geology.find({ check_status: 2 }).populate(['geology.ore']);

        await Promise.all(availables.map(async item => {
            item.check_status = 3;
            await item.save();

            await MovementHistory.create({
                geology_id: item._id,
                from: 'Checked / To be Exported',
                to: 'Export Finished',
                reason: 'Exported',
                user: req.user._id,
                date: new Date()
            });
        }));

        const updated_ids = availables.map(item => mongoose.Types.ObjectId(item._id));
        const data = await getGeologiesData(updated_ids);
        return res.json(data);
    } catch (err) {
        return res.status(500).json(err.message);
    }
})

router.post('/exported/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const availables = await Geology.find({ check_status: 2, _id: req.params.id }).populate(['geology.ore']);

        await Promise.all(availables.map(async item => {
            item.check_status = 3;
            await item.save();

            await MovementHistory.create({
                geology_id: req.params.id,
                from: 'Checked / To be Exported',
                to: 'Export Finished',
                reason: 'Exported',
                user: req.user._id,
                date: new Date()
            });
        }));

        const updated_geology = await getGeologyData(req.params.id);
        return res.json(updated_geology);
    } catch (err) {
        return res.status(500).json(err.message);
    }
})

router.post('/chartdata', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const oreTypes = await OreType.find();
        let ores = oreTypes.map(ore => mongoose.Types.ObjectId(ore._id));
        let categories = ['SP', 'VP', 'BN'];
        let from = new Date('1970-01-01');
        let to = new Date('2099-12-31');
        if (req.body.selected_categories.length > 0) categories = req.body.selected_categories;
        if (req.body.date_range.length > 0 && req.body.date_range[0] !== '') from = new Date(req.body.date_range[0]);
        if (req.body.date_range.length > 0 && req.body.date_range[1] !== '') to = moment(new Date(req.body.date_range[1])).add(1, 'days').toDate();
        if (req.body.ores.length > 0) ores = req.body.ores.map(ore => mongoose.Types.ObjectId(ore));

        const data = await Geology.aggregate([
            { $match: { laboratory: { $ne: null } } },
            {
                $lookup: {
                    from: 'geomarkscheidereis',
                    localField: 'markscheiderei',
                    foreignField: '_id',
                    as: 'markscheiderei_data'
                }
            },
            {
                $lookup: {
                    from: 'geogeologies',
                    localField: 'geology',
                    foreignField: '_id',
                    as: 'geology_data'
                }
            },
            {
                $lookup: {
                    from: 'geogenerals',
                    localField: 'general',
                    foreignField: '_id',
                    as: 'general_data'
                }
            },
            { $unwind: '$markscheiderei_data' },
            { $unwind: '$geology_data' },
            { $unwind: '$general_data' },
            {
                $match: {
                    'markscheiderei_data.category.value': { $in: categories },
                    'geology_data.oreType.value': { $in: ores },
                    'general_data.hole_id.value': { $regex: req.body.holeId, $options: 'i' }
                }
            },
            {
                $project: {
                    _id: 1,
                    geology_id: 2,
                    general: 1,
                    markscheiderei: 1,
                    laboratory: 1,
                    geology: 1,
                    check_status: 1,
                    date: 1,
                    'hole_id': '$general_data.hole_id.value'
                }
            },
            {
                $lookup: {
                    from: 'geolaboratories',
                    localField: '_id',
                    foreignField: 'geology',
                    as: 'laboratory_data'
                }
            },
            {
                $project: {
                    geology_id: 1,
                    hole_id: 1,
                    check_status: 1,
                    date: 1,
                    'laboratory_data': { "$ifNull": ["$laboratory_data", []] }
                }
            },
            {
                "$unwind": {
                    "path": "$laboratory_data",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $match: {
                    'laboratory_data.date.value': {
                        $gte: from,
                        $lt: to
                    },
                    'laboratory_data.level.value': { $regex: req.body.level, $options: 'i' }
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "laboratory_data.user",
                    "foreignField": "_id",
                    "as": "laboratory_data.user"
                }
            },
            { "$unwind": "$laboratory_data.user" },
            {
                "$group": {
                    "_id": "$_id",
                    "geology_id": { "$first": "$geology_id" },
                    "hole_id": { "$first": "$hole_id" },
                    "check_status": { "$first": "$check_status" },
                    "date": { "$first": "$date" },
                    "laboratory_data": { "$push": "$laboratory_data" }
                }
            }
        ]);
        return res.json(data);
    } catch (err) {
        return res.status(500).json(err.message);
    }
})

router.get('/general_history', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const data = await GeoGeneral.find({ geology: mongoose.Types.ObjectId(req.query.id) }).sort({ reg_date: -1 });
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

router.get('/markscheiderei_history', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const data = await GeoMarkscheiderei.find({ geology: mongoose.Types.ObjectId(req.query.id) }).sort({ reg_date: -1 });
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

router.get('/laboratory_history', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const data = await GeoLaboratory.find({ geology: mongoose.Types.ObjectId(req.query.id) })
            .populate(['user', 'date.reason', 'level.reason', 'subset.reason', 'thickness.reason', 'distance.reason', 'weight.reason', 'objective_values.analysisType', 'objective_values.obj', 'objective_values.reason'])
            .sort({ reg_date: -1 });
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

router.get('/geology_history', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const data = await GeoGeology.find({ geology: mongoose.Types.ObjectId(req.query.id) }).sort({ reg_date: -1 });
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

router.post('/geology_lab_objectives', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.body.id === '') {
            await Promise.all(req.body.data.map(async (data) => {
                var item = await GeologyLabObjective.findOne(data);
                if (!item) {
                    await GeologyLabObjective.create(data);
                }
            }));
        } else {
            var item = await GeologyLabObjective.findById(req.body.id);
            item.objective = req.body.data[0].objective;
            item.unit = req.body.data[0].unit;
            await item.save();
        }
        const items = await GeologyLabObjective.find().populate(['objective', 'unit']);
        return res.json(items);
    } catch (err) {
        return res.status(500).json(err.message);
    }
})

router.get('/geology_lab_objectives', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const data = await GeologyLabObjective.find().populate(['objective', 'unit']);
        return res.json(data);
    } catch (err) {
        return res.status(500).json(err.message);
    }
})

router.delete('/geology_lab_objectives/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await GeologyLabObjective.deleteOne({ _id: req.params.id });
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json(err.message);
    }
})

router.post('/upload_geology_lab_objective_csv', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const objectives = await Objective.find();
        const units = await Unit.find();
        const parsedCSV = CSV.parse(req.body.data);
        for (let i = 1; i < parsedCSV.length; i++) {
            let aCSV = parsedCSV[i];
            let objective = objectives.filter(obj => obj.objective === aCSV[1].split(' ')[0]);
            let unit = units.filter(unit => unit.unit === aCSV[1].split(' ')[1]);
            if (objective.length > 0 && unit.length > 0) {
                let update = {
                    objective: objective[0]._id,
                    unit: unit[0]._id,
                };
                if (parsedCSV[0].indexOf('Id') > -1) {
                    update._id = aCSV[3];
                }
                let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
                await GeologyLabObjective.findOneAndUpdate(update, update, options)
            }
        }
        const data = await GeologyLabObjective.find().populate(['objective', 'unit']);
        return res.json(data);
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
})

module.exports = router;