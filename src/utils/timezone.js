const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
  localToUTC: (datetimeLocalStr, tz) => {
    return dayjs.tz(datetimeLocalStr, tz).utc().toDate();
  },
  utcToLocalString: (utcDate, tz) => {
    return dayjs(utcDate).tz(tz).format();
  },
};
