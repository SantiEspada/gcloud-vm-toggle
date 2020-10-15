import { app } from '../lambda';

const PORT = 3000;

app.listen(3000, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
