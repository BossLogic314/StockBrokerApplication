import { buildSchema } from 'graphql';

export const schema = buildSchema(`

    type StockPrice {
        symbol: String!
        price: Float!
        timestamp: String!
    }

    type HistoricalData {
        date: String!
        open: Float!
        high: Float!
        low: Float!
        close: Float!
        volume: Int!
    }

    type CompanyInfo {
        name: String!
        sector: String!
        CEO: String!
        headquarters: String!
        description: String!
    }

    type Holding {
        symbol: String!
        quantity: Int!
        averagePrice: Float!
    }

    type UserPortfolio {
        holdings: [Holding!]!
        cashBalance: Float!
        totalValue: Float!
    }

    type Query {
        stockPrice(symbol: String!): StockPrice
        historicalData(symbol: String!, startData: String!, endDate: String!): [HistoricalData!]!
        companyInfo(name: String!): CompanyInfo
        userPortfolio(userId: String!): UserPortfolio
    }
`);

const rootValue = {
    stockPrice: ({symbol}) => {},
    historicalData: ({symbol, startDate, endDate}) => {},
    companyInfo: ({name}) => {},
    userPortfolio: ({userId}) => {}
}