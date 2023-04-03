const bcrypt = require("bcrypt");

function CalculateIdealCost() {
  let saltRounds = 11;

  var startTime = performance.now();
  let hashedPassword = bcrypt
    .hash("microbenchmark", saltRounds)
    .then((result) => {
      var endTime = performance.now();
      const durationMS = endTime - startTime;
      console.log([result, durationMS]);
    });
}

CalculateIdealCost();
