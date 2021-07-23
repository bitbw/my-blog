---
title: sqlite的使用注意事项
date: 2021-04-22 17:30:03
tags:
	- SQL
	- sqlite
categories: SQL
---







## 关于执行sql时单双引号的问题

执行多个插入信息时发现到某条会出现报错：

```bash
 Error: SQLITE_ERROR: near "s": syntax error
```

js代码

```js
   sql = `INSERT INTO 't_def_component_independentService' 
      (PNCode, FCCode, nameCHN, nameENG, descriptionCHN, descriptionENG, specialTips, picture, icon, type, subType, serverModel, serverName, serverPN, serverCategory, AnnounceDate, GeneralAvailableDate, WDAnnounceDate, WithdrawDate, comment, CfgRule, disable, priority, inventory, inventoryClean, version, status) VALUES ('${PNCode}', '${FCCode}', '${nameCHN}', '${nameENG}','${descriptionCHN}' ,'${descriptionENG}', '${specialTips}', '', '', 'SERVICE_COMPONENT', 'SERVICE', 'SERV-IPS', 'SERVICE', 'FUM-SERVICE-0000', 'IPS service product', '2020/4/30', '2020/7/10', '2050/1/1', '2050/1/1', NULL, NULL, '0', '0', '100', '1', '1', '0');`;
```

生成的sql 

```sql
INSERT INTO 't_def_component_independentService'       (PNCode, FCCode, nameCHN, nameENG, descriptionCHN, descriptionENG, specialTips, picture, icon, type, subType, serverModel, serverName, serverPN, serverCategory, AnnounceDate, GeneralAvailableDate, WDAnnounceDate, WithdrawDate, comment, CfgRule, disable, priority, inventory, inventoryClean, version, status)       VALUES ('FUB-SERVICE-SLA1', 'SLA1', '人员SLA服务(3/6h到场) （年）', '中文。。。' , '... user's site according to Party A's requirements and actual situation
1) In 22 cities including Beijing, Shanghai, Guangzhou, Shenyang, Harbin, Xi'an, ....;', '价格计算方式为“服务器硬件价格*系数”', '', '', 'SERVICE_COMPONENT', 'SERVICE', 'SERV-IPS', 'SERVICE', 'FUM-SERVICE-0000', 'IPS service product', '2020/4/30', '2020/7/10', '2050/1/1', '2050/1/1', NULL, NULL, '0', '0', '100', '1', '1', '0');

```

可以直接发现 有段描述

`'... user's site according to Party A's requirements and actual situation
1) In 22 cities including Beijing, Shanghai, Guangzhou, Shenyang, Harbin, Xi'an, ....;'`

因为是英文 所以内容中出现了`' `单引号 导致语句被截断，造成sql语句错误

### 解决

改js代码中字符串的拼接 ，将容易出现单引号的字段内容用双引号包住

```js
'${descriptionENG}'
//修改为
"${descriptionENG}"
```

