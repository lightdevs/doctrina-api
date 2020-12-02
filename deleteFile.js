export function deleteFile(file) {
    let bucket;
    let updated;
    let arr;
    try {
        switch (file.bucket) {
            case "course":
                const { courseMaterialsBucket } = require("./buckets");
                bucket = courseMaterialsBucket;
                let course = await Course.findById(file.parentInstance);
                arr = course.materials;
                arr.remove(args.id);
                updated = await Course.findByIdAndUpdate({ _id: course._id }, { materials: arr }, {
                    returnOriginal: false
                });
                break;
            case "lesson":
                const { lessonMaterialsBucket } = require("./buckets");
                bucket = lessonMaterialsBucket;
                let lesson = await Lesson.findById(file.parentInstance);
                arr = lesson.materials;
                arr.remove(args.id);
                updated = await Lesson.findByIdAndUpdate({ _id: lesson._id }, { materials: arr }, {
                    returnOriginal: false
                });
                break;
            case "pic":
                const { profilePicsBucket } = require("./buckets");
                bucket = profilePicsBucket;
                updated = await Person.findByIdAndUpdate({ _id: file.parentInstance }, { photo: null }, {
                    returnOriginal: false
                });
                break;
            case "answer":
                const { answerMaterialsBucket } = require("./buckets");
                bucket = answerMaterialsBucket;
                let answer = await Answer.findById(file.parentInstance);
                arr = answer.materials;
                arr.remove(args.id);
                updated = await Answer.findByIdAndUpdate({ _id: answer._id }, { materials: arr }, {
                    returnOriginal: false
                });
                break;

        }
    } catch (err) {
        throw err;
    }

    bucket.delete(file.fileId, function (error) {
    });
    const res = await File.remove({ _id: file._id });
    return { affectedRows: res.deletedCount };
}