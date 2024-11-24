const joi = require("joi");
const reviews = require("./models/reviews");

module.exports.arbnbSchema = joi.object({
    arbnb:joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required().min(0),
    country: joi.string().required(),
    location: joi.string().allow(null, " "),
    image: joi.string().allow(null, "") // Allowing image to be null or an empty string
}).required()
});

module.exports.reviewsSchema = joi.object({
    reviews: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required()
    }).required()

});