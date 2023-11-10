const {Product, Tag} = require("../models");

async function addTag(data, result, res) {
    Product.findByPk(result.id).then((product) => {
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