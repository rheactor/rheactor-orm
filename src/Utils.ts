const datetimePad = (value: number, length = 2) =>
  value.toString().padStart(length, "0");

/** Transform a Date instance into `YYYY-MM-DDThh:mm:ss.sZ` format. */
export const getDatetimeISO = (date: Date) => {
  return (
    `${date.getFullYear()}-` +
    `${datetimePad(date.getMonth() + 1)}-` +
    `${datetimePad(date.getDate())}T` +
    `${datetimePad(date.getHours())}:` +
    `${datetimePad(date.getMinutes())}:` +
    `${datetimePad(date.getSeconds())}.` +
    `${datetimePad(date.getMilliseconds(), 3)}Z`
  );
};
