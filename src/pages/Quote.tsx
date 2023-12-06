import React from "react";

interface QuoteProps {
  symbol?: string;
  price?: number;
  data?: [];
}

const Quote: React.FC<QuoteProps> = () => {
  return (
    <div>
      <div>Stock Symbol Price Data</div>
    </div>
  );
};

export default Quote;
