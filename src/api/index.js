import jsonp from 'jsonp';
import ajax from "./ajax";

// 区分开发环境和生产环境
const prefix =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "http://localhost:5000";

// 区分开发环境和生产环境
export const reqLogin = (username, password) =>
  ajax(prefix + "/login", { username, password }, "POST");

//请求天气函数
export const reqWeather = city => {
  return new Promise((resolve, reject) => {
    jsonp(
      `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,
      (err, data) => {
        if (!err) {
          const {dayPictureUrl,weather} = data.results[0].weather_data[0];
          resolve({weather, weatherImg: dayPictureUrl})
        }else{
          reject('网络不稳定,请刷新重试')
        }
      }
    );
  });
};
