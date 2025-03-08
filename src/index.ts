import { error } from 'console';
import app from './app';
import { sequelize } from './models';

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: unknown)  => {
    console.error("Failed to sync database:", err);
  });
