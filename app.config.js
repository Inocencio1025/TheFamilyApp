// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: "YourAppName",
    slug: "your-app-slug",
    version: "1.0.0",
    extra: {
      TMDB_API_KEY: process.env.TMDB_API_KEY,
    },
    // ... keep your existing config options
  },
};
