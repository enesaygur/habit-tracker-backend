import { errorHandler } from "./middleware/errorHandler";
import express from "express";
import homeRoutes from "./routes/homeRoutes";
import authRoutes from "./routes/authRoutes";
import habitRoutes from "./routes/habitRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/habits", habitRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
