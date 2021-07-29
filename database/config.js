const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGI_URI, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", function () {
    console.log("Connected");
  })
  .on("error", function (error) {
    console.log(error);
  });
