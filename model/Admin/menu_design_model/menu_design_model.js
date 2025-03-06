const connection = require('../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');
var fs = require("fs");

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

// wkhtmltopdf.command = "C:\\Users\\user\\Desktop\\Ecommerce\\node_modules\\wkhtmltopdf\\index.js";
const formatString = (str) => {
  const words = str?.split('_');

  const formattedWords = words?.map((word) => {
    const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return capitalizedWord;
  });

  return formattedWords?.join(' ');
};

const MenuDesignModel = {

  // menu_create: async (req, res) => {
  //   try {
  //     const {
  //       id,
  //       textColor,
  //       border_style,
  //       cardBodyBg,
  //       cardBodyBgs,
  //       button_bg_status,
  //       button_bg_statusess,
  //       button_bg_statuses,
  //       button_bg_statusesss,
  //       button_bg_statuse,
  //       checkboxValue,
  //       is_default,
  //       border_width,
  //       border_widths,
  //       border_side,
  //       border_sides,
  //       textColors,
  //       border_styles
  //     } = req.body;

  //     let query;
  //     let values;

  //     if (is_default == 1) {
  //       // Insert Query for new record
  //       query = `
  //               INSERT INTO menu_design (
  //                   border, border_style, button_shadow, border_hover_round, button_hover_shadow,
  //                   button_text, button_hover_text, button_text_status, button_bg, button_hover_bg,
  //                   button_bg_status, button_hover_bg_status, is_button_hover, unique_id, is_default,
  //                   border_round, created_by, border_hover, border_hover_style, button_size,
  //                   border_width, border_hover_width, border_side, border_hover_side
  //               ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  //           `;

  //       values = [
  //         textColor, border_style, null, null, null,
  //         cardBodyBg, cardBodyBgs, '',
  //         button_bg_status == 4 ? button_bg_statusess :
  //           button_bg_status == 5 ? button_bg_statuses : '',
  //         checkboxValue == 1 && button_bg_status == 4 ? button_bg_statusesss :
  //           button_bg_status == 5 ? button_bg_statuse : '',
  //         button_bg_status, 0, checkboxValue, 2147483647,
  //         is_default, null, 2, textColors, border_styles,
  //         null, border_width, border_widths, border_side, border_sides
  //       ];
  //     } else {
  //       // Update Query for existing record
  //       query = `
  //               UPDATE menu_design SET
  //                   border = ?, border_style = ?, button_text = ?, button_hover_text = ?,
  //                   button_bg = ?, button_hover_bg = ?, button_bg_status = ?, button_hover_bg_status = ?,
  //                   is_button_hover = ?, border_hover = ?, border_hover_style = ?, border_width = ?,
  //                   border_hover_width = ?, border_side = ?, border_hover_side = ?
  //               WHERE id = ?
  //           `;

  //       values = [
  //         textColor, border_style, cardBodyBg, cardBodyBgs,
  //         button_bg_status == 4 ? button_bg_statusess :
  //           button_bg_status == 5 ? button_bg_statuses : '',
  //         checkboxValue == 1 && button_bg_status == 4 ? button_bg_statusesss :
  //           button_bg_status == 5 ? button_bg_statuse : '',
  //         button_bg_status, 0, checkboxValue, textColors, border_styles,
  //         border_width, border_widths, border_side, border_sides,
  //         id
  //       ];
  //     }

  //     // Execute query with connection.query
  //     connection.query(query, values, (error, result) => {
  //       if (error) {
  //         console.error("Database Error:", error);
  //         return res.status(500).json({ success: false, message: "Database error", error });
  //       }

  //       const { insertId, affectedRows } = result;
  //       res.status(200).json({
  //         success: true,
  //         message: is_default == 1 ? 'Inserted successfully' : 'Updated successfully',
  //         insertId, affectedRows
  //       });
  //     });

  //   } catch (error) {
  //     console.error("Server Error:", error);
  //     res.status(500).json({ success: false, message: "Error processing the request", error });
  //   }
  // },


  //   menu_create: async (req, res) => {
  //     try {
  //         const {
  //             textColor,
  //             border_style,
  //             cardBodyBg,
  //             cardBodyBgs,
  //             button_bg_status,
  //             button_bg_statusess,
  //             button_bg_statuses,
  //             button_bg_statusesss,
  //             button_bg_statuse,
  //             checkboxValue,
  //             selectedMenuItem,
  //             border_width,
  //             border_widths,
  //             border_side,
  //             border_sides,
  //             textColors,
  //             border_styles
  //         } = req.body;

  //         let query;
  //         let values;

  //         if (selectedMenuItem.is_default == 1) {
  //             // Insert Query
  //             query = `
  //                 INSERT INTO menu (
  //                     border, border_style, button_shadow, border_hover_round, button_hover_shadow,
  //                     button_text, button_hover_text, button_text_status, button_bg, button_hover_bg,
  //                     button_bg_status, button_hover_bg_status, is_button_hover, unique_id, is_default,
  //                     border_round, created_by, border_hover, border_hover_style, button_size,
  //                     border_width, border_hover_width, border_side, border_hover_side
  //                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  //             `;

  //             values = [
  //                 textColor, border_style, null, null, null,
  //                 cardBodyBg, cardBodyBgs, '', 
  //                 button_bg_status == 4 ? button_bg_statusess :
  //                 button_bg_status == 5 ? button_bg_statuses : '',
  //                 checkboxValue == 1 && button_bg_status == 4 ? button_bg_statusesss :
  //                 button_bg_status == 5 ? button_bg_statuse : '',
  //                 button_bg_status, 0, checkboxValue, 2147483647,
  //                 selectedMenuItem.is_default, null, 2, textColors, border_styles,
  //                 null, border_width, border_widths, border_side, border_sides
  //             ];
  //         } else {
  //             // Update Query
  //             query = `
  //                 UPDATE menu SET
  //                     border = ?, border_style = ?, button_text = ?, button_hover_text = ?,
  //                     button_bg = ?, button_hover_bg = ?, button_bg_status = ?, button_hover_bg_status = ?,
  //                     is_button_hover = ?, border_hover = ?, border_hover_style = ?, border_width = ?,
  //                     border_hover_width = ?, border_side = ?, border_hover_side = ?
  //                 WHERE id = ?
  //             `;

  //             values = [
  //                 textColor, border_style, cardBodyBg, cardBodyBgs,
  //                 button_bg_status == 4 ? button_bg_statusess :
  //                 button_bg_status == 5 ? button_bg_statuses : '',
  //                 checkboxValue == 1 && button_bg_status == 4 ? button_bg_statusesss :
  //                 button_bg_status == 5 ? button_bg_statuse : '',
  //                 button_bg_status, 0, checkboxValue, textColors, border_styles,
  //                 border_width, border_widths, border_side, border_sides,
  //                 req.params.id
  //             ];
  //         }

  //         connection.query(query, values, (error, result) => {
  //             if (error) {
  //                 console.error("Database Error:", error);
  //                 return res.status(500).json({ success: false, message: "Database error", error });
  //             }
  //             res.status(200).json({ 
  //                 success: true, 
  //                 message: selectedMenuItem.is_default == 1 ? 'Inserted successfully' : 'Updated successfully', 
  //                 result 
  //             });
  //         });

  //     } catch (error) {
  //         console.error("Server Error:", error);
  //         res.status(500).json({ success: false, message: "Error processing the request", error });
  //     }
  // },


  menu_create: async (req, res) => {
    try {
      const {
        id,
        border,
        border_style,
        button_shadow,
        border_hover_round,
        button_hover_shadow,
        button_text,
        button_hover_text,
        button_text_status,
        button_bg,
        button_hover_bg,
        button_bg_status,
        button_hover_bg_status,
        is_button_hover,
        unique_id,
        is_default,
        border_round,
        created_by,
        border_hover,
        border_hover_style,
        button_size,
        border_width,
        border_hover_width,
        border_side,
        border_hover_side
      } = req.body;

      let query, values;

      if (is_default == 1) {
        // INSERT Query
        query = `INSERT INTO menu_design (
                 border, border_style, button_shadow, border_hover_round, button_hover_shadow,
                button_text, button_hover_text, button_text_status, button_bg, button_hover_bg,
                button_bg_status, button_hover_bg_status, is_button_hover, unique_id, is_default,
                border_round, created_by, border_hover, border_hover_style, button_size, border_width,
                border_hover_width, border_side, border_hover_side
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        values = [
          border, border_style, button_shadow, border_hover_round, button_hover_shadow,
          button_text, button_hover_text, button_text_status, button_bg, button_hover_bg,
          button_bg_status, button_hover_bg_status, is_button_hover, unique_id, is_default,
          border_round, created_by, border_hover, border_hover_style, button_size, border_width,
          border_hover_width, border_side, border_hover_side
        ];
      } else if (is_default == 2) {
        // UPDATE Query
        query = `UPDATE menu_design SET 
                border = ?, border_style = ?, button_shadow = ?, border_hover_round = ?, button_hover_shadow = ?, 
                button_text = ?, button_hover_text = ?, button_text_status = ?, button_bg = ?, button_hover_bg = ?, 
                button_bg_status = ?, button_hover_bg_status = ?, is_button_hover = ?, unique_id = ?, is_default = ?, 
                border_round = ?, created_by = ?, border_hover = ?, border_hover_style = ?, button_size = ?, 
                border_width = ?, border_hover_width = ?, border_side = ?, border_hover_side = ? 
                WHERE id = ?`;

        values = [
          border, border_style, button_shadow, border_hover_round, button_hover_shadow,
          button_text, button_hover_text, button_text_status, button_bg, button_hover_bg,
          button_bg_status, button_hover_bg_status, is_button_hover, unique_id, is_default,
          border_round, created_by, border_hover, border_hover_style, button_size, border_width,
          border_hover_width, border_side, border_hover_side, id
        ];
      } else {
        return res.status(400).json({ message: "Invalid is_default value" });
      }

      // connection.query() with callback function to get result and error
      connection.query(query, values, (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ message: "Database Error", error: err });
        }

        res.status(200).json({ message: "Success", result });
      });

    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Error processing the request", error });
    }
  },

  menu_create_item: async (req, res) => {
    try {
      const { menu_name, menu_design_id, menu_theme_id, menu_animation, menu_side, scroll_position, is_main, created_by, is_responsive } = req.body;

      // Using parameterized query to prevent SQL injection
      const insertQuery = "INSERT INTO menu (menu_name, menu_design_id, menu_theme_id, menu_animation,menu_side, scroll_position,is_main,  created_by, is_responsive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

      connection.query(insertQuery, [menu_name, menu_design_id, menu_theme_id, menu_animation, menu_side, scroll_position, is_main, created_by, is_responsive], (error, result) => {
        if (error) {
          console.error("Database Error:", error);
          return res.status(500).json({ message: "Error processing the request", error });
        }

        // Sending only the necessary data from the result object
        const { insertId, affectedRows } = result;

        // Sending response with relevant data
        res.status(200).json({ insertId, affectedRows });
      });

    } catch (error) {
      console.error("Unexpected Error:", error);
      res.status(500).json({ message: "Unexpected error occurred", error });
    }
  },


  menu_design_list: async (req, res) => {
    try {
      const data = "select * from  menu_design";

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
  menu_list: async (req, res) => {
    try {
      const data = "select * from  menu";

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
  menu_theme_list: async (req, res) => {
    try {
      const data = "select * from  menu_theme";

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


  menu_single: async (req, res) => {
    try {
      const query = 'SELECT * FROM menu WHERE id = ?';
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


  menu_update: async (req, res) => {
    try {



      const { menu_name, menu_design_id, menu_theme_id, menu_animation, modified_by, menu_side, scroll_position, is_main, is_responsive } = req.body;

      const query = `UPDATE menu SET menu_name = ?, menu_design_id = ?, menu_theme_id = ?, menu_animation = ?, modified_by = ?, menu_side = ?, scroll_position = ?, is_main = ?, is_responsive = ? WHERE id = ?`;
      connection.query(query, [menu_name, menu_design_id, menu_theme_id, menu_animation, modified_by, menu_side, scroll_position, is_main, is_responsive, req.params.id], (error, result) => {
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




  menu_delete: async (req, res) => {

    try {
      const query = 'DELETE FROM menu WHERE id = ?';
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



  menu_list_paigination: async (req, res) => {
    const pageNo = Number(req.params.pageNo);
    const perPage = Number(req.params.perPage);
    try {
      const skipRows = (pageNo - 1) * perPage;
      let query = `
         SELECT menu.*, 
       users_created.full_name AS created_by,
       users_modified.full_name AS modified_by,
       menu_theme.menu_theme_name
FROM menu
LEFT JOIN users AS users_created ON menu.created_by = users_created.id
LEFT JOIN users AS users_modified ON menu.modified_by = users_modified.id
LEFT JOIN menu_theme ON menu.menu_theme_id = menu_theme.id
ORDER BY menu.id DESC
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

  material_search: async (req, res) => {
    try {
      console.log("Search button clicked.");

      // Extract necessary data from request
      let { searchQuery, statusFilter, selectedOrder, fromDate, toDate, multiSearch } = req.body;

      // Construct the base SQL query
      // INNER
      let sql = `
      SELECT material.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
      FROM material 
      LEFT JOIN users AS users_created ON material.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON material.modified_by = users_modified.id 
      WHERE 1 `;
      //order  by variable
      //order  by material_name asc, status_id desc,created_date desc
      // Add search query condition
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        sql += ` AND LOWER(material_name) LIKE '%${query}%' `;
      }

      // Add status filter condition
      if (statusFilter !== '') {
        sql += ` AND status_id = ${statusFilter} `;
      }

      // Add date range condition
      if (fromDate && toDate) {
        // Reverse fromDate and toDate if fromDate is greater than toDate
        if (fromDate > toDate) {
          const temp = fromDate;
          fromDate = toDate;
          toDate = temp;
        }

        sql += ` AND material.created_date BETWEEN '${fromDate}' AND '${toDate}' `;
      } else if (fromDate && !toDate) {
        sql += ` AND material.created_date >= '${fromDate}' `;
      } else if (!fromDate && toDate) {
        sql += ` AND material.created_date <= '${toDate}' `;
      }

      if (multiSearch && multiSearch.length > 0) {
        sql += ` ORDER BY ${multiSearch}`; // Append convertedData to the ORDER BY clause
      }

      console.log("SQL Query:", sql);



      // Execute the constructed SQL query
      connection.query(sql, (error, results, fields) => {
        if (error) {
          console.error("Error occurred during search:", error);
          res.status(500).json({ error: "An error occurred during search." });
        } else {
          console.log("Search results:", results, sql);
          res.status(200).json({ results });
        }
      });
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({ error: "An error occurred." });
    }
  },


  material_pdf: async (req, res) => {
    try {
      const { searchResults, selectedColumns } = req.body; // Assuming selectedColumns is an array of column names

      console.log(searchResults, 'here all the searchResults');
      const statusLabels = {
        1: 'Active',
        2: 'Inactive',
        3: 'Pending'
      };

      const longTextColumns = ['material_name', 'description'];
      let tableRows = '';
      searchResults?.forEach((result, index) => {
        let row = '<tr>';
        selectedColumns.forEach(column => {
          if (column === 'serial') {
            row += `<td>${index + 1}</td>`; // Displaying index number starting from 1
          } else if (column === 'action') {
            // Skip this column
          }
          else if (column === 'status_id') {
            const statusLabel = statusLabels[result[column]] || '';
            // Get corresponding label from statusLabels object
            row += `<td>${statusLabel}</td>`;
          }
          // else if (column === 'file_path') {
          //   // Encode the image URL
          //   const encodedURL = encodeURIComponent(result[column]);
          //   console.log(`${process.env.NEXT_PUBLIC_API_URL}:5003/${result[column]}`, 'encodedURL welcome');
          //   // const encodedURL = encode(result[column]);
          //   row += `<td><img src="${process.env.NEXT_PUBLIC_API_URL}:5003/${result[column]}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`;
          // }
          else if (column === 'file_path') {
            if (result[column]) {
              // Encode the image URL
              const encodedURL = encodeURIComponent(result[column]);
              console.log(`http://192.168.0.114:5003/${result[column]}`, 'encodedURL welcome');
              // const encodedURL = encode(result[column]);
              row += `<td><img src="http://192.168.0.114:5003/${result[column]}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`;
            } else {
              // No file path provided, show a placeholder message
              row += `<td></td>`;
            }
          }
          else {
            const style = longTextColumns.includes(column) ? 'word-wrap: break-word; word-break: break-all;' : '';
            row += `<td style="${style}">${result[column]}</td>`;
            // row += `<td>${result[column]}</td>`; // Displaying regular columns
          }
        });
        row += '</tr>';
        tableRows += row;
      });
      // <link href='http://sonnetdp.github.io/nikosh/css/nikosh.css' rel='stylesheet' type='text/css'>
      // <link href='./nikosh.css' rel='stylesheet' type='text/css'>
      //  ${process.env.NEXT_PUBLIC_API_URL}:5002/get-css/nikosh.css
      // @import url("nikosh.css");

      const html = `<html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
  
          <style>
        
          * { 
            sheet-size: A4;font-family: 'Nikosh', sans-serif !important;
          }
  
              table {
                  width: 100%;
                  border-collapse: collapse;
              }
              th, td {
                  padding: 8px;
                  text-align: left;
                  border: 1px solid #ddd;
              }
              th {
                  background-color: #f2f2f2;
              }
              img {
                  max-width: 100px;
                  max-height: 100px;
              }
              .container {
                text-align: center;
            }
            .container2 {
              display: flex;
              justify-content: space-between;
          }
          </style>
      </head>
      <body>
     <div class='container'>
     <h2 style="margin: 0; padding: 0;">Pathshala School & College material List</h2>
     <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
     <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
     <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
     <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">material List</h3>
     </div>
     <div class="container2" style:"display: flex;
     justify-content: space-between;">
     <p style="margin: 0; padding: 0;">Receipt No: 829</p>
     <p style="margin: 0; padding: 0;">Collected By:</p>
     <p style="margin: 0; padding: 0;">Date: </p>
    </div>
          <table>
              <thead>
                  <tr>
                      ${selectedColumns.filter(column => column !== 'action').map(column => {
        if (column === 'status_id') {
          return `<th>Status</th>`;
        }
        else if (column === 'file_path') {
          return `<th>File</th>`;
        }
        else {
          return `<th>${formatString(column)}</th>`;
        }
      }).join('')}
                  </tr>
              </thead>
              <tbody >
                  ${tableRows}
              </tbody>
          </table>
      </body>
      </html>`;

      wkhtmltopdf(html, { pageSize: 'letter' }, (err, stream) => {
        if (err) {
          console.error('Error generating PDF:', err);
          res.status(500).send('Error generating PDF');
          return;
        }
        stream.pipe(res);
      });
    } catch (error) {
      console.error('Error in material_pdf:', error);
      res.status(500).send('Error generating PDF');
    }
  }
}
module.exports = MenuDesignModel