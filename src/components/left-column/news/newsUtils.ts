import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { NINJA_KEY, NINJA_URL } from "../../constants";
import { YH_KEY, YH_URL } from "../../../constants";
import { newsSegmentType } from "./types";

const getRandomSegment = (): newsSegmentType => {
  const segments: newsSegmentType[] = ["Top", "Local", "World"];
  const randomIndex = Math.floor(Math.random() * segments.length);
  return segments[randomIndex];
};

const calculateTimeDifference = (pubDate: string): string => {
  const currentDate = new Date();
  const publishedDate = new Date(pubDate);
  const timeDifference = currentDate.getTime() - publishedDate.getTime();
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

  if (hoursDifference < 24) {
    return `${hoursDifference} hours ago`;
  } else {
    const days = Math.floor(hoursDifference / 24);
    const remainingHours = hoursDifference % 24;
    return `${days} day${days > 1 ? "s" : ""} ${remainingHours} hours ago`;
  }
};

export const getNews = async (queryClient: QueryClient) => {
  const cachedData = queryClient.getQueryData(["news"]);

  if (cachedData) {
    console.log("returned cached data getNews", cachedData);
    return cachedData;
  }

  const options = {
    method: "POST",
    url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/v2/list",
    params: {
      region: "US",
      snippetCount: "28",
    },
    headers: {
      "content-type": "text/plain",
      "X-RapidAPI-Key": `${YH_KEY}`,
      "X-RapidAPI-Host": `${YH_URL}`,
    },
    data: "Pass in the value of uuids field returned right in this endpoint to load the next page, or leave empty to load first page",
  };

  try {
    console.log("new api request - getNews");
    const response = await axios.request(options);
    /*     console.log(response.data.data.main.stream); */
    console.log(response.data.data.main.stream[0].content);
    const articles = response.data.data.main.stream.map((a, index) => ({
      id: a.content.id,
      link: a.content?.clickThroughUrl?.url || "",
      title: a.content.title,
      time: calculateTimeDifference(a.content.pubDate),
      img:
        a.content.thumbnail?.resolutions?.[3]?.url ||
        a.content.thumbnail?.resolutions?.[2]?.url ||
        a.content.thumbnail?.resolutions?.[1]?.url ||
        a.content.thumbnail?.resolutions?.[0]?.url ||
        "",
      source: a.content.provider.displayName,
      relatedSymbol: a.content.finance?.stockTickers?.[0]?.symbol || "^DJI",
      segment: getRandomSegment(), // Assign a random segment
    }));

    // Cache the data
    queryClient.setQueryData(["news"], articles);

    return articles;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/* export const getNews = async () => (
  queryClient: QueryClient,
  symbol: string
): Promise<newsType | null> => {
  const options = {
    method: 'GET',
    url: 'https://real-time-finance-data.p.rapidapi.com/stock-news',
    params: {
      symbol: 'DOW',
      language: 'en'
    },
    headers: {
      'X-RapidAPI-Key': `${NINJA_KEY}`,
      'X-RapidAPI-Host': `${NINJA_URL}`
    }
  };
  try{
    //get cached news for symbol

    // if cached news for symbol return that

    //otherwise make new api call
    const response = await axios.request(options);

    /*
    // Only loop up to 5 articles
    news = response.data.news.map((n)) => 
    title = n.article_title 
    url = n.article_url
    image = n.article_photo_url
    source = n.source
    time = n.post_time_utc
    */

//returnedArticles = [{title, url, image,source,time}]
// store in cache artcles returned for this symbol

/*   }
} */
