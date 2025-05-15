
const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Purple & Black App</title>
        <style>
          body {
            background-color: #1a1a1a;
            color: #e6e6e6;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #2d1a3a;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
          }
          h1 {
            color: #9333ea;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Your App</h1>
          <p>This is your new application with a purple and black theme!</p>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
