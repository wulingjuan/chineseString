const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function showDateTime(time){
  //获取当前的日期时间函数,格式为“yyyy-MM-dd hh:mm:ss”
    var date = null;
    if(time == null){
      date = new Date();
    }else{
      date = new Date(time*1000);
    }
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    var strDate = date.getDate();
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var hour = date.getHours();
    if (hour >= 0 && hour <= 9) {
      hour = "0" + hour;
    }
    var minute = date.getMinutes();
    if (minute >= 0 && minute <= 9) {
      minute = "0" + minute;
    }
    var sec = date.getSeconds();
    if (sec >= 0 && sec <= 9) {
      sec = "0" + sec;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1
      + strDate + " " + hour + seperator2 + minute
      + seperator2 + sec;
    return currentdate;
}
module.exports = {
  formatTime: formatTime,
  showDateTime:showDateTime
}
