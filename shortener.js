const alphabet = "aAbBcCdDeEfFgGhHiIjJkKmMnNoOpPqQrRsStTuUvVwWxXyYzZ"

const encodeUrl = (idNum) => {
  let newNum = ("" + idNum[0]).split("")
  var encoded = [];
  for (let i = 0; i < newNum.length; i++) {
    encoded.push(alphabet[newNum[i]].toString());
  }
  return encoded.join("");
}

module.exports = encodeUrl
