import { useQuery } from 'react-query';
import axios from 'axios';
import { SA_KEY, SA_URL } from '../constants';
const fetchChartData = async (symbol: string, period: string) => {
  // Fetch data based on symbol and interval
  // Replace this with your actual API call
  const options = {
    method: 'GET',
    url: 'https://seeking-alpha.p.rapidapi.com/symbols/get-chart',
    params: {
      symbol: `${symbol}`,
      period: `${period}`
    },
    headers: {
      'X-RapidAPI-Key': `${SA_KEY}`,
      'X-RapidAPI-Host': `${SA_URL}`
    }
  };
  
  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }

  const data = await response.json();
  return data;
};

const useChartData = (symbol: string, interval: string) => {
  return useQuery(['chartData', symbol, interval], () => fetchChartData(symbol, interval));
};

export default useChartData;