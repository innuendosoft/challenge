import express, { json } from 'express';

const app = express();

//Routes
import CSVRoutes from './routes/upload-csv.routes';

//Settings
app.set('port', process.env.PORT || 3000);

// app.use(IndexRoutes);
app.use('/upload-csv', CSVRoutes);

export default app;