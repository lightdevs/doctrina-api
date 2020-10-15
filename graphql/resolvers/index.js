const Cource = require("../../models/cource")

module.exports = {
    cources: async () => {
        try {
            const courcesFetched = await Cource.find()
            return courcesFetched.map(cource => {
                return {
                    ...cource._doc,
                    _id: cource.id,
                    createdAt: new Date(cource._doc.createdAt).toISOString(),
                }
            })
        } catch (error) {
            throw error
        }
    },

    createCource: async args => {
        try {
            const { title, description } = args.cource
            const cource = new Cource({
                title,
                description,
            })
            const newcource = await cource.save()
            return { ...newcource._doc, _id: newcource.id }
        } catch (error) {
            throw error
        }
    },
}