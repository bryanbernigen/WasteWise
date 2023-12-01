const { firebaseAdmin } = require("../Model/firebaseConfig");

const getArticlesCount = async (req, res) => {
    const totalArticles = await firebaseAdmin
        .firestore()
        .collection("article")
        .count()
        .get()
        .then((snapshot) => {
            res.status(200).json({
                status: "success",
                data: snapshot.data().count,
            });
        })
        .catch((error) => {
            res.status(500).json({ status: "error", error: error });
        });
};

const getArticles = async (req, res) => {
    //Get the Xth page of articles
    const pageNumber = req.params.pagenumber;
    const articlesPerPage = 2; //TODO: Change this to 10
    const offset = (pageNumber - 1) * articlesPerPage;

    //Get the articles with it's id
    const articles = await firebaseAdmin
        .firestore()
        .collection("article")
        .orderBy("date", "desc")
        .limit(articlesPerPage)
        .offset(offset)
        .get()
        .then((snapshot) => {
            //If no articles found
            if (snapshot.empty){
                res.status(404).json({
                    status: "error",
                    error: {
                        message: "Not Found",
                    },
                });
                return;
            }

            //If articles found then return them
            const articles = [];
            snapshot.forEach((doc) => {
                articles.push(doc.data());
            });
            res.status(200).json({
                status: "success",
                data: articles,
            });
        })
        .catch((error) => {
            res.status(500).json({ status: "error", error: error });
        });
};

const getArticleDetails = async (req, res) => {
    //Get the article id
    const content_id = req.params.content_id;

    //Get the article details
    const article = await firebaseAdmin
        .firestore()
        .collection("article_content")
        .where(firebaseAdmin.firestore.FieldPath.documentId(), "==", content_id)
        .limit(1)
        .get()
        .then((snapshot) => {
            //If no article found
            if (snapshot.empty){
                res.status(404).json({
                    status: "error",
                    error: {
                        message: "Not Found",
                    },
                });
                return;
            }

            //If article found then return it
            const content = [];
            snapshot.forEach((doc) => {
                content.push(doc.data());
            });
            res.status(200).json({
                status: "success",
                data: content,
            });
        })
        .catch((error) => {
            res.status(500).json({ status: "error", error: error });
        });
};

module.exports = {
    getArticlesCount,
    getArticles,
    getArticleDetails,
};
