import mongoose from "mongoose";

let isConnected: boolean = false;
// isDBConnected

export const connectToDatabase = async () => {
  // making the connection here

  mongoose.set("strictQuery", true);
  // By doing this, we make sure we do not want any unwanted field querries and it makes our development easier

  // Next we go connect to our mongodb atlas database

  // After following all steps and making connections, check if we have the connection url in our .env.local
  if (!process.env.MONGODB_URL) {
    return console.log("Missing Mongo DB connection URL");
  }

  // Next check if the connection is already been established or not (see the bool variable above)
  if (isConnected) {
    return console.log("Mongo DB is already connected");
  }

  // If not already connected, open up a try-catch block and connect it there
  // To do that install mongoose and mongo db i.e. "npm install mongoose mongodb"
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      // passing some options
      // first checking if we have an existing database https://cloud.mongodb.com/v2/6647c69b0cf72650c25883ac#/metrics/replicaSet/6647c703b7716d303b08f4f9/explorer
      // Database > Click Cluster0 > Go to Collections (on menu bar below Cluster0)

      // Now we create a database
      dbName: "DevFlow",
    });

    isConnected = true;
    console.log("Mongo DB is connected");
  } catch (error) {
    console.log("Mongo DB connection failed", error);
  }
};
// now go to lib > actions > question.action.ts to connect to the database
