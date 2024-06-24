import { JobFilterParams } from './shared.types';

export const fetchLocation = async () => {
  const response = await fetch('http://ip-api.com/json/?fields=country');
  const location = await response.json();
  return location.country;
};

export const fetchCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const fetchJobs = async (filters: JobFilterParams) => {
    const { query, page } = filters;
  
    const headers = {
      'x-rapidAPI-key': process.env.NEXT_PUBLIC_RAPID_API_KEY ?? '',
      'x-rapidAPI-ost': 'jsearch.p.rapidapi.com'
    };
  
    try {
      const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}`, {
        headers
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      // console.log("API Response:", result);
      return result.data;
    } catch (error) {
      console.error("Fetch Jobs Error:", error);
      return [];
    }
  };
  