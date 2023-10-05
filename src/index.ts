import express, {Express} from 'express';
import cors from 'cors';
import expressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import morgan from 'morgan';
import auth from './routes/auth.js';
import slots from './routes/slots.js';
import connectToDB from './helpers/db.js';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'))
app.use(expressMongoSanitize());

connectToDB();

app.use("/auth", auth)
app.use("/slots", slots)

app.listen(3005, () => {
    console.log("Server started at port 3005");
});

export default app;