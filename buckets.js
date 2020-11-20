const mongoose = require('mongoose');

const courseMaterialsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db,
    {
        chunkSizeBytes: 1024 * 1024,
        bucketName: 'courseMaterials'
    }
);
const lessonMaterialsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db,
    {
        chunkSizeBytes: 1024 * 1024,
        bucketName: 'lessonMaterials'
    }
);
const profilePicsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db,
    {
        chunkSizeBytes: 1024 * 1024,
        bucketName: 'profilePics'
    }
);
const answerMaterialsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db,
    {
        chunkSizeBytes: 1024 * 1024,
        bucketName: 'answerMaterials'
    }
);

module.exports = {
    courseMaterialsBucket,
    lessonMaterialsBucket,
    profilePicsBucket,
    answerMaterialsBucket
}