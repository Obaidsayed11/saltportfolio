import BaseApi from "../BaseQuery/baseQuery";

export const portfolioApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolioData: builder.query({
      query: (tenure) => ({
        url: `/api/v1/portfolio?tenure=${tenure}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetPortfolioDataQuery } = portfolioApi;
