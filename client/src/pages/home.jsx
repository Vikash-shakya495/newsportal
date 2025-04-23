import React from 'react';
import { useState, useEffect } from 'react';
import { getDataAPI } from './../utils/fetchData';
import '../styles/homecard.css'
import HomeCard from './HomeCard';
// import SubscribeForm from './SubscribeForm';
const Home = () => {
    const [news, setNews] = useState([]);
    
    useEffect(() => {
        async function fetchData() {
            const res = await getDataAPI('allNews');
            setNews(res.data.news);
        };
        fetchData();
    }, []);


    

    return (
        <>
    
        <div className="main">
            {
                news.map(n => (
                    <HomeCard n={n}/>
                ))
            }
        </div>
        <div>
            {/* <SubscribeForm/> */}
        </div>
        </>
    )
};

export default Home;