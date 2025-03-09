import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';

export const GeneralContext = React.createContext();

// Add the fetchWithRetry function here
const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    } else {
      throw error;
    }
  }
};

const GeneralContextProvider = ({ children }) => {
  const [topNews, setTopNews] = useState([]);
  const [businessNews, setBusinessNews] = useState([]);
  const [technologyNews, setTechnologyNews] = useState([]);
  const [politicsNews, setPoliticsNews] = useState([]);

  const fetchTopNews = useCallback(async () => {
    try {
      const data = await fetchWithRetry("https://newsapi.org/v2/everything?q=popular&apiKey=df51bdf24fce4206b9e41f9fd71511e8");
      setTopNews(data.articles);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchBusinessNews = useCallback(async () => {
    try {
      const data = await fetchWithRetry("https://newsapi.org/v2/everything?q=business&apiKey=df51bdf24fce4206b9e41f9fd71511e8");
      setBusinessNews(data.articles);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchPoliticsNews = useCallback(async () => {
    try {
      const data = await fetchWithRetry("https://newsapi.org/v2/everything?q=politics&apiKey=df51bdf24fce4206b9e41f9fd71511e8");
      setPoliticsNews(data.articles);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchTechnologyNews = useCallback(async () => {
    try {
      const data = await fetchWithRetry("https://newsapi.org/v2/everything?q=technology&apiKey=df51bdf24fce4206b9e41f9fd71511e8");
      setTechnologyNews(data.articles);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchTopNews();
    fetchBusinessNews();
    fetchPoliticsNews();
    fetchTechnologyNews();
  }, [fetchTopNews, fetchBusinessNews, fetchPoliticsNews, fetchTechnologyNews]);

  return (
    <GeneralContext.Provider value={{
      topNews, businessNews, technologyNews, politicsNews, 
      fetchTopNews, fetchBusinessNews, fetchPoliticsNews, fetchTechnologyNews
    }}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
