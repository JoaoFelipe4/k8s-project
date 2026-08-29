const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Hello from the Node.js Backend Service' });
});

app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cloud Infrastructure</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Arial, sans-serif;
                background-color: #121212;
                color: #e0e0e0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .container {
                background-color: #1e1e1e;
                padding: 50px;
                border-left: 8px solid #f26101;
                width: 600px;
                max-width: 90%;
            }
            h1 {
                font-size: 2.2em;
                margin: 0 0 15px 0;
                color: #ffffff;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            p {
                font-size: 1.1em;
                color: #a0a0a0;
                margin-bottom: 40px;
                line-height: 1.5;
            }
            .stack {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 40px;
            }
            .badge {
                background-color: #f26101;
                color: #ffffff;
                padding: 8px 12px;
                font-size: 0.85em;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .status-box {
                background-color: #121212;
                border: 1px solid #333;
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .indicator {
                width: 12px;
                height: 12px;
                background-color: #00d26a;
            }
            .status-text {
                font-family: 'Courier New', Courier, monospace;
                font-weight: bold;
                font-size: 0.9em;
                color: #00d26a;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Platform Overview</h1>
            <p>Infrastructure as Code is fully deployed. The routing, compute, and delivery layers are running in standard configuration.</p>
            <div class="stack">
                <span class="badge">AWS EKS</span>
                <span class="badge">Terraform</span>
                <span class="badge">ArgoCD</span>
                <span class="badge">GitHub Actions</span>
            </div>
            <div class="status-box">
                <div class="indicator"></div>
                <span class="status-text">SYSTEMS OPERATIONAL</span>
            </div>
        </div>
    </body>
    </html>
  `;
  res.status(200).send(html);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
