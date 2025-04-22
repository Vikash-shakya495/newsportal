import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDataAPI, patchDataAPI } from './../../utils/fetchData';
import moment from 'moment';
import bookmark from '../../images/bookmark.png';
import bookmark_fill from '../../images/bookmark_fill.png';
import jwt from 'jsonwebtoken';
import AddIcon from '../../images/plus.png';
import AddComments from '../../components/addComments';
import "../../styles/admin.css";
import CommentDisplay from '../../components/CommentDisplay';

const News = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [user, setUser ] = useState(null);
    const [saved, setSaved] = useState(false);
    const [addCmnt, setAddCmnt] = useState(false);
    const [showComments, setShowComments] = useState([]);
    const user_id = jwt.decode(localStorage.getItem("user")).id;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDataAPI(`/news/${id}`);
                setNews(res.data.news);
                setShowComments(res.data.comments);
                const res1 = await getDataAPI(`user/${user_id}`);
                setUser (res1.data.user);
                setSaved(res1.data.user.saved.includes(id));
            } catch (err) {
                setError(err.response.data.msg || "An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user_id]);

    const handleSaveNews = async () => {
        try {
            const newUser  = { ...user, saved: [...user.saved, id] };
            await patchDataAPI(`saveNews/${id}`, newUser , localStorage.getItem("user"));
            setSaved(true);
        } catch (err) {
            setError(err.response.data.msg || "Failed to save news.");
        }
    };

    const handleUnSaveNews = async () => {
        try {
            const newUser  = { ...user, saved: user.saved.filter(i => i !== id) };
            await patchDataAPI(`unsaveNews/${user_id}/${id}`, newUser );
            setSaved(false);
        } catch (err) {
            setError(err.response.data.msg || "Failed to unsave news.");
        }
    };

    if (loading) return <span>Loading...</span>;
    if (error) return <span>{error}</span>;

    return (
        <div className="news_container">
        <div className="news__top">
          <div className="news__text">
            <h1 className="news__title">{news.title}</h1>
            <p className="news__content">{news.content}</p>
            <div className="news__info">
              <span>Category: {news.category}</span>
              <span>{moment(news.createdAt).fromNow()}</span>
            </div>
            <div className="news__actions">
              <img 
                src={saved ? bookmark_fill : bookmark} 
                className="news__bookmark" 
                alt="bookmark" 
                onClick={saved ? handleUnSaveNews : handleSaveNews} 
              />
              <button onClick={() => setAddCmnt(true)} className="news__comment-btn">
                <img src={AddIcon} alt="add comment" />
              </button>
            </div>
          </div>
          <div className="news__image">
            <img src={ (news.images[1]) ? news.images[1] :  news.images[0] } alt="news" />
          </div>
        </div>
      
        {addCmnt && <AddComments setAddCmnt={setAddCmnt} postId={news._id} postUserId={news.user} />}
      
        <div className="news__comments">
          <h2>Comments:</h2>
          {showComments.length === 0 ? (
            <p>No Comments</p>
          ) : (
            showComments.map(cmnt => (
              <div key={cmnt._id} className="comment__card">
                <CommentDisplay cmnt={cmnt} />
              </div>
            ))
          )}
        </div>
      </div>
      
    );
};

export default News;