import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import {Submission} from '../interface'

const router = Router();
const dbPath = path.resolve(__dirname, '../../db.json');

// Ensure the db.json file exists
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
}

// Defining routes
router.get('/search', (req, res) => {
    const email = req.query.email as string;
    const data: Submission[] = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    const foundSubmissions = data.filter((submission: Submission) => submission.email === email);

    if (foundSubmissions.length > 0) {
        res.status(200).json(foundSubmissions);
    } else {
        res.status(404).json({ message: 'No submissions found with this email.' });
    }
});

router.put('/update', (req, res) => {
    const index = parseInt(req.query.index as string, 10);
    const data: Submission[] = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    if (index >= 0 && index < data.length) {
        data[index] = req.body;
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
        res.status(200).json({ message: 'Submission updated successfully!' });
    } else {
        res.status(404).json({ message: 'Submission not found!' });
    }
});

router.delete('/delete', (req, res) => {
    const index = parseInt(req.query.index as string, 10);
    const data: Submission[] = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    if (index >= 0 && index < data.length) {
        data.splice(index, 1);
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
        res.status(200).json({ message: 'Submission deleted successfully!' });
    } else {
        res.status(404).json({ message: 'Submission not found!' });
    }
});

router.post('/submit', (req, res) => {
    const { name, email, phone, githublink, stopwatchtime } = req.body;
    const newSubmission: Submission = { name, email, phone, githublink, stopwatchtime };

    const data: Submission[] = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    data.push(newSubmission);
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.status(200).json({ message: 'Submission saved successfully!' });
});

router.get('/read', (req, res) => {
    const index = parseInt(req.query.index as string, 10);
    const data: Submission[] = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    if (isNaN(index)) {
        // If no valid index is provided, return all submissions
        res.status(200).json(data);
    } else if (index < 0 || index >= data.length) {
        // If the index is out of range, return an error message
        res.status(404).json({ message: 'Submission not found!' });
    } else {
        // If a valid index is provided, return the specific submission
        res.status(200).json(data[index]);
    }
});

export default router;
