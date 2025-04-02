export const template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="Mobile-friendly page with centered button">
      <meta name="theme-color" content="#4285f4">
      <title>Honk</title>

      <style>
          /* Reset and base styles */
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }

          body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f8f8f8;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 20px;
          }

          /* Container for content */
          .container {
              width: 100%;
              max-width: 600px;
              text-align: center;
          }

          /* Button styling */
          button {
              display: block;
              width: 80%;
              max-width: 300px;
              margin: 30px auto;
              padding: 16px 24px;
              font-size: 1.2rem;
              font-weight: bold;
              color: white;
              background-color: #4285f4;
              border: none;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              cursor: pointer;
              transition: all 0.3s ease;
          }

          button:hover {
              background-color: #3367d6;
              transform: translateY(-2px);
              box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
          }

          button:active {
              transform: translateY(0);
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          /* Media queries for responsiveness */
          @media (max-width: 480px) {
              .main-button {
                  width: 90%;
                  font-size: 1.1rem;
                  padding: 14px 20px;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <button id="click">Honk</button>

          <audio id="gooseSound" src="/honk.mp3" preload="auto"></audio>
      </div>

      <script>
        let ws

        async function websocket(url) {
          ws = new WebSocket(url)

          if (!ws) {
            throw new Error("server didn't accept ws")
          }

          ws.addEventListener("open", () => {
            console.log('Opened websocket')
          })

          ws.addEventListener("message", ({ data }) => {
            if (data === 'play'){
              setTimeout(() => {
                document.getElementById('gooseSound').play();
              }, Math.floor(Math.random() * 101));
            }
          })

          ws.addEventListener("close", () => {
            console.log('Closed websocket')

            const list = document.querySelector("#events")
            list.innerText = ""
          })
        }

        const url = new URL(window.location)
        url.protocol = "wss" // wss
        url.pathname = "/ws"
        websocket(url)

        document.querySelector("#click").addEventListener("click", () => {
        console.log('clicked');
          ws.send("play")
        })

        const closeConnection = () => ws.close()
      </script>
  </body>
  </html>


`;
