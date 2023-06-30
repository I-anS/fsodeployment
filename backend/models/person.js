const mongoose = require("mongoose");

// Name affter the mongodb.net/ determines the database name
// const url = `mongodb+srv://fullstack:Unlocknow123*@cluster0.gx8c0vx.mongodb.net/personApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (enteredPhoneNo) => {
        const regex = /^\d{2,3}-\d+$/;
        return regex.test(enteredPhoneNo);
      },
      message:
        "Invalid phone number format. The correct format is XX-XXXXXXXX.",
    },
  },
});

personSchema.set("toJson", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// This determines the collection name, which is made plural automatically
// DatabaseName.connectioName === noteApp.notes
module.exports = mongoose.model("Person", personSchema);
