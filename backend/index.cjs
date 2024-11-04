/* eslint-disable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATASET_URL = exports.DISALLOWED_RESTAURANTS = void 0;
var express = require("express");
var express_graphql_1 = require("express-graphql");
var graphql_1 = require("graphql");
exports.DISALLOWED_RESTAURANTS = [
    'Żabka | Prosto z pieca',
    'Shell',
    'McDonald\'s',
    'Subway',
    'Wild Bean Cafe',
    'KFC',
];
exports.DATASET_URL = 'https://api.apify.com/v2/datasets/iPKiTWZqnGc3qS1y0/items?token=apify_api_qr4r0vaVreBfgDNNoGfbm3uCAdzAzl4zEBIA';
var schema = (0, graphql_1.buildSchema)("#graphql\n    type Location {\n        lat: Float\n        lng: Float\n    }\n\n    type Restaurant {\n        searchString: String\n        rank: Int\n        searchPageUrl: String\n        isAdvertisement: Boolean\n        placeId: String\n        location: Location\n        address: String\n        neighborhood: String\n        street: String\n        city: String\n        postalCode: String\n        state: String\n        countryCode: String\n        categoryName: String\n        categories: [String]\n        title: String!\n        totalScore: Float\n        permanentlyClosed: Boolean\n        temporarilyClosed: Boolean\n        reviewsCount: Int\n        url: String\n        price: String\n        cid: String\n        fid: String\n        imageUrl: String\n    }\n\n    type Query {\n        restaurants: [Restaurant!]!\n    }\n");
var rootValue = {
    restaurants: function () {
        return [];
    },
};
var app = express();
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
    schema: schema,
    rootValue: rootValue,
    graphiql: { headerEditorEnabled: true },
}));
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Server ready at http://localhost:".concat(port, "/graphql"));
});
