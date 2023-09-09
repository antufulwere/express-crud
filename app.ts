import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(express.json());

// Sample data
const data = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  // Add more data as needed
];

// Routes
app.get('/items', (req: Request, res: Response) => {
  res.json(data);
});

app.get('/items/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const item = data.find(item => item.id === id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(item);
});

app.post('/items', (req: Request, res: Response) => {
  const newItem = req.body;
  data.push(newItem);
  res.status(201).json(newItem);
});

app.put('/items/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedItem = req.body;
  const index = data.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }
  data[index] = updatedItem;
  res.json(updatedItem);
});

app.delete('/items/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = data.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }
  data.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
