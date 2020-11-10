/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const Issue = require('../models/issue')

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      afterEach((done) => {
        Issue.remove({}, (err) => {
          done()
        })
      })
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.assigned_to, 'Chai and Mocha')
          assert.equal(res.body.status_text, 'In QA')
          //fill me in too!
          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'test 1',
            issue_text: 'test 1',
            created_by: 'creator test'
          })
          .end(function (err, res) {
            assert.equal(err, null)
            assert.equal(res.status, 200)
            assert.equal(res.body.issue_title, 'test 1')
            assert.equal(res.body.issue_text, 'test 1')
            assert.equal(res.body.created_by, 'creator test')
            done()
        })
      });
      
      test('Missing required fields', function(done) {
         chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_text: 'test 1',
            created_by: 'creator test'
          })
          .end(function (err, res) {
            assert.equal(res.body, 'issue_title, issue_text and created_by are required')
            done()
        })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'no updated field sent')
          done()
        })
      });
      
      test('One field to update', function(done) {
      let fixture = Issue({
        issue_title: 'fixture',
        issue_text: 'fixture',
        created_by: 'test creator',
        open: true, 
        created_on: new Date(),
        updated_on: new Date()
      })
      fixture.save((err, doc) => {
        chai.request(server)
          .put('/api/issues/test')
          .send({_id: doc._id, issue_title: 'change'})
          .end(function (err, res) {
            console.log(err,res.body)
            assert.equal(res.status, 200)
            assert.equal(res.text, 'successfully updated')
            done()
          })
        })
      });
      
      test('Multiple fields to update', function(done) {
      let fixture = Issue({
        issue_title: 'fixture',
        issue_text: 'fixture',
        created_by: 'test creator',
        open: true, 
        created_on: new Date(),
        updated_on: new Date()
      })
      fixture.save((err, doc) => {
        chai.request(server)
          .put('/api/issues/test')
          .send({_id: doc._id, issue_title: 'change', issue_text:'change'})
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'successfully updated')
            done()
          })
        })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
       test('No filter', function (done) {
      let fixture = Issue({
        issue_title: 'title',
        issue_text: 'text',
        created_by: 'creator',
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
        assigned_to: '',
        status_text: ''
      })
      fixture.save((err, doc) => {
        chai.request(server)
          .get('/api/issues/test')
          .query({})
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.isArray(res.body)
            assert.property(res.body[0], 'issue_title')
            assert.property(res.body[0], 'issue_text')
            assert.property(res.body[0], 'created_on')
            assert.property(res.body[0], 'updated_on')
            assert.property(res.body[0], 'created_by')
            assert.property(res.body[0], 'assigned_to')
            assert.property(res.body[0], 'open')
            assert.property(res.body[0], 'status_text')
            assert.property(res.body[0], '_id')
            done()
          })
      })
    })

    test('One filter', function (done) {
      let fixture = Issue({
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'creator',
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
        assigned_to: '',
        status_text: ''
      })
      fixture.save((err, doc) => {
        chai.request(server)
          .get('/api/issues/test')
          .query({created_by: 'creator'})
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.isArray(res.body)
            assert.equal(res.body[0].created_by, 'creator')
            done()
          })
      })
    })
    //
    test('Multiple filters (test for multiple fields you know will be in the db for a return)', function (done) {
      let fixture = Issue({
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'creator',
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
        assigned_to: '',
        status_text: ''
      })
      fixture.save((err, doc) => {
        chai.request(server)
          .get('/api/issues/test')
          .query({created_by: 'creator', issue_title: 'Title'})
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.isArray(res.body)
            assert.equal(res.body[0].issue_title, 'Title')
            done()
          })
      })
    })
      
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, '_id error')
          done()
        })
        done();
      });
      
      test('Valid _id', function(done) {
      let fixture = Issue({
        issue_title: 'fixture',
        issue_text: 'fixture',
        created_by: 'fixture',
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
      })
      fixture.save((err, doc) => {
        chai.request(server)
          .delete('/api/issues/test')
          .send({_id: doc._id})
          .end(function (err, res) {
            assert.equal(res.status, 200)
            done()
          })
      })
      });
      
    });

});
