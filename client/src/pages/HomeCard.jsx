import React from 'react'
import '../styles/homecard.css'
import { Link } from 'react-router-dom';
const HomeCard = ({ n }) => {
    return (
        <div className="news-card" style={{ gridRowEnd: `span ${Math.floor(Math.random() * 2 + 2)}` }}>
            <div className="news-image">
                <img
                    src={n.images && n.images.length > 0 ? n.images[0] : "/default-news.jpg"}
                    alt="news"
                />
            </div>

            <div className="news-content">
                <span
                    className={`news-category ${n.category === "Business"
                            ? "bg-green-100 text-green-700"
                            : n.category === "Entertainment"
                                ? "bg-pink-100 text-pink-700"
                                : "bg-blue-100 text-blue-700"
                        }`}
                >
                    {n.category}
                </span>
                <h1 className="news-title">{n.title}</h1>

                <p className="news-snippet">
                    {n.content.length > 150 ? n.content.slice(0, 150) + '...' : n.content}
                </p>

                <div className="news-meta">
                    <span>👍 {n.likes?.length || 0}</span>
                    <span>👁️ {n.views || 0}</span>
                    <span>{new Date(n.publishedAt).toLocaleDateString()}</span>
                </div>

                <Link to={`/news/${n._id}`} className="read-more-btn">
                    Read More →
                </Link>
            </div>
        </div>

    )
}

export default HomeCard
