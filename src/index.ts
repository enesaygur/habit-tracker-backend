import express from "express";
import homeRoutes from "./routes/homeRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/", homeRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
