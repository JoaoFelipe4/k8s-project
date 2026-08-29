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
                padding: 40px;
                background-color: #000000;
                color: #d0d0d0;
                font-family: 'Courier New', Courier, monospace;
            }
            .terminal-box {
                border: 2px solid #f26101;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #0a0a0a;
            }
            .header-bar {
                border-bottom: 2px dashed #f26101;
                padding-bottom: 10px;
                margin-bottom: 20px;
                color: #f26101;
                font-size: 1.5em;
                font-weight: bold;
                text-transform: uppercase;
            }
            .log-line {
                margin-bottom: 15px;
                line-height: 1.6;
                font-size: 1em;
            }
            .label {
                color: #f26101;
                font-weight: bold;
            }
            .stack-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin: 20px 0;
                padding: 15px;
                border: 1px solid #333333;
            }
            .stack-item {
                padding: 5px;
                border-left: 4px solid #f26101;
                background-color: #111111;
            }
            .status-footer {
                margin-top: 30px;
                padding: 10px;
                background-color: #f26101;
                color: #000000;
                font-weight: bold;
                text-align: center;
                animation: blinker 2s linear infinite;
            }
            @keyframes blinker {
                50% { opacity: 0.8; }
            }
        </style>
    </head>
    <body>
        <div class="terminal-box">
            <div class="header-bar">
                [ INIT ] PLATFORM_OVERVIEW_V1.0
            </div>
            
            <div class="log-line">
                <span class="label">>> STATUS:</span> INFRASTRUCTURE_AS_CODE DEPLOYED
            </div>
            <div class="log-line">
                <span class="label">>> ROUTING:</span> AWS APPLICATION LOAD BALANCER ACTIVE
            </div>
            <div class="log-line">
                <span class="label">>> COMPUTE:</span> EKS CLUSTER RESPONDING
            </div>

            <div class="stack-grid">
                <div class="stack-item">MODULE: AWS EKS 1.35</div>
                <div class="stack-item">MODULE: TERRAFORM</div>
                <div class="stack-item">MODULE: ARGOCD</div>
                <div class="stack-item">MODULE: GITHUB ACTIONS</div>
            </div>

            <div class="status-footer">
                [OK] ALL SYSTEMS OPERATIONAL
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
