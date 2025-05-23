const News = require('../models/newsModel');
const Users = require('../models/userModel');
const Comment = require('../models/cmntModel');
const slugify = require('slugify');


const newsCtrl = {
    addNews: async (req, res) => {
        try {
            const {
                title,
                images,
                content,
                category,
                tags = [],
                isPublished = false,
                user,
                publishedAt // <- Accept from client
            } = req.body;
    
            if (!images || images.length === 0)
                return res.status(400).json({ msg: "Please add your photo." });
    
            if (!title)
                return res.status(400).json({ msg: "Please add title." });
    
            if (!content)
                return res.status(400).json({ msg: "Please add content." });
    
            if (!category)
                return res.status(400).json({ msg: "Please add category." });
    
            const slug = `${slugify(title, { lower: true, strict: true })}-${Date.now()}`;
    
            const existingNews = await News.findOne({ slug });
            if (existingNews)
                return res.status(400).json({ msg: "News with similar title already exists." });
    
            const newNews = new News({
                title,
                slug,
                images,
                content,
                category,
                tags,
                user,
                isPublished,
                publishedAt: isPublished
                    ? (publishedAt ? new Date(publishedAt) : new Date())  // Use client value or default
                    : null,
                views: 0
            });
    
            await newNews.save();
    
            res.status(201).json({
                msg: 'News Added Successfully 🎉',
                news: {
                    ...newNews._doc,
                    user: req.user
                }
            });
    
        } catch (err) {
            console.error("Error adding news:", err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
    }
,    
    allNews: async (req, res) => {
        try {
            const news = await News.find().sort('-createdAt');
            res.json({
                msg: 'Successfully get all News',
                result: news.length,
                news
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    editNews: async (req, res) => {
        try {
            const { title, images, content, category } = req.body;
            const news = await News.findByIdAndUpdate({ _id: req.params.id }, {
                title, images, content, category
            });

            if (images.length === 0)
                return res.status(400).json({ msg: "Please add your photo." })

            if (!title)
                return res.status(400).json({ msg: "Please add title." });

            if (!content)
                return res.status(400).json({ msg: "Please add content." });

            if (!category)
                return res.status(400).json({ msg: "Please add Category." });

            res.json({
                msg: 'News Updated',
                newNew: {
                    ...news._doc,
                    user: req.user
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deleteNews: async (req, res) => {
        try {
            const news = await News.findByIdAndDelete({ _id: req.params.id });

            res.json({
                msg: 'News Removed',
                news: {
                    ...news,
                    user: req.user
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    news: async (req, res) => {
        try {
            const news = await News.findById(req.params.id);

            const comments = await Comment.find({ postId: req.params.id });
            if (!comments)
                return res.status(400).json({ msg: "This News does not exist" });

            if (!news)
                return res.status(400).json({ msg: "This News does not exist" });

            res.json({
                news,
                comments
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    newsCat: async (req, res) => {
        try {
            const news = await News.find({ category: req.params.id }).sort('-createdAt');

            if (!news)
                return res.status(400).json({ msg: "This News does not exist" });

            res.json({
                news
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    search: async (req, res) => {
        try {
            const { news, date } = req.query;
    
            let query = {};
    
            if (news) {
                query.title = { $regex: news, $options: 'i' }; // case-insensitive
            }
    
            if (date) {
                const start = new Date(date);
                const end = new Date(date);
                end.setHours(23, 59, 59, 999);
    
                query.publishedAt = { $gte: start, $lte: end }; // search within the day
            }
    
            const newsList = await News.find(query);
            res.json({ news: newsList });
    
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },   
    saveNews: async (req, res) => {
        try {
            const user = await Users.find({ _id: req.user._id, saved: req.params.id });

            if (user.length > 0)
                return res.status(400).json({ msg: "You saved this post." });

            const save = await Users.findOneAndUpdate({ _id: req.user.id }, {
                $push: { saved: req.params.id }
            }, { new: true })

            if (!save)
                return res.status(400).json({ msg: 'This user does not exist.' })

            res.json({ msg: 'News Saved' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    unSaveNews: async (req, res) => {
        try {
            const save = await Users.findOneAndUpdate({ _id: req.params.user_id }, {
                $pull: { saved: req.params.id }
            }, { new: true });

            if (!save)
                return res.status(400).json({ msg: 'This user does not exist.' })

            res.json({ msg: 'unSaved news!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getSavedNews: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password');
            const saveNews = await News.find({
                _id: { $in: user.saved }
            });
            res.json({
                saveNews
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    addcomment: async (req, res) => {
        try {
            const { content, postId, postUserId } = req.body;

            const news = await News.findById(postId);
            if (!news)
                return res.status(400).json({ msg: "This News does not exist." });

            const newCmnt = new Comment({
                content, postId, postUserId, user: req.user.id
            });

            await News.findOneAndUpdate({ _id: postId }, {
                $push: { comments: newCmnt._id }
            }, { new: true });

            await newCmnt.save();

            res.json({
                msg: 'News Added XD',
                newCmnt
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    comment: async (req, res) => {
        try {
            const comments = await Comment.find({ postId: req.params.id });
            if (!comments)
                return res.status(400).json({ msg: "This News does not exist" });

            res.json({
                comments
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
}

module.exports = newsCtrl;