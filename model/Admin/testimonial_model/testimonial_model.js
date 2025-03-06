
const connection = require('../../../connection/config/database')
// const path = require("path");
const sha1 = require('sha1');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
// function sha1(password) {
//     return crypto.createHash('sha1').update(password).digest('hex');
//   }



const TestimonialListModel = {

  testimonial_create: async (req, res) => {
    try {
      const { company_name, img, designation, description, created_by } = req.body;


      // Insert the user into the database
      const sql = 'INSERT INTO testimonial (company_name, img, designation, description, created_by) VALUES (?, ?, ?, ?, ?)';
      const values = [company_name, img, designation, description, created_by];

      connection.query(sql, values, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'User creation failed' });
        } else {
          res.status(200).json({ message: 'User created successfully' });
        }
      });
    }
    catch (error) {
      console.log(error)
    }
  },

  testimonial_edit: async (req, res) => {
    try {
      const { company_name, img, designation, description, modified_by } = req.body;
      const query = 'UPDATE testimonial SET company_name = ?, img = ?, designation = ?, description = ?, modified_by  = ? WHERE id = ? ';
      connection.query(query, [company_name, img, designation, description, modified_by, req.params.id], (error, result) => {
        if (!error && result.affectedRows > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || 'Product not found');
          return res.status(404).json({ message: 'Product not found.' });
        }
      });
    }
    catch (error) {
      console.log(error)
    }
  },

  testimonial_single: async (req, res) => {
    try {
      const query = 'SELECT * FROM testimonial WHERE id = ?';
      connection.query(query, [req.params.id], (error, result) => {
        if (!error && result.length > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || 'Product not found');
          return res.status(404).json({ message: 'Product not found.' });
        }
      });
    }
    catch (error) {
      console.log(error)
    }
  },

  testimonial_delete: async (req, res) => {
    try {
      const query = 'DELETE FROM testimonial WHERE id = ?';
      connection.query(query, [req.params.id], (error, result) => {
        if (!error && result.affectedRows > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || 'Product not found');
          return res.status(404).json({ message: 'Product not found.' });
        }
      });
    }
    catch (error) {
      console.log(error)
    }
  },


  testimonial_list: async (req, res) => {
    try {
      const data = "select * from  testimonial";

      connection.query(data, function (error, result) {
        console.log(result)
        if (!error) {
          res.send(result)
        }

        else {
          console.log(error)
        }

      })
    }
    catch (error) {
      console.log(error)
    }
  },

  testimonial_list_paigination: async (req, res) => {
    const pageNo = Number(req.params.pageNo);
    const perPage = Number(req.params.perPage);
    try {
      const skipRows = (pageNo - 1) * perPage;
      let query = `
  SELECT testimonial.*, 
         users_created.full_name AS created_by,
         users_modified.full_name AS modified_by 
  FROM testimonial 
  LEFT JOIN users AS users_created ON testimonial.created_by = users_created.id 
  LEFT JOIN users AS users_modified ON testimonial.modified_by = users_modified.id 
  ORDER BY testimonial.id DESC
  LIMIT ?, ?
`;

      connection.query(query, [skipRows, perPage], (error, result) => {
        console.log(result)
        if (!error) {
          res.send(result)
        }

        else {
          console.log(error)
        }

      })
    }
    catch (error) {
      console.log(error)
    }
  },

}

module.exports = TestimonialListModel
