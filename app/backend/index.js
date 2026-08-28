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
        <title>Cloud-Native Platform</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
                color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                text-align: center;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 40px 60px;
                border-radius: 12px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                border: 1px solid rgba(255, 255, 255, 0.18);
            }
            h1 {
                font-size: 2.5em;
                margin-bottom: 10px;
                letter-spacing: 2px;
            }
            p {
                font-size: 1.2em;
                color: #b8c6db;
                margin-bottom: 30px;
            }
            .stack {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-bottom: 30px;
            }
            .badge {
                background: rgba(255, 255, 255, 0.2);
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 0.9em;
                font-weight: bold;
            }
            .status {
                display: inline-block;
                background: #00b09b;
                background: linear-gradient(to right, #00b09b, #96c93d);
                padding: 10px 20px;
                border-radius: 30px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
                box-shadow: 0 4px 15px rgba(0, 176, 155, 0.4);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Cloud-Native Architecture</h1>
            <p>Fully automated, resilient, and declarative infrastructure.</p>
            <div class="stack">
                <span class="badge">AWS EKS 1.35</span>
                <span class="badge">Terraform (IaC)</span>
                <span class="badge">GitOps (ArgoCD)</span>
                <span class="badge">GitHub Actions</span>
            </div>
            <div class="status">● All Systems Operational</div>
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
