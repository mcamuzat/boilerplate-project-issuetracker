/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
const Issue = require('../models/issue.js');
var expect = require('chai').expect;
var ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');

const CONNECTION_STRING = process.env.MONGO_URI;

module.exports = function(app) {
  mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  app.route('/api/issues/:project')

    .get(function(req, res) {
       var project = req.params.project;
       Issue.find(req.query, (err, doc) => {
        if (err) return res.status(500).send('error')
        res.send(doc)
      })
    })

    .post(function(req, res) {
      var project = req.params.project;
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.json('issue_title, issue_text and created_by are required')
      }
      let newIssue = new Issue({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        open: true,
        created_on: new Date().toUTCString(),
        updated_on: new Date().toUTCString(),
        project: project
      })
      newIssue.save((error, issue) => {
        if (!error && issue) {
          res.json(issue)
        }
      })

    })

    .put(function(req, res) {
      var project = req.params.project;
      var obj = Object.assign({}, req.body)
      if (Object.values(obj).length === 0) {
        return res.send('no updated field sent')
      }
      obj['updated_on'] = new Date().toUTCString();
      Issue.findByIdAndUpdate(req.body._id, obj, (err, doc) => {
        if (!doc) return res.send('could not update ' + req.body._id + '')
        return res.send('successfully updated')
      })
   

    })

    .delete(function(req, res) {
      var project = req.params.project;
      if (!ObjectId.isValid(req.body._id)) {
        return res.send('id error')
      }
      Issue.findByIdAndRemove(req.body._id, (err, doc) => {
        if (err) return console.error(err)
        if (!doc) return res.send(`could not delete ${req.body._id}`)
        return res.json(`deleted ${req.body._id}`)
      })

    });

};
