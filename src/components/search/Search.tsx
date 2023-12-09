import React, { useState, useEffect, useRef } from "react";
import "./Search.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import cleanseData, { quoteType, suggestionType, utils } from "./types";
/* import { Navigate, useNavigate } from "react-router-dom"; */

const Search = () => {
  const AV_KEY = import.meta.env.VITE_ALPHAVANTAGE_RAPIDAPI_KEY;
  const AV_URL = import.meta.env.VITE_ALPHAVANTAGE_HOST;
  const YH_KEY = import.meta.env.VITE_APIDOJO_YAHOO_KEY;
  const YH_URL = import.meta.env.VITE_APIDOJO_YAHOO_HOST;

  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  /*   const [outsideClick, setOutsideClick] = useState(false); */
  const [searchInput, setSearchInput] = React.useState<string>("");
  const [searchedQuote, setSearchedQuote] = React.useState("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [fetchDataClicked, setFetchDataClicked] =
    React.useState<boolean>(false);

  const queryClient = useQueryClient(); // Step 2

  queryClient.setQueryDefaults(["quote"], { gcTime: 1000 * 60 * 15 });

  const getAutocompleteBestMatches = async (): Promise<suggestionType[]> => {
    console.log("autocomplete ran");
    // Try to get cached data
    if (searchInput.length <= 1) {
      /*  setSuggestions([]); // Set suggestions as an empty array */
      console.log("autocomplete returned empty array");
      return [];
    }
    const cachedData = queryClient.getQueryData(["matches", searchInput]);

    if (cachedData) {
      // If cached data is available, return it
      const checkedCachedData = utils.checkCachedSuggestionType(cachedData);
      /*   setSuggestions(checkedCachedData); */
      console.log("returned cached data:", checkedCachedData);
      return checkedCachedData;
    }

    const options = {
      method: "GET",
      url: "https://alpha-vantage.p.rapidapi.com/query",
      params: {
        function: "SYMBOL_SEARCH",
        keywords: searchInput,
        datatype: "json",
      },
      headers: {
        "X-RapidAPI-Key": `${AV_KEY}`,
        "X-RapidAPI-Host": `${AV_URL}`,
      },
    };

    try {
      const response = await axios.request(options);
      const temp = response.data.bestMatches;
      const matches = temp.slice(0, 5);
      console.log(response.data.bestMatches);

      // Update the query cache with the new data
      queryClient.setQueryData(["matches", searchInput], matches);

      /*  setSuggestions(utils.cleanseData(matches)); */
      //  setApiCallCount((prevCount) => prevCount + 1);
      return cleanseData(matches);
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const bestMatchesQuery = useQuery<suggestionType[], Error>({
    queryKey: ["matches", searchInput],
    queryFn: getAutocompleteBestMatches,
    staleTime: 1000 * 60 * 15,
    enabled: searchInput !== "" && !isTyping, //Only enable query when the user is not typing and searchInput is not empty
  });

  const getQuote = async (): Promise<quoteType[]> => {
    console.log("getQuote API call", fetchDataClicked);
    if (fetchDataClicked) {
      console.log("fetchedData button clicked");
      const options = {
        method: "GET",
        url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary",
        params: { symbol: `${searchInput}`, region: "US" },
        headers: {
          "X-RapidAPI-Key": `${YH_KEY}`,
          "X-RapidAPI-Host": `${YH_URL}`,
        },
      };

      try {
        const cachedQuote = queryClient.getQueryData(["quote", searchInput]);
        if (cachedQuote) {
          const newCachedQuote = utils.checkCachedQuoteType(cachedQuote);
          /*       setQuote(newCachedQuote); */
          console.log("used cached q", cachedQuote);
          return [newCachedQuote];
        }
        const response = await axios.request(options);
        console.log("getQuote API call");
        //console.log("Response Headers:", response.headers);
        if (!response.data.quoteType || !response.data.price) {
          throw new Error("Incomplete or missing data in the API response");
        }

        const temp = response.data.quoteType.symbol;
        const quoteData = {
          symbol: temp.toLowerCase(),
          price: response.data.price.regularMarketPrice.raw,
          name: response.data.price.shortName,
          priceChange: response.data.price.regularMarketChange.fmt,
          percentChange:
            response.data.price.regularMarketChangePercent.raw.toFixed(2),
        };

        /*  setQuote(quoteData); */
        console.log(quoteData);
        //setApiCallCount((prevCount) => prevCount + 1);
        return [quoteData];
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch quote data");
      }
    } else {
      console.log("reached else");
      // if we do not click the button we should fetch data for each item in bestMatchesQuery.data to display in the dropdown
      await queryClient.refetchQueries({ queryKey: ["matches", searchInput] });
      const bestMatches =
        queryClient.getQueryData<suggestionType[]>(["matches", searchInput]) ??
        [];
      console.log("matches refetched: ", bestMatches);
      if (bestMatches !== undefined) {
        console.log(
          "fetching data for each best match",
          bestMatches,
          bestMatches?.length
        );
        const matchesRegions = utils.getRegions(bestMatches);
        const matchesSymbols = utils.getSymbols(bestMatches);
        // Map through each symbol in cachedQuotes and make an API call for each
        //console.log("matchesSymbols:", matchesSymbols);
        const quotePromises = matchesSymbols.map(async (symbol, index) => {
          const region = matchesRegions[index];
          console.log("region", region);
          if (region !== "United States") {
            return {
              symbol: "",
              name: "",
              price: 0,
              priceChange: 0,
              percentChange: 0,
            };
          }

          const symbolOptions = {
            method: "GET",
            url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary",
            params: { symbol, region },
            headers: {
              "X-RapidAPI-Key": `${YH_KEY}`,
              "X-RapidAPI-Host": `${YH_URL}`,
            },
          };

          try {
            const response = await axios.request(symbolOptions);

            if (!response.data.quoteType) {
              throw new Error("Incomplete or missing data in the API response");
            }
            const quoteData = {
              symbol: response.data.quoteType.symbol.toLowerCase(),
              price: response.data.price.regularMarketPrice.raw,
              name: response.data.price.shortName,
              priceChange: response.data.price.regularMarketChange.fmt,
              percentChange:
                response.data.price.regularMarketChangePercent.raw.toFixed(2),
            };
            //console.log("quote data: ", quoteData);
            return quoteData;
          } catch (error) {
            console.error(error);
            // Handle the error for a specific symbol if needed
            return {
              symbol: "",
              name: "",
              price: 0,
              priceChange: 0,
              percentChange: 0,
            };
          }
        });

        // Wait for all API calls to complete
        const quotes = await Promise.all(quotePromises);
        console.log("quotes", quotes);
        // Filter out potential null and empty values
        const validNonEmptyQuotes = quotes.filter(
          (quote) =>
            quote !== null &&
            (quote.symbol !== "" ||
              quote.name !== "" ||
              quote.price !== 0 ||
              quote.priceChange !== 0 ||
              quote.percentChange !== 0)
        );
        const validQuotesType =
          utils.checkCachedQuotesType(validNonEmptyQuotes);
        //console.log("validQuotesTypes: ", validQuotesType);
        return validQuotesType;
      }

      try {
        console.log("did not ");
        return [
          {
            symbol: "",
            name: "",
            price: 0,
            priceChange: 0,
            percentChange: 0,
          },
        ];
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch quote data");
      }
    }
  };

  const quoteQuery = useQuery<quoteType[], Error>({
    queryKey: ["quote", searchInput, searchedQuote],
    queryFn: getQuote,
    staleTime: 1000 * 60 * 15,
    enabled: fetchDataClicked || (!isTyping && searchInput !== ""), // Only enable the query when fetchDataClicked is true
  });

  // Handle onSuccess separately
  React.useEffect(() => {
    if (quoteQuery.isSuccess) {
      setFetchDataClicked(false);
    }
  }, [quoteQuery.isSuccess]);

  useEffect(() => {
    if (searchInput !== "") {
      // Clear the existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set a new timeout to change isTyping to false after 3000 milliseconds (3 seconds)
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1500);
    }

    // Cleanup function to clear the timeout if the component unmounts or if searchInput changes before the timeout
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, inputRef]);

  const handleInputClick = () => {
    setShowDropdown(true);
  };

  const handleChange = (e: { target: { value: string } }) => {
    setIsTyping(true);
    setSearchInput(e.target.value.toLowerCase());
  };
  console.log(
    "isTyping:",
    isTyping,
    "\nsearch input:",
    searchInput,
    "\nfetch button: ",
    fetchDataClicked,
    "\nbestMatchesQuery.data:",
    bestMatchesQuery.data,

    "\nquoteQuery.data:",
    quoteQuery.data,
    "\nquoteQuery",
    quoteQuery
  );

  const handleClick = () => {
    if (searchInput.trim() !== "") {
      setSearchedQuote(searchInput);
      setFetchDataClicked(true);
      setShowDropdown(true);

      // Check if data is available in the cache
      const cachedQuote = queryClient.getQueryData(["quote", searchedQuote]);

      if (!cachedQuote && quoteQuery.isStale) {
        // If data is not in the cache or stale, trigger the query
        quoteQuery.refetch();
      }
    }
  };

  const renderQuoteResults = () => {
    const renderRow = (
      quote: quoteType,
      matches: suggestionType[] | undefined
    ) => (
      <div key={quote.symbol} className="quote-row">
        <div className="left-column">
          <div className="stock-name">{quote.name}</div>
          <div className="stock-details">{`${quote.symbol} :  ${
            matches ? matches[0]?.region : ""
          }`}</div>
        </div>
        <div className="right-column">
          <div className="price">{quote.price}</div>
          <div className="price-change">{`${quote.priceChange > 0 ? "+" : ""}${
            quote.priceChange
          }`}</div>
          <div className="percent-change">{`${
            quote.percentChange > 0 ? "+" : ""
          }${quote.percentChange}%`}</div>
        </div>
      </div>
    );

    if (quoteQuery.data && quoteQuery.data.length === 1) {
      // Display single result
      const result = quoteQuery.data[0];

      return (
        <div className="result-container">
          {renderRow(result, bestMatchesQuery.data)}
        </div>
      );
    } else if (
      bestMatchesQuery.data &&
      quoteQuery.data &&
      quoteQuery.data.length > 1
    ) {
      // Display multiple results
      return (
        <div className="result-container">
          {quoteQuery.data.map((quote) =>
            renderRow(quote, bestMatchesQuery.data)
          )}
        </div>
      );
    } else if (bestMatchesQuery.data) {
      // Display bestMatchesQuery results
      return (
        <div className="result-container">
          {bestMatchesQuery.data.map((result) => (
            <div key={result.symbol} className="quote-row">
              <div className="left-column">
                <div className="stock-name">{result.name}</div>
                <div className="stock-details">{`${result.symbol} : ${result.region}`}</div>
              </div>
              {/* You can decide if you want to display price, price change, percent change for best matches */}
            </div>
          ))}
        </div>
      );
    }

    return null; // Return null if there are no results
  };

  return (
    <>
      <div className="app-container">
        <div className="search-container" ref={inputRef}>
          <input
            className="search-input"
            value={searchInput}
            onChange={handleChange}
            onClick={handleInputClick}
            placeholder="Search for stocks..."
          />
          <button className="search-button" onClick={handleClick}>
            Search
          </button>
        </div>
        {showDropdown && (
          <div className="data" ref={dropdownRef}>
            {renderQuoteResults()}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
