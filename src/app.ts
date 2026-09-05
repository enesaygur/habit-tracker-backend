import express from "express";
import homeRoutes from "./routes/homeRoutes";
import authRoutes from "./routes/authRoutes";
import habitRoutes from "./routes/habitRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/habits", habitRoutes);

app.use(errorHandler);

export default app;
