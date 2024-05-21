import app from "./index.js";
import { connectToDB } from "./config/mongo.js";

const port = 3200;

app.listen(port, async () => {
  console.log(`Server is listening at port ${port}`);
  await connectToDB();
});
