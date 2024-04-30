// This file exports a reportJobsWatcher()
// that watches for jobs updates in
// ["root"/utils/cron/jobs.json] and schedual jobs

const chokidar = require("chokidar");
const { initCron } = require("../cron/schedular.js");

// Path where jobs data are saved
const LOCAL_JOBS_PATH = "./utils/cron/jobs.json";

// init file watcher
const watcher = chokidar.watch(LOCAL_JOBS_PATH);

exports.reportJobsWatcher = () => {
  console.log("watcher started");
  watcher.on("change", (path) => {
    // schedule jobs
    initCron();
  });
  watcher.on("error", (err) => {
    console.log("watcher err", err);
  });
};
