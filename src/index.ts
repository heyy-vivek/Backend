import express from 'express';
import bodyParser from 'body-parser';
import submissionsRouter from './routes/submissions';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.get('/ping', (req, res) => {
    res.json(true);
});

app.use('/submissions', submissionsRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
