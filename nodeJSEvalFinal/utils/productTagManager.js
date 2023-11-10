const {Product, Tag} = require("../models");

async function addTag(data, result, res) {
    Product.findByPk(result.id).then((product) => {
        // Insert tag(s) in product_tag table
        if(Array.isArray(data.tag)) {
            for(const tag in data.tag) {
                Tag.findByPk(data.tag[tag]).then((tag) => {
                    product.addTag(tag).then(() => {
                    }).catch((error) => {
                        res.status(500);
                        res.json(error);
                    });
                })
            }
        } else {
            // Insert tag in product_tag table
            Tag.findByPk(data.tag).then((tag) => {
                product.addTag(tag).then(() => {
                }).catch((error) => {
                    res.status(500);
                    res.json(error);
                });
            })
        }
        res.send('Tag added');
        res.status(201);
    })
}

module.exports = { addTag };