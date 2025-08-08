import asyncHandler from "../Utils/AsyncHandler.js";

export const getPortfolioData = asyncHandler(async (req, res) => {
  const { tenure } = req.query;


   const dummyData = {
    Daily: [
      { date: "2025-08-01", value: 100 },
      { date: "2025-08-02", value: 120 },
      { date: "2025-08-03", value: 90 },
    ],
    Weekly: [
      { date: "Week 1", value: 400 },
      { date: "Week 2", value: 500 },
    ],
    Monthly: [
      { date: "Jan", value: 800 },
      { date: "Feb", value: 900 },
    ],
    Quarterly: [
      { date: "Q1", value: 2000 },
      { date: "Q2", value: 2500 },
    ],
    Yearly: [
      { date: "2022", value: 7000 },
      { date: "2023", value: 8000 },
    ],
  };

  if (!tenure || !dummyData[tenure]) {
    return res.status(400).json({ message: "Invalid or missing tenure" });
  }

  res.status(200).json({
    success: true,
    data: dummyData[tenure],
    message: `Data fetched for ${tenure}`,
  });
});


