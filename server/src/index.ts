import app from './app';
import connectDB from './config/db';

// Connect DB here if we want to avoid it in app.ts, 
// but app.ts usually needs DB for routes if we don't mock it completely.
// However, in the provided app.ts, I didn't verify if connectDB() is called. 
// Let's call connectDB here to be safe and remove it from app.ts if I put it there.
// Wait, I put logic in app.ts implicitly? 
// My previous write_to_file included imports.

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
