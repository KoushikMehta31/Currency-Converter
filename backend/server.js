import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 
import axios from "axios";


dotenv.config(); 

const app = express();


app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/convert', async (req, res) => {
  const { base_currency, currencies } = req.query;

  console.log("🔁 Request received:", base_currency, currencies);
  console.log("🔑 API Key from env:", process.env.API_KEY); 

  if (!process.env.API_KEY) {
    return res.status(500).json({ message: "Missing API key in environment" });
  }

  try {
    const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.API_KEY}&base_currency=${base_currency}&currencies=${currencies}`;

    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
    res.status(500).json({
      message: "Error fetching data",
      error: error.response?.data || {},
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`✅ Backend server running on port ${PORT}`)
);


