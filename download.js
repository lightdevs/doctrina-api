var express = require('express');
var router = express.Router();
const File = require('./models/file');

router.get('/', async function (req, res) {
    const id = req.query.id;

    let file = await File.findById(id);
    if (file) {

        let hash = file.searchTitle;
        let readStream;
        switch (file.bucket) {
            case "course":
                const { courseMaterialsBucket } = require("./buckets");
                readStream = courseMaterialsBucket.openDownloadStreamByName(hash);
                break;
            case "lesson":
                const { lessonMaterialsBucket } = require("./buckets");
                readStream = lessonMaterialsBucket.openDownloadStreamByName(hash);
                break;
            case "pic":
                const { profilePicsBucket } = require("./buckets");
                readStream = profilePicsBucket.openDownloadStreamByName(hash);
                break;
        }


        readStream.pipe(res).
            on('error', function (error) {
                console.error(error);
                throw new Error("Can't download file");
            }).
            on('finish', function () {
            });
    }
    else {
        res.sendStatus(404);
    }
});

module.exports.router = router;