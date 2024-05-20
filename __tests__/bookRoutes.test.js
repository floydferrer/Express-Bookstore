const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

describe("Book Routes Test", function () {

    beforeEach(async function () {
      await db.query("DELETE FROM books");
  
      await Book.create({
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking Hidden Math in Video Games",
        year: 2017
      });
    });
  
    /** GET /books => list all books  */
  
    describe("GET /books", function () {
      test("can view all books", async function () {
        let response = await request(app).get("/books");
        expect(response.body).toEqual({
            "books": [
                {
                    "isbn": "0691161518",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Matthew Lane",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Up: Unlocking Hidden Math in Video Games",
                    "year": 2017
                }
            ]
        });
      });
    });
  
    /** POST /books => book  */
  
    describe("POST /books", function () {
      test("can add book", async function () {
        let response = await request(app)
          .post("/books")
          .send({
            isbn: "0691161519",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking Hidden Math in Video Games",
            year: 2017
          });
  
        expect(response.body).toEqual({
            "book": {
                "isbn": "0691161519",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking Hidden Math in Video Games",
                "year": 2017
            }
        });
      });
      
      test("invalid page format", async function () {
        let response = await request(app)
          .post("/books")
          .send({
            isbn: "0691161520",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: "264",
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking Hidden Math in Video Games",
            year: 2017
          });
  
      expect(response.body).toEqual({
        "error": {
            "message": [
                "instance.pages is not of a type(s) integer"
            ],
            "status": 400
        }
      });
    });
      
      test("isbn already exists", async function () {
        let response = await request(app)
          .post("/books")
          .send({
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking Hidden Math in Video Games",
            year: 2017
          });
  
      expect(response.body.error.detail).toEqual("Key (isbn)=(0691161518) already exists.");
      });
    });

    /** PUT /books/:isbn => book  */
  
    describe("PUT /books/:isbn", function () {
        test("can update book", async function () {
          let response = await request(app)
            .put("/books/0691161518")
            .send({
              isbn: "0691161518",
              amazon_url: "http://a.co/eobPtX2",
              author: "Matthew Lane",
              language: "engrish",
              pages: 264,
              publisher: "Princeton University Press",
              title: "Power-Up: Unlocking Hidden Math in Video Games",
              year: 2017
            });
    
          expect(response.body).toEqual({
              "book": {
                  "isbn": "0691161518",
                  "amazon_url": "http://a.co/eobPtX2",
                  "author": "Matthew Lane",
                  "language": "engrish",
                  "pages": 264,
                  "publisher": "Princeton University Press",
                  "title": "Power-Up: Unlocking Hidden Math in Video Games",
                  "year": 2017
              }
          });
        });
        
        test("invalid page format", async function () {
          let response = await request(app)
            .put("/books/0691161518")
            .send({
              isbn: "0691161518",
              amazon_url: "http://a.co/eobPtX2",
              author: "Matthew Lane",
              language: "english",
              pages: "264",
              publisher: "Princeton University Press",
              title: "Power-Up: Unlocking Hidden Math in Video Games",
              year: 2017
            });
    
        expect(response.body).toEqual({
          "error": {
              "message": [
                  "instance.pages is not of a type(s) integer"
              ],
              "status": 400
          }
        });
      });
        
        test("isbn doesn't exist", async function () {
          let response = await request(app)
            .put("/books/0691161520")
            .send({
              isbn: "0691161520",
              amazon_url: "http://a.co/eobPtX2",
              author: "Matthew Lane",
              language: "english",
              pages: 264,
              publisher: "Princeton University Press",
              title: "Power-Up: Unlocking Hidden Math in Video Games",
              year: 2017
            });
    
        expect(response.body.error).toEqual({
            "message": "There is no book with an isbn '0691161520",
            "status": 404
            });
        });
      });
  });
  
  afterAll(async function () {
    await db.end();
  });