const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);
//Defining AutoIncrument that comes from mongoose-sequence package(line 3)//

const CarSchema = new Schema(
  {
    make: {
      type: String,
      required: true,
    },
    model: {
      type: Number,
      required: true,
    },
    registration: {
      type: String,
      required: true,
    },
  },
  {
    //By setting the timestamps option(line 45), we'll recieve both the createdAt and updatedAt dates from mongoDB//
    timestamps: true,
  }
);

CarSchema.plugin(AutoIncrement, {
  //The inc_field: "ticket"(line 49) will create a ticket inside the carSchema//
  inc_field: "ticket",
  id: "ticketNums",
  //Telling the Schema the number that the ticket sequence should start at(line 52)//
  start_seq: 500,
});

module.exports = mongoose.model("Cars", CarSchema);
