const cron = require("node-cron");
const fs = require("fs");


// Path where to save jobs data
const jobsPath = "./jobs.json";



exports.initCron = () => {
  console.log("started repport jobs schedular");
  // remouve duplicate job executions if existing
  cron.getTasks().forEach((t) => t.stop());

  // read jobs from local filesystem
  let jobsStr = fs.readFileSync(`./utils/cron/${jobsPath}`, {
    encoding: "utf8",
    flag: "r",
  });
  let jobs = JSON.parse(jobsStr);
  // schedule jobs
  if (jobs.length > 0) {
    jobs.forEach((job) => {
      if (cron.validate(job.freq)) {
        cron.schedule(job.freq, async () => {
        //   await generateAndMail(job);

        });
        console.log("job scheduled successfully", job.params.id);
      }
    });
  } else {
    console.log("no scheduled jobs");
  }
};
