const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const OreType = require('../models/oreModel');
const Geology = require('../models/GeologyModel');
const CSV = require('csv-string');
const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const ores = await OreType.find();
        return res.json(ores);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.body.oreType_id === '') {
            return res.status(400).json({ oreType_id: 'OreType id is required' });
        }
        if (req.body.oreType === '') {
            return res.status(400).json({ oreType: 'OreType id is required' });
        }
        await OreType.create({
            oreType_id: req.body.oreType_id,
            oreType: req.body.oreType,
            remark: req.body.remark
        });
        const ores = await OreType.find();
        return res.json(ores);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.put('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.body.oreType_id === '') {
            return res.status(400).json({ oreType_id: 'OreType id is required' });
        }
        if (req.body.oreType === '') {
            return res.status(400).json({ oreType: 'OreType id is required' });
        }
        const ore = await OreType.findById(mongoose.Types.ObjectId(req.body.id));
        ore.oreType_id = req.body.oreType_id;
        ore.oreType = req.body.oreType;
        ore.remark = req.body.remark;
        await ore.save();

        const ores = await OreType.find();
        return res.json(ores);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const result = await Geology.find({ 'geology.ore': mongoose.Types.ObjectId(req.params.id) });
        if (result.length > 0) {
            return res.status(400).json({ message: 'Already used in Geology' });
        }
        const ore = await OreType.findById(req.params.id);
        await ore.remove();

        const ores = await OreType.find();
        return res.json(ores);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post('/upload_oreType_csv', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.body === undefined) {
            res.status(400).send({ message: "OreType name can not be empty!" });
            return;
        }
        const parsedCSV = CSV.parse(req.body.data);
        try {
            for (let i = 1; i < parsedCSV.length; i++) {
                let aCSV = parsedCSV[i];
                let query = { oreType_id: aCSV[0] };
                let update = {
                    oreType: aCSV[1],
                    remark: aCSV[2],
                };
                // if (parsedCSV[0].indexOf('Id') > -1) {
                //     update._id = aCSV[3];
                // }
                let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
                await OreType.findOneAndUpdate(query, update, options)
            }
            OreType.find().then(data => {
                res.send(data);
            })
        }
        catch (err) {
            res.status(500).send({ message: err.message });
        }
    } catch (err) {
        return res.status(500).json(err.message);
    }
})

module.exports = router;