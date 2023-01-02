const JSEncrypt = require("JS")

function isAuthenticated() {
  
}

import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'
// 密钥对生成 http://web.chacuo.net/netrsakeypair; 把下面生成的公钥、私钥换成自己生成的即可
const publicKey = ''; //生成的公钥
const privateKey='';

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}
