// 处理话术中的变量
const processTemplate = (text) => {
  let pattern = /\{([^}]+)\}/g;
  let newSentence = text.replace(pattern, (match, content) => {
    if (content === 'time') {
      return setTimeParseTime()
    }
    let options = content.split('|');
    let randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  });
  return newSentence
}

// 处理直播间用户的用户名，删除特殊字符、表情符号
const processUsername = (username) => {
  let result = '';
  if (username.indexOf('*') > -1) {
    return ''
  }
  for (let i = 0; i < username.length; i++) {
    let charCode = username.charCodeAt(i);
    if ((charCode >= 0x4e00 && charCode <= 0x9fff) || (charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
      result += username[i];
    }
  }
  return result;
}

// 格式化时间为直播友好格式
const setTimeParseTime = () => { 
  const date = new Date()
  let hour = date.getHours()
  const minute = date.getMinutes()
  let hour_str = ''
  if (hour < 6) {
    hour_str = '凌晨';
  } else if (hour === 12) {
    hour_str = '中午';
  } else if (hour > 12 && hour < 18) {
    hour_str = '下午';
    hour = hour - 12
    if (hour == 2) {
      hour = '两'
    }
  } else if (hour >= 18) {
    hour_str = '晚上';
    hour = hour - 12
  } else {
    hour_str = '早上';
  }
  // console.log(minute)
  let minute_str = ''
  if (minute < 10) {
    minute_str = '零' + minute
  } else {
    minute_str = minute
  }
  return `现在是${hour_str}${hour}点${minute_str}分 `
}


function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// const products = [
//   { serial_number: "1", probability: 1 }
// ]

// 根据概率权重随机选择产品
function getRandomByProbability(numbers) {
  // 生成0到1之间的随机数
  const random = Math.random();
  let sum = 0;

  // 遍历产品列表，根据概率累加
  for (const number of numbers) {
    sum += number.probability;
    // 如果随机数小于累加概率，则选择当前产品
    if (random < sum) {
      return number.serial_number
    }
  }
  // 默认返回最后一个产品（理论上不会执行到这里，除非概率总和小于1）
  return numbers[numbers.length - 1].serial_number;
}

// 我有一堆数字，并给他们设置概率，我需要根据概率来随机选择一个数字,我想传递的参数是类似：[{ index: "1", probability: 1 }],这样的
function getRandomProductByProbability(numbers) {
  let sum = 0;
  for (const number of numbers) {
    sum += number.probability;
  }
  const random = Math.random() * sum;
  let cumulativeProbability = 0;
  for (const number of numbers) {
    cumulativeProbability += number.probability;
    if (random <= cumulativeProbability) {
      return number.serial_number;
    }
  }
  return numbers[numbers.length - 1].serial_number;
}


export {
  processTemplate,
  processUsername,
  setTimeParseTime,
  getRandomItem,
  getRandomInt,
  getRandomProductByProbability,
  getRandomByProbability
}