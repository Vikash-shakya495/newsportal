import React, { useState, useEffect } from 'react';
import close from '../../images/cancel.png';
import { getDataAPI } from '../../utils/fetchData';
import SearchCard from './SearchCard';

const Search = ({ sprite }) => {
    const [search, setSearch] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [searchType, setSearchType] = useState('title'); // 'title' | 'date'
    const [news, setNews] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (searchType === 'title' && search) {
                try {
                    const res = await getDataAPI(`search?news=${search}`);
                    setNews(res.data.news);
                    setError('');
                } catch (err) {
                    setNews([]);
                    setError('Error fetching news. Please try again.');
                }
            } else if (searchType === 'date' && searchDate) {
                try {
                    const res = await getDataAPI(`search?date=${searchDate}`);
                    setNews(res.data.news);
                    setError('');
                } catch (err) {
                    setNews([]);
                    setError('Error fetching news. Please try again.');
                }
            } else {
                setNews([]); // Clear results if no input
            }
        };

        const debounceFetch = setTimeout(() => {
            fetchData();
        }, 300); // Adjust the delay as needed

        return () => clearTimeout(debounceFetch); // Cleanup on unmount
    }, [search, searchDate, searchType]);

    const handleClose = () => {
        setSearch('');
        setSearchDate('');
        setNews([]);
        setError('');
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-2">
                <button
                    type="button"
                    className={`btn ${searchType === 'title' ? 'btn--primary' : 'btn--secondary'}`}
                    onClick={() => {
                        setSearchType('title');
                        setNews([]); // Clear results when switching
                    }}
                >
                    Search by Title
                </button>
                <button
                    type="button"
                    className={`btn ${searchType === 'date' ? 'btn--primary' : 'btn--secondary'}`}
                    onClick={() => {
                        setSearchType('date');
                        setNews([]); // Clear results when switching
                    }}
                >
                    Search by Date
                </button>
            </div>

            {/* Search Form */}
            <form className="input-group search__bar" onSubmit={(e) => e.preventDefault()}>
                {searchType === 'title' && (
                    <input
                        type="text"
                        className="input"
                        placeholder="Enter News title..."
                        value={search}
                        autoComplete="off"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                )}
                {searchType === 'date' && (
                    <input
                        type="date"
                        className="input"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                    />
                )}

                <button className="btn btn--primary" type="button" onClick={handleClose}>
                    {(search || searchDate) && <img className="icon icon-small" src={close} alt="Close" />}
                </button>
            </form>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Search Results */}
            <div className="search ">
                {news.map(n => (
                    <SearchCard key={n._id} news={n} handleClose={handleClose} />
                ))}
            </div>
        </div>
    );
};

export default Search;