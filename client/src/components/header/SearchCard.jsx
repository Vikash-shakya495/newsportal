import React from 'react';
import { Link } from 'react-router-dom';

const SearchCard = ({ news, handleClose }) => {
    const title = news.title.length > 20
        ? news.title.slice(0, 20) + '...'
        : news.title;

    return (
        <Link
            to={`/news/${news._id}`}
            className="flex gap-2 p-4 rounded hover:bg-gray-100 transition-all"
            onClick={handleClose}
        >
            <img
                src={news.images?.[0] || news.images?.[1] || '/default-news.jpg'}
                className="w-12 h-12 object-cover rounded"
                alt="news"
            />
            <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        </Link>
    );
};

export default SearchCard;
