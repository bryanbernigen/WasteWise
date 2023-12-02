const { firebaseAdmin } = require("../Model/firebaseConfig");

const getAllWastes = async (req, res) => {
    //Get the wastes with it's id
    const wastes = await firebaseAdmin
        .firestore()
        .collection("waste")
        .get()
        .then((snapshot) => {
            //If no wastes found
            if (snapshot.empty) {
                res.status(404).json({
                    status: "error",
                    error: {
                        message: "Not Found",
                    },
                });
                return;
            }

            //If wastes found then return them with it's id
            const wastes = [];
            snapshot.forEach((doc) => {
                wastes.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            res.status(200).json({
                status: "success",
                data: wastes,
            });
        })
        .catch((error) => {
            res.status(500).json({ status: "error", error: error });
        });
};

const getWasteDetails = async (req, res) => {
    //Get the waste id
    const content_id = req.params.waste_id;
    const waste = await firebaseAdmin
        .firestore()
        .collection("waste")
        .doc(content_id)
        .get()
        .then(async (doc) => {
            //If no waste found
            if (!doc.exists) {
                res.status(404).json({
                    status: "error",
                    error: {
                        message: "Not Found",
                    },
                });
                return;
            }

            //If waste found retrieve all it's processing
            const waste = doc.data();
            const processing_ids = waste.processing_id;
            const processing = [];

            //Retrieve all processing in parallel
            await Promise.all(
                processing_ids.map(async (id) => {
                    const processing_doc = await firebaseAdmin
                        .firestore()
                        .collection("waste_processing")
                        .doc(id)
                        .get()
                        .then((doc) => {
                            if (!doc.exists) {
                                return null;
                            }
                            return {
                                id: doc.id,
                                ...doc.data(),
                            };
                        });
                    if (processing_doc) {
                        processing.push(processing_doc);
                    }
                })
            );

            //Return the waste with it's processing
            waste.processing = processing;
            res.status(200).json({
                status: "success",
                data: waste,
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ status: "error", error: error });
        });
};

module.exports = {
    getAllWastes,
    getWasteDetails,
};
