
import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosConfig';

const useFetchData = (url) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(url);
            setData(response.data);
            setError(null);
        } catch (err) {
            setError(err);
            console.error('Error fetching data:', err);
        } finally {
            setIsLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(async () => {
        return fetchData();
    }, [fetchData]);

    return { 
        data, 
        setData, 
        isLoading, 
        error,
        refetch  // Agregamos la función refetch al return
    };
};

export default useFetchData;