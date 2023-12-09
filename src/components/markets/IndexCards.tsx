import React from "react";
import { Grid, Card, CardContent, Typography, Container } from "@mui/material";
import { IndexCardProps, IndexCard } from "./types";

const IndexCards: React.FC<IndexCardProps> = ({ cards, currExchance }) => {
  // Your card data (you can replace this with your actual data)
  return (
    <Container>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {cards
          .filter((card: IndexCard) => card.exchange === currExchance)
          .map((card: IndexCard) => (
            <Grid item key={card.symbol} xs={4} sm={4} md={3} lg={2} xl={2}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <CardContent
                  className="cardcontent"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {card.icon && (
                    <div>
                      <card.icon
                        size={24}
                        color={card.priceChange > 0 ? "green" : "red"}
                      />
                    </div>
                  )}
                  <div>
                    <Typography variant="h6" component="div">
                      {card.symbol}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.price}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="body2"
                      color={card.priceChange > 0 ? "green" : "red"}
                    >
                      {card.percentChange}%
                    </Typography>
                    <Typography
                      variant="body2"
                      color={card.priceChange > 0 ? "green" : "red"}
                    >
                      {card.priceChange}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default IndexCards;
