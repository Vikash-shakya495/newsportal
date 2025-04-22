import React, { useState } from 'react';
import closeIcon from '../images/delete.png';
import { postDataAPI, getDataAPI } from '../utils/fetchData';
import jwt from 'jsonwebtoken';

const AddComments = ({ setAddCmnt, postId, postUserId }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChangeInput = (e) => {
        setContent(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const id = jwt.decode(localStorage.getItem("user")).id;

        try {
            const res1 = await getDataAPI(`user/${id}`);
            const comment = {
                content,
                user: res1.data.user,
                createdAt: new Date().toISOString(),
            };
            await postDataAPI('addcomment', { ...comment, postId, postUserId }, localStorage.getItem("user"));
            setContent(''); // Clear the input after submission
            setError(null); // Clear any previous error
        } catch (err) {
            setError(err.response.data.msg || "Failed to add comment.");
        } finally {
            setLoading(false);
            setAddCmnt(false);
        }
    };

    return (
        <div className="addNews__main addComments__main">
            <button className="addNews__close addComment__close btn" onClick={() => setAddCmnt(false)}>
                <img className="icon" src={closeIcon} alt="close button" />
            </button>
            <form className="addNews__form addComment__form" onSubmit={handleSubmit}>
                <h2 className="addNews__title">Add Comment</h2>
                <label className="addNews__label" htmlFor="content">Content:</label>
                <textarea
                    className="addNews__textarea"
                    id="content"
                    name="content"
                    placeholder="Enter content..."
                    onChange={handleChangeInput}
                    value={content}
                    required
                    minLength={1} // Minimum length validation
                />
                <button type="submit" className="btn btn--primary addNews__btn" disabled={loading}>
                    {loading ? (
                        <span className="spinner"></span> // Add a spinner for loading state
                    ) : (
                        "Add"
                    )}
                </button>
                {error && <span className="error-message" role="alert">{error}</span>} {/* Accessibility */}
            </form>
        </div>
    );
}

export default AddComments;