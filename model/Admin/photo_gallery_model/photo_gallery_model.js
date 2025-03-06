
const connection = require('../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

const photoGalleryModel = {

    photo_gallery_create: async (req, res) => {
        try {
            const { formData, fields } = req.body;

            if (!formData || !fields || fields.length === 0) {
                return res.status(400).json({ message: "Invalid input data" });
            }


            // Insert formData into events_gallery table
            const insertGalleryQuery = `
                INSERT INTO events_gallery (events_title, title_url, status, events_category_id, created_by) 
                VALUES (?, ?, ?, ?, ?)
            `;

            const galleryValues = [
                formData.events_title,
                formData.title_url,
                formData.status,
                formData.events_category_id,
                formData.created_by
            ];

            connection.query(insertGalleryQuery, galleryValues, (err, galleryResult) => {
                if (err) {
                    console.error("Error inserting into events_gallery:", err);
                    return res.status(500).json({ message: "Database error", error: err });
                }

                const events_gallery_id = galleryResult.insertId;

                // Insert fields into events_gallery_image table
                const insertImageQuery = `
                    INSERT INTO events_gallery_image (events_gallery_id, image_name, image_caption, created_by, thumbnail) 
                    VALUES ?
                `;

                const imageValues = fields.map(field => [events_gallery_id, field.file_path, field.image_caption, formData.created_by, field.file_path]);

                connection.query(insertImageQuery, [imageValues], (imgErr, imgResult) => {
                    if (imgErr) {
                        console.error("Error inserting into events_gallery_image:", imgErr);
                        return res.status(500).json({ message: "Database error", error: imgErr });
                    }

                    res.status(200).json({
                        message: "Photo gallery created successfully",
                        events_gallery_id,
                        inserted_images: imgResult.affectedRows
                    });
                });
            });

        } catch (error) {
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "Error processing the request", error });
        }
    },


    events_gallery_list: async (req, res) => {
        try {
            const data = `SELECT bg.*, u.full_name AS full_name
                   FROM events_gallery bg
               LEFT    JOIN users u ON bg.created_by = u.id
                   ORDER BY bg.id DESC;`;

            connection.query(data, function (error, result) {
                if (!error) {
                    res.send(result);
                } else {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }
    },


    events_gallery_single: async (req, res) => {
        try {
            const query = `
                SELECT * FROM events_gallery 
                LEFT JOIN events_gallery_image ON events_gallery.id = events_gallery_image.events_gallery_id 
                WHERE events_gallery.id = ?`;

            connection.query(query, [req.params.id], (error, result) => {
                if (!error && result.length > 0) {
                    // Collecting the events_gallery_image data in an array
                    const eventImages = result.map(row => ({
                        id: row.id,
                        image_name: row.image_name,  // assuming the image column is 'image_url'
                        events_gallery_id: row.events_gallery_id,
                        image_caption: row.image_caption,
                        thumbnail: row.thumbnail,
                    }));

                    // You can now return the events_gallery data along with the images
                    const eventGallery = result[0]; // Assuming the first row has the gallery data
                    return res.send({
                        eventGallery,
                        images: eventImages
                    });
                } else {
                    console.log(error || "Event gallery not found");
                    return res.status(404).json({ message: "Event gallery not found." });
                }
            });
        } catch (error) {
            console.log(error);
        }
    },



    photo_gallery_update: async (req, res) => {
        try {
            const { formData, created_by, modified_by } = req.body;
            const fields = formData.fields;
            const galleryId = req.params.id;

            if (!formData || !fields || fields.length === 0 || !galleryId) {
                return res.status(400).json({ message: "Invalid input data" });
            }

            // Update events_gallery table
            const updateGalleryQuery = `
                UPDATE events_gallery 
                SET events_title = ?, title_url = ?, status = ?, events_category_id = ?, modified_by = ?
                WHERE id = ?
            `;

            const galleryValues = [
                formData.events_title,
                formData.title_url,
                formData.status,
                formData.events_category_id,
                formData.created_by,
                galleryId
            ];

            connection.query(updateGalleryQuery, galleryValues, (err, galleryResult) => {
                if (err) {
                    console.error("Error updating events_gallery:", err);
                    return res.status(500).json({ message: "Database error", error: err });
                }

                // Update existing images or insert new images
                const updateImageQuery = `
                    UPDATE events_gallery_image 
                    SET image_name = ?, modified_by = ?, image_caption = ?, thumbnail = ? 
                    WHERE id = ? AND events_gallery_id = ?
                `;
                const insertImageQuery = `
                    INSERT INTO events_gallery_image (events_gallery_id, image_name, image_caption, created_by, thumbnail)
                    VALUES ?
                `;

                const imageUpdatePromises = [];
                const newImageValues = [];

                fields.forEach(field => {
                    if (field.id) {
                        // Update existing image if 'id' is present
                        const imageUpdateValues = [
                            field.image_name,
                            formData.modified_by,
                            field.image_caption,
                            field.image_name,
                            field.id,
                            galleryId
                        ];
                        imageUpdatePromises.push(new Promise((resolve, reject) => {
                            connection.query(updateImageQuery, imageUpdateValues, (imgUpdateErr, imgUpdateResult) => {
                                if (imgUpdateErr) {
                                    reject(imgUpdateErr);
                                } else {
                                    resolve(imgUpdateResult);
                                }
                            });
                        }));
                    } else {
                        // Insert new image if 'id' is not present
                        newImageValues.push([galleryId, field.image_name, field.image_caption,created_by, field.image_name]);
                    }
                });

                // Insert new images if there are any
                if (newImageValues.length > 0) {
                    connection.query(insertImageQuery, [newImageValues], (insertErr, insertResult) => {
                        if (insertErr) {
                            console.error("Error inserting into events_gallery_image:", insertErr);
                            return res.status(500).json({ message: "Database error", error: insertErr });
                        }

                        // Wait for all update operations to finish
                        Promise.all(imageUpdatePromises)
                            .then(() => {
                                res.status(200).json({
                                    message: "Photo gallery updated successfully",
                                    events_gallery_id: galleryId,
                                    inserted_images: insertResult.affectedRows,
                                    updated_images: imageUpdatePromises.length
                                });
                            })
                            .catch((updateErr) => {
                                console.error("Error updating images:", updateErr);
                                res.status(500).json({ message: "Database error", error: updateErr });
                            });
                    });
                } else {
                    // Wait for all update operations to finish
                    Promise.all(imageUpdatePromises)
                        .then(() => {
                            res.status(200).json({
                                message: "Photo gallery updated successfully, no new images added",
                                events_gallery_id: galleryId,
                                updated_images: imageUpdatePromises.length
                            });
                        })
                        .catch((updateErr) => {
                            console.error("Error updating images:", updateErr);
                            res.status(500).json({ message: "Database error", error: updateErr });
                        });
                }
            });

        } catch (error) {
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "Error processing the request", error });
        }
    },




    events_gallery_delete: async (req, res) => {
        try {
            // First, delete related records from events_gallery_image
            const deleteImageQuery = "DELETE FROM events_gallery_image WHERE events_gallery_id = ?";
            connection.query(deleteImageQuery, [req.params.id], (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Failed to delete related images." });
                }

                // Now, delete the record from events_gallery
                const deleteGalleryQuery = "DELETE FROM events_gallery WHERE id = ?";
                connection.query(deleteGalleryQuery, [req.params.id], (error, result) => {
                    if (!error && result.affectedRows > 0) {
                        console.log(result);
                        return res.send(result);
                    } else {
                        console.log(error || "Event gallery not found");
                        return res.status(404).json({ message: "Event gallery not found." });
                    }
                });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "An error occurred while deleting." });
        }
    },

    events_gallery_image_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM events_gallery_image WHERE id = ?';
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
    events_gallery_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
  SELECT 
    events_gallery.*, 
    users_created.full_name AS created_by,
    users_modified.full_name AS modified_by,
    CASE 
        WHEN events_gallery.status = 1 THEN 'Active'
        WHEN events_gallery.status = 2 THEN 'Inactive'
        WHEN events_gallery.status = 3 THEN 'Pending'
        ELSE 'Unknown'
    END AS status_label
FROM events_gallery 
LEFT JOIN users AS users_created ON events_gallery.created_by = users_created.id 
LEFT JOIN users AS users_modified ON events_gallery.modified_by = users_modified.id 
ORDER BY events_gallery.id DESC
LIMIT ?, ?

`;

            connection.query(query, [skipRows, perPage], (error, result) => {
                console.log(result);
                if (!error) {
                    res.send(result);
                } else {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }
    },
    events_gallery_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { fromDate, toDate, title, status } = req.body;

            // Construct the base SQL query
            let sql = `
                      SELECT 
                events_gallery.*, 
                users_created.full_name AS created_by,
                users_modified.full_name AS modified_by,
                CASE 
                    WHEN events_gallery.status = 1 THEN 'Active'
                    WHEN events_gallery.status = 2 THEN 'Inactive'
                    WHEN events_gallery.status = 3 THEN 'Pending'
                    ELSE 'Unknown'
                END AS status_label
            FROM events_gallery 
            LEFT JOIN users AS users_created ON events_gallery.created_by = users_created.id 
            LEFT JOIN users AS users_modified ON events_gallery.modified_by = users_modified.id 
            WHERE 1
            `;


            if (fromDate && toDate) {
                sql += ` AND events_gallery.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }



            if (status) {
                sql += ` AND events_gallery.status LIKE '%${status}%'`;
            }
            // Add invoice ID condition

            if (title) {

                sql += ` AND LOWER(events_gallery.events_title) LIKE '%${title}%'`;
            }

            sql += ` ORDER BY events_gallery.id DESC`

            // Add expense name (item_name) search condition



            console.log("SQL Query:", sql);

            // Execute the constructed SQL query
            connection.query(sql, (error, results, fields) => {
                if (error) {
                    console.error("Error occurred during search:", error);
                    res.status(500).json({ error: "An error occurred during search." });
                } else {
                    console.log("Search results:", results);
                    res.status(200).json({ results });
                }
            });
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).json({ error: "An error occurred." });
        }
    },

    events_gallery_list_pdf: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize } = req.body;



            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';


                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.events_title}</td>`; // Person Name
                row += `<td>${result.title_url}</td>`; // Person Name
                row += `<td>${result.status_label}</td>`; // Person Name
                row += `<td>${result.created_by}</td>`; // Person Name

                row += `<td>${result.created_date.slice(0, 10)}</td>`; // Person Name


                row += '</tr>';
                tableRows += row;
            });

            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';

            const html = `<html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <style>
                         @page {
                            size: ${pageSize} ${pageOrientation}; /* This sets the page size to A4 and orientation to Portrait */
                            margin: 20mm; /* Adjust the margin as needed */
                        }
                        * { 
                            
                            font-family: 'Nikosh', sans-serif !important;
                        }
                        table {
                        font-size: ${fontSize || '12px'};
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
                        <h2 style="margin: 0; padding: 0;">Pathshala School & College Photo Gallery List</h2>
                        <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                        <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                        <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                        <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;"> Photo Gallery List</h3>
                    </div>
                    <div class="container2">
                        <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                        <p style="margin: 0; padding: 0;">Collected By:</p>
                        <p style="margin: 0; padding: 0;">Date: </p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                                                 <th>SL.</th>
                                                            <th>Event Title</th>
                                                            <th>Title Url</th>
                                                            <th>status</th>
                                                            <th>Created By</th>
                                                            <th>Created Date</th>
                       
                                                               
                                                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </body>
                </html>`;

            wkhtmltopdf(html, { pageSize: pageSize, orientation: pageOrientation }, (err, stream) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    res.status(500).send('Error generating PDF');
                    return;
                }
                stream.pipe(res);
            });
        } catch (error) {
            console.error('Error in expense_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },



    events_gallery_list_print: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.events_title}</td>`; // Person Name
                row += `<td>${result.title_url}</td>`; // Person Name
                row += `<td>${result.status_label}</td>`; // Person Name
                row += `<td>${result.created_by}</td>`; // Person Name

                row += `<td>${result.created_date.slice(0, 10)}</td>`; // Person Name


                // Add extra columns based on extraColumnValue
                for (let i = 1; i <= extraColumnValue; i++) {
                    row += `<td contenteditable="true">Extra Column ${i}</td>`; // Editable extra column
                }

                row += '</tr>';
                tableRows += row;
            });

            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';

            const html = `<html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <style>
                        @page {
                            size: ${pageSize} ${pageOrientation}; /* This sets the page size and orientation */
                            margin: 20mm; /* Adjust the margin as needed */
                        }
                        * { 
                            
                            font-family: 'Nikosh', sans-serif !important;
                        }
                        table {
                        font-size: ${fontSize || '12px'};
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
                        <h2 style="margin: 0; padding: 0;">Pathshala School & College Photo Gallery List</h2>
                        <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                        <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                        <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                        <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;"> Photo Gallery List</h3>
                    </div>
                    <div class="container2">
                        <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                        <p style="margin: 0; padding: 0;">Collected By:</p>
                        <p style="margin: 0; padding: 0;">Date: </p>
                    </div>
                    <table>
                        <thead>
                        
                                <tr>
                                                                  <th>SL.</th>
                                                            <th>Event Title</th>
                                                            <th>Title Url</th>
                                                            <th>status</th>
                                                            <th>Created By</th>
                                                            <th>Created Date</th>
                                      
    
                                
                     ${[...Array(extraColumnValue)].map((_, i) => `<th contenteditable="true">Extra Column ${i + 1}</th>`).join('')} <!-- Dynamically add headers -->
                               
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </body>
                <script>
                    window.print();
                </script>
                </html>`;

            res.send(html); // Send the HTML directly to the client
        } catch (error) {
            console.error('Error in office_visit_person_print:', error);
            res.status(500).send('Error generating print view');
        }
    },

};

module.exports = photoGalleryModel;
