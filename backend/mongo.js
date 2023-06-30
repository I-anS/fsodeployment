const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}
// process.argv accesses arguments provided in the command line, in the format node mongo.js <password> <Name> <Number>
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

// Name affter the mongodb.net/ determines the database name
const url = `mongodb+srv://fullstack:${password}@cluster0.gx8c0vx.mongodb.net/personApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// This determines the collection name, which is made plural automatically
// DatabaseName.connectioName === noteApp.notes
const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: name,
  number: number,
});

person.save().then((result) => {
  console.log(result);
  console.log(`added ${result.name} number ${result.number} to phonebook`);
  mongoose.connection.close();
});

// Person.find({}).then((result) => {
//   result.forEach((person) => {
//     console.log(person);
//   });
//   mongoose.connection.close();
// });

// You can toggle between whether to add or find people in the database, by specifying another argument in the command line interface. E.g by using CMD node mongo.js add <password> ..., we can access the command type using process.argv[2], which has a value of add in this case
// Depending on the value of argv[2] (e.g add, find), we can then run different commands using an if statement. See Below.

// if (command === "save") {
//     if (process.argv.length < 6) {
//       console.log("Usage: node mongo.js save <password> <name> <number>");
//       mongoose.connection.close();
//       process.exit(1);
//     }

//     const name = process.argv[4];
//     const number = process.argv[5];

//     const person = new Person({
//       name: name,
//       number: number,
//     });

//     person.save().then((result) => {
//       console.log(`Added ${result.name} number ${result.number} to phonebook`);
//       mongoose.connection.close();
//     });
//   } else if (command === "find") {
//     Person.find({}).then((result) => {
//       result.forEach((person) => {
//         console.log(person);
//       });
//       mongoose.connection.close();
//     });
//   } else {
//     console.log("Unknown command. Available commands: save, find");
//     mongoose.connection.close();
//     process.exit(1);
//   }
