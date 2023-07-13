const express = require('express')
const passport = require('passport')
const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec;
const restore = require('mongodb-restore-dump')
var MongoClient = require('mongodb').MongoClient;
const Setting = require('../models/Setting')
const { dbOptions, MongoUri } = require('../config')
const router = express.Router()

router.get('/date_format', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const settings = await Setting.findOne()
        return res.json(settings)
    } catch (err) {
        return res.status(500).json({ message: 'Server error happens' })
    }
})

router.post('/date_format', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const settings = await Setting.findOne()
        settings.date_format = req.body.format
        await settings.save()
        return res.json({ success: true })
    } catch (err) {
        return res.status(500).json({ message: 'Server error happens' })
    }
})

router.post('/backup_db', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const current = new Date();
        const dirname = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();

        const dbPath = path.join(__dirname + '/../db');
        if (!fs.existsSync(dbPath)) {
            fs.mkdir(dbPath, (err) => {
                if (err) {
                    return res.status(500).json(err);
                }
            });
        }

        const newBackupPath = path.join(__dirname + '/../db/' + dirname);

        let cmd =
            'mongodump --host ' +
            dbOptions.host +
            ' --port ' +
            dbOptions.port +
            ' --db ' +
            dbOptions.database +
            ' --out ' +
            newBackupPath;

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(error);
            }
            return res.json({ success: true });
        });
    } catch (err) {
        return res.status(500).json(err.message);
    }
})

router.post('/restore_db', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const dbPath = path.join(__dirname + '/../db');
        if (fs.existsSync(dbPath)) {
            const dirs = fs.readdirSync(dbPath);
            let dates = [];
            dirs.map(dir => dates.push(new Date(dir)));
            var maxDate = new Date(Math.max.apply(null, dates));
            const latest_dir = maxDate.getFullYear() + '-' + (maxDate.getMonth() + 1) + '-' + maxDate.getDate();

            const restorePath = path.join(__dirname + '/../db/' + latest_dir + '/' + dbOptions.database)

            const db = await MongoClient.connect(MongoUri, { useUnifiedTopology: true });
            var dbo = db.db("LIMS");
            dbo.dropDatabase();

            await restore.database({
                uri: MongoUri,
                database: 'LIMS',
                from: restorePath
            });
            return res.json({ success: true });
            // let cmd =
            //     'mongorestore -h ' +
            //     dbOptions.host + ':' + dbOptions.port
            // ' -d ' +
            //     dbOptions.database +
            //     ' ' +
            //     restorePath + '/';

            // exec(cmd, (error, stdout, stderr) => {
            //     if (error) {
            //         console.log(error);
            //     }
            //     return res.json({ success: true });
            // });
        }
    } catch (err) {
        return res.status(500).json(err.message);
    }
})

module.exports = router;