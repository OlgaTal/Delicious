/* eslint-disable new-cap, no-underscore-dangle */

import express from 'express';
import Bookmark from '../models/Bookmark';
import joi from 'joi';  // validator
const router = module.exports = express.Router();

// router.get('/', (req, res) => {
//   Creature.find((err, creatures) => res.send({ creatures }));
// });
//
// router.get('/:id/get', (req, res) => {
//   const id = req.params.id;
//   Creature.findById(id, (err, creature) => res.send({ creature }));
// });

router.post('/', (req, res) => {
  // const bookmark = new Bookmark(req.body);
  // console.log('bookmark', bookmark);
  // bookmark.save(() => {
  //   res.send({ bookmark });
  // });

  const schema = {
    title: joi.string().required(),
    url: joi.string(),
    description: joi.string(),
    isProtected: joi.boolean(),
    datePublished: joi.date(),
    dateCreated: joi.date(),
    stars: joi.number(),
    tags: joi.array(),
  };

  const results = joi.validate(req.body, schema);

  if (results.error) {
    return res.status(400).send({ messages: results.error.details.map(d => d.message) });
  }

  Bookmark.create(req.body, (err, bookmark) => {
    res.send({ bookmark });
  });
});
