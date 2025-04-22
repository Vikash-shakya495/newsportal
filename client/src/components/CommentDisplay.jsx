import React, { useEffect, useState } from 'react';
import { getDataAPI } from './../utils/fetchData';
import {Link } from 'react-router-dom';
import moment from 'moment';

const CommentDisplay = ({ cmnt }) => {
    const [user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDataAPI(`user/${cmnt.user}`);
                setUser (res.data.user);
            } catch (err) {
                setError(err.response.data.msg || "Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [cmnt.user]);

    if (loading) return <span>Loading...</span>;
    if (error) return <span>{error}</span>;

    return (
        <div className="comment__card2">
  <img className="comment__img" src={user.avatar} alt="profile" />
  <div className="comment__content">
    <div className="comment__header">
      <Link className="comment__username">{user.username}</Link>
      <span className="comment__time">{moment(cmnt.createdAt).fromNow()}</span>
    </div>
    <p className="comment__text">{cmnt.content}</p>
  </div>
</div>

    );
};

export default CommentDisplay;