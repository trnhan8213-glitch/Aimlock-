// generate_module.js
const fs = require('fs');

const module = {
  name: "Fix Lag FreeFire",
  description: "Direct UDP & domain Garena, tối ưu DNS/TFO, tắt IPv6",
  author: "AI",
  general: {
    dns: "1.1.1.1, 8.8.8.8",
    tfo: true,
    skip_proxy: "192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12, 127.0.0.1",
    ipv6: false
  },
  rules: [
    "PORT,53,UDP,DIRECT",
    "PORT,27000-27036,UDP,DIRECT",
    "PORT,3478-3480,UDP,DIRECT",
    "PORT,10001,UDP,DIRECT",
    "PORT,10010,UDP,DIRECT",
    "PORT,20001-20050,UDP,DIRECT",
    "PORT,32000-33000,UDP,DIRECT",
    "PORT,52000-53000,UDP,DIRECT",
    "PORT,12000-65000,UDP,DIRECT",
    "DOMAIN-SUFFIX,garena.com,DIRECT",
    "DOMAIN-SUFFIX,garena.vn,DIRECT",
    "DOMAIN-SUFFIX,freefire.garena.com,DIRECT",
    "DOMAIN-SUFFIX,ff.garena.com,DIRECT",
    "DOMAIN-SUFFIX,ff.garena.vn,DIRECT",
    "DOMAIN-SUFFIX,cdn.garena.com,DIRECT",
    "DOMAIN-SUFFIX,cloud.garena.com,DIRECT",
    "DOMAIN-SUFFIX,match.garena.com,DIRECT",
    "DOMAIN-SUFFIX,push.garena.com,DIRECT",
    "DOMAIN-SUFFIX,gcloud.com,DIRECT"
  ]
};

fs.writeFileSync('FixLagFreeFire.module', JSON.stringify(module, null, 2));
console.log('Module đã tạo: FixLagFreeFire.module');
