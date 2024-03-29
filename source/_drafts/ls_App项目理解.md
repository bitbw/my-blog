## 参考文档

[electron 官方文档](https://www.electronjs.org/zh/docs/latest/tutorial/quick-start)
[electron的使用](https://juejin.cn/post/6844904159104204814)

[electron-builder](https://www.electron.build/)
[electron-builder自动更新插件文档](https://www.electron.build/auto-update)

[vue-cli-plugin-electron-builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html#table-of-contents)

[sqliste3-API]( https://github.com/mapbox/node-sqlite3/wiki/API)
[@journeyapps/sqlcipher加密版sqliste3](https://github.com/journeyapps/node-sqlcipher)

## 项目启动

### 启动流程

#### 主进程

src\main\index.js 主进程启动 ->  new BrowserWindow 创建浏览器窗口(渲染进程启动)

#### 渲染进程

src\renderer\index.js 渲染进程启动 -> 检查更新 CheckAndUpdate -> new Vue( App.vue)

->加载 bootstrap.js (sysDB 更新和 app 更新->获取本地存储数据 ->获取数据库数据)

#### bootstrap.js

```js
export default async function Initializer() {
  //////////////////////////////////////////////////////////////////////////////
  // sysDB 更新和 app 更新
  //////////////////////////////////////////////////////////////////////////////
  if (isProd) {
    //  sysDB 更新
    await store.dispatch(`update/checkSysDBUpdate`);
    //  app 更新
    store.dispatch(`update/checkAppUpdate`);
  } else {
    store.dispatch("globality/loadLocalSysDBVersion");
    // TODO 开发时测试更新
    //  sysDB 更新
    await store.dispatch(`update/checkSysDBUpdate`);
    //  app 更新
    store.dispatch(`update/checkAppUpdate`);
  }
  //////////////////////////////////////////////////////////////////////////////
  // 获取本地存储数据
  //////////////////////////////////////////////////////////////////////////////
  // 主题
  store.commit(`globality/${THEME}`, storage.get(THEME, "light"));
  // 主题色
  store.commit(`globality/${THEME_COLOR}`, storage.get(THEME_COLOR, null));
  // 用户登录信息
  store.commit(`user/${LOGIN_INFO}`, storage.get(LOGIN_INFO, null));
  // 用户登录时间
  store.commit(`user/${LOGIN_TIMESTAMP}`, storage.get(LOGIN_TIMESTAMP, null));
  // 用户是否自动上传
  store.commit(`cloudSync/${IS_AUTOUPLOAD}`, storage.get(IS_AUTOUPLOAD, true));
  // 用户供应链订单查询历史
  store.commit(
    `supply/${CONFIG_QUERY_HISTORY}`,
    storage.get(CONFIG_QUERY_HISTORY, null)
  );
  // 获取用户信息
  store.commit(`user/${USER_INFO}`, session.get(USER_INFO, null));
  store.commit(`user/${ACCESS_TOKEN}`, session.get(ACCESS_TOKEN, null));
  store.commit(`user/${PERMISSIONS}`, session.get(PERMISSIONS, null));
  store.commit(`user/${LAST_USER_ID}`, session.get(LAST_USER_ID, null));

  //////////////////////////////////////////////////////////////////////////////
  // 获取数据库数据
  //////////////////////////////////////////////////////////////////////////////
  // 获取用户设置
  store.dispatch(`globality/LoadingSettings`);
  // 获取所有机型
  store.dispatch(`configurator/LoadingProducts`);
  // 获取人员 （模拟数据暂时没用）
  store.dispatch(`basic/LoadingPersons`);
  // 获取客户（模拟数据暂时没用）
  store.dispatch(`basic/LoadingCustomer`);
  // 获取用户方案
  await store.dispatch(`solution/LoadingSolutions`);
  // 自动登录 等待获取用户方案后再登录
  await store.dispatch("user/autoLogin");
}

```

## 获取数据库数据

### this.LoadingSettings()

以上方法定义在 vuex中

src\plugins\store\global.js

```js
  LoadingSettings: ({ dispatch, commit }) => {
    commit('startLoadSettings')
    delay.run(api.setting.getAll())
      .then(res => commit('updateSettings', res))
      .catch(error => dispatch('SendError', error, { root: true }))
      .finally(() => commit('finishLoadSettings'))
  },
```

api.setting在src\api\global\setting.js中

```js
import { userDB } from '../index'

export default {
  getAll: () => userDB.table('t_local_setting').findAll(),
  post: (obj) => userDB.table('t_local_setting').insert(obj),
  put: (obj) => userDB.table('t_local_setting').update(obj),
}
```

返回 t_local_setting

![image-20200923114843141](https://bitbw.top/public/img/my_gallery/image-20200923114843141.png)

### this.LoadingPersons()

以上方法定义在 vuex中

src\plugins\store\public.js

```js
 LoadingPersons: ({ dispatch, commit }) => {
    commit('startLoadPersons')
    delay.run(api.person.getAll())
      .then(res => commit('updatePersons', res))
      .catch(error => dispatch('SendError', error, { root: true }))
      .finally(() => commit('finishLoadPersons'))
  }
```

api.person  在 src\api\public\person.js 目前是写死的  数据库中没数据

```js
 getAll: () => {
    // return userDB.table('t_person_info').findAll()
    return [
      { "id": 1, "personID": "1", "nameCHN": "销售小明", "nameENG": "xiaoming", "type": "sales", "status": 0 },
      { "id": 2, "personID": "2", "nameCHN": "销售小红", "nameENG": "xiaohong", "type": "sales", "status": 0 },
      { "id": 3, "personID": "3", "nameCHN": "技术小李", "nameENG": "xiaoli", "type": "technical", "status": 0 },
      { "id": 4, "personID": "4", "nameCHN": "技术小李", "nameENG": "xiaowang", "type": "technical", "status": 0 }
    ]
  }
```

### this.LoadingCustomer()

src\plugins\store\public.js

```js
  LoadingCustomer: ({ dispatch, commit }) => {
    commit('startLoadCustomer')
    delay.run(api.customer.getAll())
      .then(res => commit('updateCustomer', res))
      .catch(error => dispatch('SendError', error, { root: true }))
      .finally(() => commit('finishLoadCustomer'))
  },
```

 api.customer 在 src\api\public\customer.js 目前也是写死的 数据库中没数据

```js
  getAll: () => {
    // return userDB.table('t_customer_info').findAll()
    return [
      { "id": 1, "customerID": "1", "crmID": "1", "nameCHN": "移动", "nameENG": "CMCC", "status": 0 },
      { "id": 2, "customerID": "2", "crmID": "2", "nameCHN": "联通", "nameENG": "UNICOM", "status": 0 },
      { "id": 3, "customerID": "3", "crmID": "3", "nameCHN": "工行", "nameENG": "ICBC", "status": 0 },
      { "id": 4, "customerID": "4", "crmID": "4", "nameCHN": "农行", "nameENG": "ABC", "status": 0 }
    ]
  }
```

### this.LoadingProducts()

以上方法定义在 vuex中

@\plugins\store\configurator.js

```js
 LoadingProducts: ({ dispatch, commit }) => {
    dispatch('ClearProduct')
    commit('startLoadProducts')
    delay.run(api.product.getAll())
      .then(res => commit('updateProducts', res))
      .catch(error => dispatch('SendError', error, { root: true }))
      .finally(() => commit('finishLoadProducts'))
  },
```

api.product  核心定义在@/api/configurator/engine.js   （api的index.js 是挂载所有数据库的核心 @/util/db的DB在这里实例化）

```js
const configuratorEngine = NewConfigurator({
  // :TODO
  sysDBPath: sysDBPath,
  userDBPath: userDBPath,
  secret: secret,
  loglevel: dev ? 'info' : 'error'
})

export default configuratorEngine

```

engine.js  的核心方法NewConfigurator定义在@/util/configurator/index.js中

```js
// Configurator类中的
  async GetProducts() {
    return await this._API.sysDB
      .table('t_def_product_info')
      .where('status=0')
      .findAll();
 }
```

返回数据库内容

![image-20200923101955880](https://bitbw.top/public/img/my_gallery/image-20200923101955880.png)

放到vux的products中

## 数据库相关

### 各个表的含义

#### sys库

| 表名                          | 说明                                                       |
| ----------------------------- | ---------------------------------------------------------- |
| t_def_a6p_info                | A6P数据                                                    |
| t_def_component_CPU           | CPU数据                                                    |
| t_def_component_card          | IO卡数据                                                   |
| t_def_component_disk          | 硬盘数据                                                   |
| t_def_component_enclosure     | 硬盘扩展柜数据                                             |
| t_def_component_enclosuremode | 硬盘扩展柜Mode类型                                         |
| t_def_component_fomodule      | IO扩展柜的FOModule类型                                     |
| t_def_component_iodrawer      | IO扩展柜                                                   |
| t_def_component_listprice     | 所有的部件的价格都在找个表中 通过productsave类进行刷新价格 |
| t_def_component_memory        | 内存                                                       |
| t_def_component_motherboard   | 背板                                                       |
| t_def_component_peripheral    | 外设部件                                                   |
| t_def_component_power         | 电源                                                       |
| t_def_hpo_info                | 预装软件                                                   |
| t_def_product_info            | 机型                                                       |
| t_def_software_info           | 软件包括OS SW                                              |
| t_def_swma_info               | 维保                                                       |
| t_template_info               | 模板信息                                                   |
| t_template_component          | 模板对应的组件部分                                         |
| t_version_info                | 版本信息                                                   |

#### user库

| 表名                  | 说明                             |
| --------------------- | -------------------------------- |
| t_schema_info         | 方案列表                         |
| t_schema_product_list | 方案和产品信息的关联表           |
| t_config_info         | 产品信息表                       |
| t_config_component    | 产品对应组件部分                 |
| t_config_component    | 产品对应组件部分                 |
| t_local_setting       | 本地信息用于对比的app版本号      |
| t_template_info       | 模板信息（现在没用上）           |
| t_template_component  | 模板对应的组件部分（现在没用上） |

方案信息储存在 t_schema_info 用于这里的展示和导出    用于联查产品信息的表的id是`schemaID`

![image-20200928163103055](C:\Users\WX03\Desktop\张博文_文档_20221014\iConfig张博文记录文档\项目理解\image-20200928163103055.png)

t_schema_info 使用 jion   联查 t_schema_product_list   利用`t_schema_info.schemaID = t_schema_product_list.schemaID`

t_schema_product_list    联查  t_config_info   利用  t_schema_product_list.configID = t_config_info.configID  再去找对应的id

```sql
 SELECT *, t_schema_product_list.id FROM t_schema_product_list JOIN t_schema_info ON t_schema_info.schemaID = t_schema_product_list.schemaID JOIN t_config_info ON t_schema_product_list.configID = t_config_info.configID WHERE t_schema_info.schemaID="2bddfed9-df64-4810-866a-049da45861da
```

t_schema_product_list    是中间的跳板 放着schemaID  和 configID  一 一对应

t_config_info  存放着对应configID 基本产品信息  ，而具体的配置信息在t_config_component表中

![image-20200928164251136](https://bitbw.top/public/img/my_gallery/image-20200928164251136.png)

t_config_component 表中存着所有的配置信息，用于改配和导出  ， 通过configID关联t_config_info 表

## 数据库对象

原始数据库对象通过database获取的 挂载在DB对象的connections 的connection下

![image-20200923160153652](C:\Users\WX03\Desktop\张博文_文档_20221014\iConfig张博文记录文档\项目理解\image-20200923160153652-1608010286920-1608010446156.png)

```js
{
  "open": true,
  "filename": "C:\\Users\\WX03\\iConfig\\iconfig_sys.config",
  "mode": 2
   //原型方法
    {
        addListener: ƒ (type)
        all: ƒ ()
        backup: ƒ ()
        close: ƒ () //关闭连接
        configure: ƒ configure()
        each: ƒ ()
        emit: ƒ emit(type, ...args)
        eventNames: ƒ eventNames()
        exec: ƒ ()
        get: ƒ ()
        getMaxListeners: ƒ getMaxListeners()
        interrupt: ƒ interrupt()
        listenerCount: ƒ listenerCount(type)
        listeners: ƒ listeners(type)
        loadExtension: ƒ loadExtension()
        map: ƒ ()
        off: ƒ removeListener(type, listener)
        on: ƒ (type)
        once: ƒ once(type, listener)
        parallelize: ƒ parallelize()
        prepare: ƒ ()
        prependListener: ƒ prependListener(type, listener)
        prependOnceListener: ƒ prependOnceListener(type, listener)
        rawListeners: ƒ rawListeners(type)
        removeAllListeners: ƒ (type)
        removeListener: ƒ (type)
        run: ƒ ()
        serialize: ƒ serialize()
        setMaxListeners: ƒ setMaxListeners(n)
        wait: ƒ wait()
        _events: undefined
        _eventsCount: 0
        _maxListeners: undefined
    }
}
```

数据库对象的属性和方法  DB 通过DB类生成

```js
{
  "dbPath": "C:\\ls-project02\\app\\file\\init\\iconfig_user.config",
  "lock": false,
  "logger": {
    "group": "DB",
    "options": {
      "i18n": "en-US",
      "level": 1,
      "output": {
        "memory": {}
      },
      "append": ""
    }
  },
  "connections": null,
  "options": {
    "timeout": 0,
    "poolsize": 8,
    "loglevel": "info",
    "secret": "IPS@@@IPS@@@DB"
  }
  
}
//原型方法
{
    exec: ƒ exec(_x)
    exists: ƒ exists()
    getConnection: ƒ getConnection()
    newConnection: ƒ newConnection()
    parseOptions: ƒ parseOptions(options)
    parseWhere: ƒ parseWhere(obj)
    table: ƒ table(tablename)
    update: ƒ update()
    wait: ƒ wait()
}
```

## 点击添加的过程

添加componentSelector的index -》判断是否有targetMachine 有的话对应编辑或mes-》 没有跳转selector的index -》现根据是否有product显示productSelector -》再根据是否有template显示templateSelector

productSelector 遍历productsGroupByPosition分组中的product -》点击product 调用configurator中的ClearProduct或SelectProduct清空或更新主要配置数据

主要配置数据包括

```js
updateProductConfig
updateProductDefine
updateTemplate
updateProduct
updateProductConfigSnap
updateProductRule
updateProductSave
updateSoftwareDefine
updateComponentList
```

核心处理方法

```js
  SelectProduct: async ({ dispatch, commit, state }, product) => {
    commit('updateProduct', product)  //更新product
    commit('startLoadProductSelection')
    let resPD, resSD, resConfig, resRuleGetter
    // 将util的index中的类的实现，挨个实现一遍
    try {
      [resPD, resSD, resConfig, resRuleGetter] = await Promise.all([
        api.getProductDefineByProduct(product),
        api.getSoftwareDefineByProduct(product),
        api.newProductConfig(product),
        api.newProductRule(product),
      ])
      commit('updateProductDefine', resPD)  //ProductDefine实现
      commit('updateSoftwareDefine', resSD) //SoftwareDefine实现
      commit('updateProductConfig', resConfig) 
        //ProductConfig实现 挂到了window._Config_productConfig 上通过getConfig方法返回
      commit('updateProductConfigSnap', api.getConfigSnap()) 
        //返回window._Config_productConfig的Object.assign的拷贝 但是没有深拷贝
      commit('updateProductRule', resRuleGetter) // productRule构造函数的实现
      // Loading ps
      commit('startLoadProductSave') 
      let getter = await api.newProductSave(state.productConfigSnap)
      let productSave = getter.getProductSave()
      // 这里先实现ProductSave挂到了window._Config_productSave
      // 然后通过getProductSave 返回
      try {
        // 刷新价格然后再更新productSave
        await productSave.LoadPrice()
        commit('updateProductSave', getter)
         // 这里调用RefreshProductConfig
        dispatch('RefreshProductConfig')
      } catch (error) {
        dispatch('SendError', error, { root: true })
      }
      finally { commit('finishLoadProductSave') }
      // await dispatch('LoadingProductSave')
    }
    catch (error) {
      dispatch('SendError', error, { root: true })
    }
    finally {
      commit('finishLoadProductSelection')
    }
  },
```

LoadPrice方法-》通过查t_def_component_special_discount表 分别更新fcSpecialDiscountList（折扣数据列表目前没有数据）通过查t_def_component_listprice表 分别更新hwFCMapList（硬件价格map列表），swFCMapList（软件价格map列表）

```js
 // 此方法选择机型会调用一次，进入选择器后的productSummary监视productConfigSnap变化一进来也会调用一遍
RefreshProductConfig: ({ dispatch, commit, state }, checkOrWait) => {
    // edit machine will be error, because productConfigSnap will update, but productSave is null
    if (state.productSave === undefined) return
    if (!checkOrWait) {
       // 添加凭证
      commit('addRefreshWork')
    }
    if (state.refreshWorks.length) {
      if (state.refreshWorkLoader) {
        setTimeout(() => {
            // 就是自己调用自己一下
          dispatch('RefreshProductConfig', true)
        }, 5);
        return
      }
      commit('startLoadRefresh')
       // 在删除凭证
      commit('doRefreshWork')
      //----------------------------------------核心代码------------------------------------------
       // 获取productSave
      let productSave = state.productSave.getProductSave()
       // 更新productSave内部的productConfig
      productSave.UpdateConfig(state.productConfigSnap)
       // 加载选配的全部配件信息
      productSave.LoadComponents()
        .then(components => {
          // 更新state.componentList  componentList展现在配置概览
          commit('updateComponentList', components)
        })
        .catch(error => {
          console.error(error)
          dispatch('SendError', `missing info of FCCode`, { root: true })
        })
        .finally(() => {
          commit('finishLoadRefresh')
          dispatch('RefreshProductConfig', true)
        })
    }
  },
```

LoadComponents 方法-》调用loadHW和loadSW方法loadHW-》以cpu为例 ：调用packCPUComponents-》调用通用方法

> packHWComponent：内部方法 将 FC 和 Quantity 查价格表和折扣表，打包返回一个 包含价格和折扣信息的对象；找不到返回false

packHWComponent传参this.productConfig.cpuFC 和 this.productConfig.cpuQuantity（fccode和数量）

cpuFC-》CPUMemory.vue中prepares初始化方法中-》调用productDefine.ParseCPU方法传入targetMachine.components-》通过整个CPUList（库中所有的cup）查找对应的fccode返回包装好的数据:

```js
conf{ selection, cpuAct}   //selection ->是正常cpu数据 cpuAct->是激活码数据 
this.selCPUComponent = cpuInfo.selection.component;
this.selCPUCount = cpuInfo.selection.quantity;
```

prepares方法最后调用saveConfig-》调用productConfig.SaveCPUInfo方法传入selCPUComponent和selCPUCount和selCPUActivate

```js
SaveCPUInfo(cpuFC, cpuQuantity, cpuActivated) {  // 进行对应的赋值操作
    this.cpuFC = cpuFC; // CPU fccode
    this.cpuQuantity = cpuQuantity; // 数量
    this.cpuActivated = cpuActivated; //激活的CPU数量 cpuInfo.cpuAct.quantity获取来的
    this.RefreshDescription();
  }
```

通过fccode找hwFCMapList的最新数据返回cpu的component

LoadComponents 方法-》将所有的当前机器配置的的component返回成数组并在需要的每一项中添加标记-》添加componentList中

productSummary中的配置预览数据就由componentList而来

## 软件部分

### 关键字

- os 操作系统
- sw 软件
- hpo 预装软件
- a6p 光盘
- swma 维保
- autoMES MES变更CPU core时软件是否需要自动补齐数量至core数上限。取值0或-1。-1=自动补全，0=不自动补全
- swComponents 本软件产品附带的软件类FC,json格式。如[{"FCCode":"C1AT","Quantity":-1}]。其中quantity的值：-1=自动补全至当前core数不可调整，0=不补全可调整，默认最小值。1=不补全可调整，默认当前core数

#### Parse  sw 及 os 对象 中 key 的含义

- main 对应 base .entity 的软件选项数据 ，显示在页面时用这个数据查找对应

- base  即基础配置
  - entity  软件主体 操作系统 （AIX7.x标准版，PowerVM企业版 ...）或软件本身
  - swma  软件或操作系统的维保
  - cps 软件或操作系统的部件（components）
  - swmacps 维保的部件（swmacomponents）
  - actquantity 激活码数量

- mes   placeGroup 中为 `mes_x`的, 即 mes 时手动添加的软件

  - base 一般mes时只能添加维保 所以 mes 的 base 对应维保的数据

    - gen 第几次升级时添加的`mes_x` 后面的 x

    - swma  软件或操作系统的维保
    - swmacps 维保的部件（swmacomponents）
    - actquantity 激活码数量
  - auto mes时改变core数据 或激活数改变后 对应添加的软件
    - gen 第几次升级时添加的`mes_1_auto_x` 后面的 x
    - swma  软件或操作系统的维保
    - swmacps 维保的部件（swmacomponents）
    - actquantity 激活码数量

- auto   placeGroup 中为 `auto_x`的， 即 mes 时改变cpu core数，自动补全到croe数上限的软件， 或者改变软基激活数后自动补全的软件  对应页面上的自动生成部分

- ![image-20210531105918424](https://bitbw.top/public/img/my_gallery/bkLizdxJOeqgHNr.png)

  - gen 第几次升级时添加的`auto_x` 后面的 x

  - entity  软件主体 操作系统 （AIX7.x标准版，PowerVM企业版 ...）或软件本身
  - swma  软件或操作系统的维保
  - cps 软件或操作系统的部件（components）
  - swmacps 维保的部件（swmacomponents）
  - actquantity 激活码数量

- entity  软件主体 操作系统 （AIX7.x标准版，PowerVM企业版 ...）或软件本身

- swma  软件或操作系统的维保

- actquantity 激活码数量

- cps 软件或操作系统的部件（components）

- swmacps 维保的部件（swmacomponents）

用户表字段名含义

- placeDef 主体软件每个部件都有 存着主体软件的UUID
- placeGroup ： `mes_n`   `n`代表第多少次mes添加的部件

### 点击需要预装软件（HPO）

数据库中hpo表

![image-20210105110618125](https://bitbw.top/public/img/my_gallery/image-20210105110618125.png)

没看代码的理解：点击需要预装软件后找到对应的数据库中hpo的那条数据， 将 hwComponents和hpoComponents 字段中的部件添加到已选部件中

数据库中的software表

![image-20210105140911553](https://bitbw.top/public/img/my_gallery/image-20210105140911553.png)

并且找到对应software中对应的hpoCompoents中的Fccode加到已选部件中

### 软件部件添加 swComponents 和 hpoComponents 中的json部件

每次选择部件后  

调用productSave方法的

LoadComponents -> loadSW->pack(os,sw,hpo)Components ->packSoftwareAndChildren  

packSoftwareAndChildren 将json转化对象添加compoentList 中

### A6P（光盘）

#### 添加软件后   已选部件中 5692-A6P （软件信息） 1100（实物DVD交付）3435（DVD/CD-ROM） 只出现一次的原因

loadSW 方法返回 swcomponents   的过程 遍历所有数据 :

保证 A6P_COMPONENT A6P_COMPONENT_ELE A6P_COMPONENT_ENTITY A6P 这几种部件如果FCCode相同 只出现一次

一般相同的就只有5692-A6P （软件信息） 1100（实物DVD交付）3435（DVD/CD-ROM）这几个会重复， 就直接进行去重操作了

#### 添加软件后 a6p 中 swcomponents 的 3450 (电子交付) 1101 (不使用实物DVD交付) 不在配置列表中显示的原因

有这两个3450 电子交付 1101 不使用实物DVD交付    的 软件 虽然在A6p中 但属于不需要实际发货类型

这两个组件的 subType 是 A6P_COMPONENT_ELE

在productSummary  index.vue 中 使用 mergeComponentList 方法过滤了A6P_COMPONENT_ELE 同时将相同部件合并显示数量

然后放到展示列表中

### 已知bug

MES未做任何改变后导出xslx 总价 合计价格计算公式会出错 因为

mes计算totalLines 的 是changeinfo 的总计 但是 如果未作改变的话 changeinfo长度为0 计算就会出问题

并且 因为没有changeinfo 所有汇总中的价格都是0

### packSWComponents方法

调用 packSoftwareAndChildren 方法

#### packSoftwareAndChildren方法

- 接收主部件数据， 解析需要自动带出的部件 （hw,sw，hpo,）Component  

- 设置自动带出部件的 placeDef（所属部件UUID） placeGroup （所属分组）  
- 将自动带出部件的数量 quantity 为-1 或者 0 的部件的数量设置为options.actquantity （主部件的激活数量）
- 调用 packSWComponent  将打包好的部件列表数据返回

##### packSWComponent方法

给部件添加quantity,uuid,placeDef,placeGroup,listSpecialDiscountUSD,listSpecialDiscountRMB,discountUSD,discountRMB

### 组件

### mes.vue

#### data

hpo和A6p

- constTrue 之前软件的复选框 默认选择
- defHPOComponent  机型对应的HPO
- HPOChekbox 是否选择预装软件
- selHPOComponent 已选预装软件
- oldA6Ps 之前的软件a6p

os （数据为对象因为只有一个）

- selectedOSInfo 之前的已选操作系统信息
- selectedOSNewSWMA 本次新增的操作系统的维保
- autoMESSelectedOSBase 本次对操作系统的修改的base（没有修改就是undifined）
- autoMESSelectedOSPreviousMES 之前的mes组成的数组
- dynamicOSActQuantity 动态计算操作系统激活码数量 根据cpu核数

sw （数据为数组因为可能有多个）

- selectedSWsInfo  之前的已选的软件信息（数组）
- selectedSWsNewSWMA  本次新增的软件的维保（对应selectedSWsInfo 中的软件）
- autoMESSelectedSWsBase  MES 软件的 bese
- autoMESSelectedSWsPreviousMES    软件过往的mes( 二维数组  [已选软件列表 [ {对应swma 和 changeQuantity } ] ] )
- dynamicSWsActQuantity 动态计算软件的激活码数量 根据cpu核数

新增软件选项

- defSWsList   新增的可选软件列表
- selSWsComponent 对应 defSWsList   中的每一项是否选择 （Boolean[ ]）
- selSWsACTQuantity  对应 defSWsList   中的每一项 的激活数量
- selSWsSWMA    对应 defSWsList   中的每一项  的维保信息

```js
 
// 当激活数发生改变处理软件
handleSWs() {
      // check selected
      this.selectedSWsInfo.forEach((sw, index) => {
        // 变化的激活数
        let changeQuantity = this.cpuActivatedChange;
        // 不自动补全到 cpu core 上限
        if (sw.base.entity.autoMES !== -1) {
          // 当 dynamicSWsActQuantity 大于最大可选激活数时， 强制其等于最大可选激活数
          if (this.dynamicSWsActQuantity[index] > this.cpuActivated) {
            this.dynamicSWsActQuantity[index] = this.cpuActivated
          }
          changeQuantity =
            this.dynamicSWsActQuantity[index] -
            this.calcSWPreviousActLicense(index);
          this.dynamicSWsActQuantity[index]
        } else {
          // 自动补全到 cpu core 上限
          this.dynamicSWsActQuantity[index] = this.cpuActivated;
        }
        if (changeQuantity === 0) {
          // if activated quantity not change, reset and exit
          this.initSW(index);
          return;
        }
        // 将变化的激活数赋值给 base 的 actquantity
        this.autoMESSelectedSWsBase[index] = {
          ...sw.base,
          actquantity: changeQuantity,
        };
        if (sw.mes) {
          // 如果有过往 mes 在 autoMESSelectedSWsPreviousMES 为其添加对应的数组
          this.autoMESSelectedSWsPreviousMES[index] = Array.from(
            { length: sw.mes.length },
            () => undefined
          );
          // auto mes previous mes, process by mes-generation
          sw.mes.forEach((generation, gIndex) => {
            // 从 base 中  swmaList 中找到 sw.mes.base.swma 一致的部件
            let swma = sw.base.entity.swmaList.find(
              (swma) => swma.FCCode === generation.base.swma.FCCode
            );
            // 对应软件过往的 mes 中添加对应 swma 和 changeQuantity
            this.autoMESSelectedSWsPreviousMES[index][gIndex] = {
              swma,
              actquantity: changeQuantity,
            };
          });
        }
      });
      // check new sws 刷新一下可选软件需要自动补全的激活数
      this.defSWsList.forEach((sw, index) => {
        if (sw.autoMES === -1) {
          this.selSWsACTQuantity[index] = this.cpuActivated;
        }
      });
    },
```

# uitl中的主要类

## ProductDefine类

> 说明 ：产品定义 包含内部可选部件的集合（就是可以配置的选项）

属性：

> 将所有当前服务器数据和可配置项挂载上面

方法：

## ProductConfig类

> 说明 ：产品的用户配置的集合（选配清单）  用户配置的数据都挂在这里  供 ProductSave 打包生成数据

属性：

>基础数据与ProductDefine一样有机器的数据和各个部件的配置列表, 多了单独挂载当前已配置的各项部件数据，比如cpuFC，cpuQuantity，cpuActivated

方法：

#### SaveXX保存已选数据

各个部件的vue 选项发生变化会调用 对应的 SaveXX方法保存到 ProductConfig 实例上；

## ProductSave类

属性：

>有根据FCcode生成的硬件和软件列表（hwFCMapList，swFCMapList）和折扣信息列表（fcSpecialDiscountList） 用于更新价格等，包含最新的 productConfig 实例对象  ProductSave会在productConfig 上取已选的硬件的软件的数据
>
>已选配置的配置列表 通过这个类进行展示 ，主要通过 LoadComponents 在 方法获取 productConfig 中的数据并打包生成 compoentList 最后放到 vuex 中

方法：

- LoadComponents 加载所有已选和barebone中的部件 返回 componentList（已选所有组件列表）赋值给vuex

- 以packCPUComponents 为例   packxxx Components方法将对应的productConfig已选择的部件进行打包返回

```js
 let component = this.packHWComponent(this.productConfig.cpuFC, this.productConfig.cpuQuantity) 
 // 将productConfig 中已选择的cpu fc 和 quantity 进行打包 
```

- packBareboneComponents   加载产品默认带的部件 this.productConfig.bareboneList 进行打包 返回

## 上面三个类的关系

> ProductSave 包含 ProductConfig（productConfig）
>
> ProductConfig 的 productDef 是直接从数据库中拿出来的数据，并非通过ProductDef实例化来的

## SoftwareDefine类

> 说明 ：可选软件的集合 ProductDefine 用于定义可选硬件， SoftwareDefine 用于定义可选软件；
>
>

属性:

>有根据软件属性进行细分的软件列表：a6pList(光盘)，hpo（预装），modeltype（机器型号），osList（操作系统软件列表），swList，swmaList（维保）

方法：

#### initialize

从数据库中加载对应部件放到列表中 并在对应的os 和 sw 中添加对应的 swma 维保 和 a6p 光盘

>数据库中添加 os 和 sw 必须有对应的 a6p 和 swma 信息  ！！！ swFCCode  和 swVersion 需要一 一 对应
>
>没有的话 productSave 的 packOSComponents 或 packSWComponents 会报错  ：FCcode  undefinde

```js
  async initialize() {         
    [
      this.osList,                                          //操作系统列表
      this.swList,                                          //软件列表
      this.a6pList,                                         //光盘列表
      this.swmaList,                                        //维保列表
      this.hpo,                                             //预装列表
    ] = await Promise.all([
      this.loadOS(),
      this.loadSW(),
      this.loadA6P(),
      this.loadSWMA(),
      this.loadHPO(),
    ])
    // os 中添加对应的 swma 维保 和 a6p 光盘
    this.osList.forEach((os, index) => {
      this.osList[index].swmaList = []
      // set os swma
      this.swmaList.forEach(swma => {
        if (swma.swFCCode === os.FCCode && swma.swVersion === os.swVersion)
          this.osList[index].swmaList.push(swma)
      })
      // set os a6p
      this.osList[index].a6p = this.a6pList.find(a6p => {
        return a6p.swFCCode === os.FCCode && a6p.swVersion === os.swVersion
      })
    })
    //  sw 中添加对应的 swma 维保 和 a6p 光盘
    this.swList.forEach((sw, index) => {
      this.swList[index].swmaList = []
      // set sw swma
      this.swmaList.forEach(swma => {
        if (swma.swFCCode === sw.FCCode && swma.swVersion === sw.swVersion)
          this.swList[index].swmaList.push(swma)
      })
      // set sw a6p
      this.swList[index].a6p = this.a6pList.find(a6p => {
        return a6p.swFCCode === sw.FCCode && a6p.swVersionParseSW === sw.swVersion
      })
    })
  }
```

ParseSW  解析软件数据  software.vue 中的prepares 调用 此方法 传入this.targetMachine.components

```js
prepares(){
    let conf = this.softwareDefine.ParseSW(this.targetMachine.components);
    ...
}
```

## RuleParser规则构造函数（jison 语法编译器）

>说明 ：解析.rule 文件 ， 进行规则检查
>
>tip ：内部主要使用  jison（语法编译器）[官网](http://zaa.ch/jison/)  coffeeScript 就是使用 jison 进行编译的

属性：

> objs : 用来进行规则检查的数据判断 见 symbols.js
>
> yy

方法：

> checkSem
>
> match       matchRules(className, group)  //规则检查
>
> parseError

### productRule.js理解

```js
var rule = (function() {
    var parser = {...}
    function Parser() {
        this.yy = {};
    }
    Parser.prototype = parser;
    parser.Parser = Parser;
    return new Parser();
})();
export default rule;
// rule是 Parser实例 Parser的原型对象是parser, rule实例可以调用parser的方法
```

productSummary的主要校验规则方法checkConfig-》this.productRuleParser.match("Server", "*")-》调用matchRules方法

## 规格检查

各个部件内部都实现了saveConfig 方法 ，每个部件的值发生改变将触发saveConfig方法

```js
  saveConfig() {
      let svr = this.productRuleParser.objs.server; 
      let readyIOList = this.selIOComponents
        .filter(v => v.component && v.count)
        .map(v => ({
          FCCode: v.component.FCCode,
          Quantity: v.count
        })); // 获取{"FCCode":"9009-42A","Quantity":1} 形式的已选部件列表
      this.productConfig.SaveInternalPCIList(readyIOList); // 保存productConfig对应的list中
      svr.selIOComponents = this.selIOComponents.filter(   // 全数据保存到productRuleParser.objs.server中
        v => v.component && v.count
      );
      this.CreateSnap(); //赋值productConfigSnap
    }
 //规则检查器对象
     productRuleParser: function() {
      return this.productRule && this.productRule.getRuleParser();
    }
```

productSummary组件中 监听productConfigSnap变化触发checkConfig方法

```js
productConfigSnap(v, old) {
      this.checkConfig();
      this.RefreshProductConfig();
      this.calcExtendDesc();
    },
```

checkConfigf调用productRuleParser.match 进行规则检查

```js
 checkConfig() {
      let checkRes = this.productRuleParser.match("Server", "*");
      this.errList = checkRes.errList;
      this.appendList = checkRes.appendList;
      this.productConfigSnap.setAppendList(checkRes.appendList);
    },
```

match 方法

```js
/**
stack对象的stacks初始化就是 [context](上下文对象) 
context.symbols (stack.stacks[0].symbols) 就是rule文件的整个语法解析器对象 
也就是vue中this.productRuleParser.objs 
errMsg因为没申明，所以没有作用域，所以挂载在.rule文件解析对象的全局 ，也就是context.symbols下
stack.top() 返回 context.symbols
*/

function matchRules(className,group){
      var rc = true 
      // stack.top() => {parent: null ,symbols:就是 productRuleParser.objs}
      var cls = findSymbol(stack.top(),[className],[[]]) 
      // 返回context.symbols内部的"Server"对象
       /**
      返回数据 { objs: [{…}]，rules: [{…}]，symbols：[{…}]} 
      objs[0] 就是 productRuleParser.objs.server 也就是 rule文件中的 struct Server的实现
      rules 每个对象都是  @(Server,sr,"背板硬盘类型匹配","back"){ ...} 对应的解析好的语法对象
      symbols struct Server {****} 对象 (解析好的语法对象)
        */
      var errMsg = [];
      for(var j in cls.objs){
          let obj = cls.objs[j];
          let fun = newFunCall("convert",[newDeRef(obj)])
          // convert 对应.rule 文件中定义的convert方法    fun -》解析好的语法解析对象
          // fun { name: "convert",ntype: 22, symlist:[{ntype: 36,val: obj }]}
          exec(fun); //太深了 大概就是执行一下语法解析对象
         errMsg.push(...matchSubjectRules(obj,true))
         for(var i in cls.rules){
                var rule = cls.rules[i]; 
             // rule 是 每个@(Server,sr,"背板硬盘类型匹配","back")的语法解析对象
                context.symbols.errMsg = "";
             // group 是 * 的意思 应该是检查所有的分组@(Server...) ，  上面的"back"就是group分组的名字
             if((group == "*")||(rule.group.match(group) != null)){
                  let v = execRule(rule,obj); //主要的规则检查在这里
                    /**
                    每个@(Server...)最后会返回一个boolean 判断这个值通不通过
                    并将context.symbols.errMsg  赋值
                     */
                  if(!v){
                      errMsg.push(context.symbols.errMsg)  
                }
            } 
       }     
      }
      return {
            errList :errMsg,         // 提示的错误信息
            appendList: context.symbols.server.extensions // 执行@(Server ...)  自动带出的fccode和数量的数组
     };
    }

```

execRule

```js
// 主要的规则检查在这里
function execRule(r,obj){
  let dumfun = newFun("dumy_function",[newRef(r.arg)],r.vdl,r.sl);
   //{args: [{…}],body: (2) [{…}, {…}],name: "dumy_function",ntype: 1,vdl: []}
  let funCall = newFunCall("dumy_function",[newDeRef(obj)])
 //{name: "dumy_function",ntype: 22,symlist: [{…}]}
  updateSymbol(stack.top(),["dumy_function"],dumfun,true,[[]])
  return exec(funCall)   // exec 是一个多个函数相互递归的函数 
}

```

> exec 通过对比 语法对象中的ntype  和 AIF， AFOR 等 执行对应的 exec_if_stat ，exec_for_stat ,eval_expr 等
>
> AFOR   去掉前面的A 就是正常程序中的关键字for

```js
  function exec(ast) {
    switch (ast.ntype) {
      case AIF:
        return exec_if_stat(ast);
      case AFOR:
        return exec_for_stat(ast);
      case ARETURN:
        stack.top().finished = true;
        return exec(ast.e);
      case ABREAK:
      case ACONTINUE:
        return undefined;
      case ANOP:
        return undefined;
      default:
        return eval_expr(ast);  //  大部分的都会进到这里 再次switch 找到对应的ntype  执行对应的方法  
    }
  }
```

eval_expr

```js
//  大部分的都会进到这里 再次switch 找到对应的ntype  执行对应的方法
function eval_expr(ast){  // ast ->fun 
 switch(ast.ntype){
    case AFCALL://22
      return call(ast.name,ast.symlist) 
         //{names: (2) ["sr", "checking"],ntype: 24,offs: (2) [Array(0), Array(0)]}
 }
```

call

```js
function call(name, symlist) {
    var ret = null;
    var fnref = findSymbol(stack.top(), [name], [[]]);
    var args = [];

    if (!fnref) {
      console.log("undeclared function name:", name);
    }
    for (let i in symlist) {
      var sval = exec(symlist[i]);
      args.push(sval);
    }

    stack.push();
    for (let i in fnref.args) {
      updateSymbol(stack.top(), fnref.args[i].names, args[i], true, [[]]);
    }
 // 将所有的执行检查函数的内部变量添加到 stack.stacks[0中]
    if (fnref.vdl != null) {
      for (let i in fnref.vdl) {
        var c = fnref.vdl[i];
        var val = exec(c.rhs);
        updateSymbol(stack.top(), c.lhs.names, val, true, [[]]);
        if (c.rhs.ntype == ACONSTRUCT) {
          for (var j in val.annotations) {
            var pref = c.lhs;
            var annotation = val.annotations[j];
            annotation[0] = pref + "." + annotation[0];
          }
        }
      }
    }
 // 执行所有body （逻辑） stack.finished() 将stack 中的语法对象全部执行完毕返回true 
    for (let i in fnref.body) {
      ret = exec(fnref.body[i]); // 返回最后的执行结果 true 或 false 就是规则检查的结果
      if (stack.finished()) {
        break;
      }
    }

    stack.pop();
    return ret;
  }
```

updateSymbol 会在stack.stacks 中从前添加一个context上下文对象

```js
{
    finished: false
    parent: {symbols: {…}, parent: null} // parent就是整个文件的语法对象
    symbols: {sr: {…}, key: true}  // symbols 是当前执行函数的语法对象数据 相当于块级作用域内的数据
}
```

### 自动带出实现（自动补全项）

- .rule 文件中 sever有这个属性 extensions=[],"自动补全项";

```js
@(Server,sr,"激活码数量限制","cpu"){ // 规则检查时直接将 extensions 推进去对应的数据对象
     appendExtension(sr,"cpu.activate","EP4F",sr.cpuActivated);
    ...
}
func appendExtension(sr,type,fc,count){
     var a = new ExtendItem;
     a.type = type;
     a.FCCode = fc;
     a.Quantity = count;
     push(sr.extensions,a);
}
```

- productSummary vue文件中

```js
 checkConfig() {
      let checkRes = this.productRuleParser.match("Server", "*");
      this.errList = checkRes.errList;
      // 获取自动补全列表
      this.appendList = checkRes.appendList; //appendList 就是extensions
      // 设置自动补全列表
      this.productConfigSnap.setAppendList(checkRes.appendList);
    },
```

- productSave 中

```js
 // 内部方法 打包特殊FC（自动带出的部件），比如CPU激活，通过productConfig类得到规则引擎追加的这些特殊FC，找到对应，执行packHWComponent打包
  getFeature(type) {
    let appendList = this.productConfig.getAppendList()
    return appendList ? appendList.find(append => append.type === type) : appendList
  }
```

- 在打包各种部件时使用getFeature，例如packCPUComponents

```js
// 生成CPU相关
  packCPUComponents() {
     return new Promise((reslove, reject) => {
      ....
      // actived
      let actived = this.getFeature('cpu.activate')
      if (actived) {
        let component = this.packHWComponent(actived.FCCode, actived.Quantity) //获取自动带出的部件
        if (component === null) {
          reject(actived.FCCode)
          return
        } else {
          components.push(component) //部件列表添加自动带出部件
        }
      }
      reslove(components)
    }) 
  }
```

### .rule文件

>在.rule文件中 没在块级作用语内的声明（struct ，func  ，var ）

```js
//用于定义用来实例化对象的类 .rule文件直接写对象 {xx :xxx} 会报错
struct MemItem {  
      var FCCode ="EM62", "内存编号";
      var count = 1, "内存条数";
}
// server 是用来放置规则检查器的所有数据对象 通过 conver方法将外部挂载的sel数据  放置转换到 server内部数据
struct Server {
   var cpuQuantity = 0, "处理器数量";
   var cpuActivated = 0, "激活的CPU数量";
   ...
}
var noDiskFCs=["0837"];  // 用以判断是否是磁盘索引 （SAN负载源指定） 使用： return !(fc in noDiskFCs);
var server = new Server; // 生成server对象

func convert(sr){         // 规则检查每次先调用这个函数将已选数据 selxxxComponent 转化到server数据中 sr即 server
     if (!sr.checking){
       sr.checking = true;
       convertCPUMem(sr);
       convertFrontMB(sr);
       convertIO(sr);
       convertPower(sr);
       convertSoftWare(sr);
       if(sr.selLanguage){
          sr.langFC = sr.selLanguage.FCCode;
       }
       convertOtherComps(sr);
       convertIODrawerList(sr);
       convertEnclosureList(sr);
       sr.checking = false;
     }
}
@(Server,sr,"CPU数限制","cpu"){ // 核心的检查方法 sr 即 server 数据 ，规则解析后被放置到 Server的rules中
     errMsg="必须选配1-2个[EP1F]CPU";
    (sr.cpuFC == "EP1F") && (sr.cpuQuantity>=1) && (sr.cpuQuantity <=2);
}
```

![image-20201222092112705](https://bitbw.top/public/img/my_gallery/image-20201222092112705.png)

### parse规则解析过程

parse-> 赋值所有数据 -> 使用 while 循环 一直解析 -> 调用lexer.lex()  ->  一行一行解析

(使用正则匹配 将匹配的字符保存 并将input中的已匹配字符删除  返回对应的token)

循环解析过程

- symbol  = lex() 找到.rule文件字符串中能够匹配的rules的下标 对应 performAction的返回值(token)
- action =  table中下标为上一个动作的symbol的对象  中的key等于当前symbol的值(一般是数组)
- action [0]  进行判断
  - 1  保存当前匹配字符 和 symbol   和 列行数到对应的 vstack stack 和lstack 中
  - 2  主要的生成语法解析对象方法  this.performAction.apply(xxxx , action[1] ,xxx)  根据action[1]进行分配合成方法,最终放到`this.stack.stacks[0]` (上下文对象)中
  - 3 return  循环结束  退出 解析

#### 核心代码

```js
  // 一顿循环 解析开始！
      while (true) {
        // state 默认 0  下一次则等于上一个动作
        state = stack[stack.length - 1];
         // 如果匹配默认动作就直接赋值
        if (this.defaultActions[state]) {
          action = this.defaultActions[state];
        } else {
          if (symbol === null || typeof symbol == "undefined") {
            // 获取对应的token
            // symbol  是  lexer中 当前匹配的rules中正则的下标 对应 performAction的返回值(token)
            symbol = lex();
          }
          // 返回对应table中对应的值（[1,4]） table中下标为上一个动作的symbol的对象  中的key等于当前symbol的值(一般是数组)
          action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
          var errStr = "";
          expected = [];
          for (p in table[state]) {
            if (this.terminals_[p] && p > TERROR) {
              expected.push("'" + this.terminals_[p] + "'");
            }
          }
          if (lexer.showPosition) {
            errStr =
              "Parse error on line " +
              (yylineno + 1) +
              ":\n" +
              lexer.showPosition() +
              "\nExpecting " +
              expected.join(", ") +
              ", got '" +
              (this.terminals_[symbol] || symbol) +
              "'";
          } else {
            errStr =
              "Parse error on line " +
              (yylineno + 1) +
              ": Unexpected " +
              (symbol == EOF
                ? "end of input"
                : "'" + (this.terminals_[symbol] || symbol) + "'");
          }
          this.parseError(errStr, {
            text: lexer.match,
            token: this.terminals_[symbol] || symbol,
            line: lexer.yylineno,
            loc: yyloc,
            expected: expected
          });
        }
        if (action[0] instanceof Array && action.length > 1) {
          throw new Error(
            "Parse Error: multiple actions possible at state: " +
              state +
              ", token: " +
              symbol
          );
        }
        switch (action[0]) {
          // 正常的解析 vstack 存的是对应的字符串
          case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
              yyleng = lexer.yyleng;
              yytext = lexer.yytext;
              yylineno = lexer.yylineno;
              yyloc = lexer.yylloc;
              if (recovering > 0) {
                recovering--;
              }
            } else {
              symbol = preErrorSymbol;
              preErrorSymbol = null;
            }
            break;
          case 2:
            /**
             * 赋的值 和 注释进到这里  遇到; 从新整理赋值和注释 
             performAction中的13 使用 newInit(newRef($$[$0 - 4], []), $$[$0 - 2], $$[$0 - 1]);
             * 通过 performAction 找到对应的解析对象
             * yyval.$ = {"ntype": 4,"val": "内存编号"}
             * 如果是 注释 stack vstack lstack 删除前面生成的, 并重新生成对应的
             */ 
            debugger;
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
              first_line: lstack[lstack.length - (len || 1)].first_line,
              last_line: lstack[lstack.length - 1].last_line,
              first_column: lstack[lstack.length - (len || 1)].first_column,
              last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
              yyval._$.range = [
                lstack[lstack.length - (len || 1)].range[0],
                lstack[lstack.length - 1].range[1]
              ];
            }
            // 生成语法解析器对象的主要分配方法 通过performAction 进行分配以何种方式进行生成语法对象
            r = this.performAction.apply(
              yyval,
              [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
              ].concat(args)
            );
            if (typeof r !== "undefined") {
              return r;
            }
            if (len) {
              // 删除前面生成的
              stack = stack.slice(0, -1 * len * 2);
              vstack = vstack.slice(0, -1 * len);
              lstack = lstack.slice(0, -1 * len);
            }
            // 放进新的解析对象
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
          case 3:
            // action[0] 是 3 则结束循环
            return true;
        }
      }

```

#### 合成语法对象放到stack.stacks[0].symbols中

```js
struct BarItem {
   var Quantity=0,"用于进行规格检查的部件数量";
   var FCCode ="","feature";
}
// 一个 { } 结束在进行合并  使用performAction 中的10 也就是 updateSymbol合并生成下面对象 
// func 和 @(Server) 也是在  performAction 中合成对应的 语法对象 
// 并在 stack 中添加 到 stack.stacks[0].symbols中    通过 stack.top() 获取 stack.stacks[0]
BarItem :{   
    objs: [],
    rules: [],
    symbols: (2) [{…}, {…}],  // 每一项就是一个语法对象如下
}
```

#### 语法解析器解析后的语法对象

> 语法对象是树状结构

#### 语法对象中主要属性的含义

> 名称解释：LHS和RHS的含义是“赋值操作的左侧和右侧”并不一定意味这就是"="的左侧和右侧。赋值操作还有其他几种形式，因此在概念上最好将其理解为“`赋值操作的目标是谁（LHS）`”`以及“谁是赋值操作的源头（RHS）`”。

- ntype   当前对象执行的什么类型操作   对应  解析器中的 A开头常量 例如  AREF 代表变量   最先看是什么类型 执行对应的操作
- vdl 里是 变量的声明赋值操作
- sl    里是if 逻辑判断 和 for循环
- lhs  前面（左边）的操作   例如 var a = 1  中 a    c == b 中的c  LHS(`Left-hand Side`)引用
- rhs 后面（右边）的操作   例如 var a = 1  中 1    c == b 中的b   RHS(`Right-hand Side`)引用
- symlist 函数执行的参数数组
- names 代表变量名 或者 对象.属性   例如 sr.perlist 的names 是   ["sr", "perlist"]
- val  代表 值   例如`ntype: 3, val: 0` 代表数字类型 的 0
- offs 代表  数组[下标 ]   offs 中放置下标    例如   sr.barebone[i]    offs 中存放着 i  （ 变量 或者 对象.属性 都会带offs ，没用到就会是空数组）
- annotations 代表注释  会将 `var FCCode ="EM62", "内存编号"` 中 `"内存编号"`放进去 （变量赋值都带， 没用到显示空字符串）

##### if

- c 代表 if()  中的判断   例如 if （a == b） 中 a == b
- tvl 是 if 为true 的   变量的声明赋值操作
- t 是  if 为true  的 除了   变量的声明赋值的其他操作
- evl 和 e  对应的是 if 对应的eles 的操作

##### for

- init  for的初始化操作
- cond 条件: false 就停止循环 i < len(sr.barebone)
- step  步骤 ： i = i + 1 （i ++）

##### 函数

- args 函数参数
- body 函数体

赋值操作

```js
 var FCCode ="EM62", "内存编号"; 
//解析对象如下
{
  "ntype": 19,   
  // 19 AASSIGN  代表赋值操作    这个语法对象 就是进行赋值操作 执行到这个对象时会执行：var FCCode ="EM62", "内存编号"; 
  "lhs": {    //前面（左边）的操作（变量）
    "ntype": 23,  // 23 AREF 代表变量
    "names": [
      "FCCode"   // 变量名     （是数组说明可以 var 后面多个变量声明 赋值）
    ],
    "offs": [   // 现在还不太理解
      []
    ]
  },
  "rhs": {    // 后面（右边）的操作 （值）
    "ntype": 4,   // 4 AQSTR  代表字符串
    "val": "EM62"
  },
  "annotations": {  // annotations注释
    "ntype": 4,   // 4 AQSTR  代表字符串   
    "val": "内存编号"
  }
}
```

逻辑判断 (分支语法)

```js
// if(len(sr.perlist) == 0){...}
{
    ntype: 25,        // 25 AIF 代表if
    // c 代表 if()  中的判断
    c: {         
      ntype: 13,       // 13 AEQ 代表 ==
      lhs: {
        ntype: 21,       // 21 ABCALL 函数调用
        name: "len",      // 函数名
        symlist: [       // 参数 
          {
            ntype: 24,      //24 AMREF 成员类型 sr.perlist
            names: ["sr", "perlist"],  
            offs: [[], []]
          }
        ]
      },
      rhs: {
        ntype: 3,       // 3 ANUM 代表数字
        val: 0        
      }
    }, 
    // tvl 是判断正确后  变量的声明赋值操作
    tvl: [... ]        
     // t 判断正确后执行的操作
    t: [         
         .... 
         {
            ntype: 19,      // errMsg="TF5配置错误:" + "["+ bar.FCCode +"]" + "必选" ;
            lhs: {
              ntype: 23,
              names: ["errMsg"],
              offs: [[]]
            },
            /**
            赋值操作右侧 是多个 + + 拼接 采用树状结构表示 使用递归解析 先解析最里层 
            6  APLUS  表示 +
            */
            rhs: {       
              ntype: 6,      //  lhs + rhs = "TF5配置错误:[ fccode(bar.FCCode)]必选"
              lhs: {
                ntype: 6,     //  lhs + rhs = "TF5配置错误:[ fccode(bar.FCCode)]"
                lhs: {
                  ntype: 6,     //  lhs + rhs = "TF5配置错误:[ fccode(bar.FCCode)"
                  lhs: {     // lhs + rhs = "TF5配置错误:["
                    ntype: 6,
                    lhs: {
                      ntype: 4,
                      val: "TF5配置错误:"
                    },
                    rhs: {
                      ntype: 4,
                      val: "["
                    }
                  },
                  rhs: {
                    ntype: 24,
                    names: ["bar", "FCCode"],
                    offs: [[], []]
                  }
                },
                rhs: {
                  ntype: 4,
                  val: "]"
                }
              },
              rhs: {
                ntype: 4,
                val: "必选"
              }
            }
          }，
        // eles
        evl: [],
        e: [
          {
            ntype: 32
          }
        ]
     ]
    
 }   
```

#### ntype 类型对应值

```js
  const ACONSTRUCT = 0;     // 代表 new
  const AFUN = 1;           // 代表函数
  const AINIT = 2;
  const ANUM = 3;           // 代表数字
  const AQSTR = 4;          // 代表字符串     拼接例如 "TF5配置错误:" + "["  ntype: 4, val: "["
  const ALIST = 5;          // 代表数组
  const APLUS = 6;          // 代表 +
  const AMINUS = 7;         // 代表 -
  const ADIV = 8;           // 代表 / （除）
  const ATIMES = 9;         // 代表 *
  const AAND = 11;          // 代表 &&
  const AOR = 12;           // 代表 ||
  const AEQ = 13;           // 代表 ==
  const ANEQ = 14;          // 代表 !=
  const ALE = 15;           // 代表 <=
  const ALT = 16;           // 代表 <
  const AGE = 17;           // 代表 >=
  const AGT = 18;           // 代表 >
  const AASSIGN = 19;       // 代表 赋值操作：例如 errMsg="TF5配置错误:"  ntype: 6,  lhs
  const ANOT = 20;          // 代表 ! 取反
  const ABCALL = 21;        // 代表 函数调用 (自带函数如len)
  const AFCALL = 22;        // 代表 rule文件中定义的函数 调用(例如 func isDiskBoot)
  const AREF = 23;          // 代表变量  例如 var key = false 中的key ntype 23
  const AMREF = 24;         // 代表获取成员变量 例如  sr.serverModel ntype使用这个枚举项  names: ["sr", "serverModel"], offs: [[], []]
  const AIF = 25;           // 代表if
  const AFOR = 26;          // 代表for
  const AMOD = 27;          // 代表% 取余
  const ABAND = 28;
  const ABOR = 29;
  const ABXOR = 30;
  const ATILE = 31;
  const ANOP = 32;          // 代表 应该是无操作
  const ARULE = 33;
  const ARETURN = 34;       // 代表 return
  const AIN = 35;           // 代表 in d.LinkCord.FCCode in ["ECCS","ECCX","ECCY"] 返回 boolean
  const ADEREF = 36;
  const ABREAK = 37;        // 代表 break
  const ACONTINUE = 38;     // 代表 continue
   // 对应值
 rules: [
        /^(?:\/\/.*)/,
        /^(?:struct\b)/,
        /^(?:return\b)/,
        /^(?:break\b)/,
        /^(?:continue\b)/,
        /^(?:true\b)/,
        /^(?:false\b)/,
        /^(?:else\b)/,
        /^(?:print\b)/,
        /^(?:push\b)/,
        /^(?:var\b)/,
        /^(?:new\b)/,
        /^(?:len\b)/,
        /^(?:floor\b)/,
        /^(?:ceil\b)/,
        /^(?:round\b)/,
        /^(?:func\b)/,
        /^(?:for\b)/,
        /^(?:if\b)/,
        /^(?:in\b)/,
        /^(?:0x([0-9A-Fa-f])+)/,
        /^(?:([0-9])*\.([0-9])+)/,
        /^(?:([0-9])+)/,
        /^(?:([a-zA-Z][a-zA-Z0-9_]*))/,
        /^(?:"[^"]*")/,
        /^(?:==)/,
        /^(?:!=)/,
        /^(?:>=)/,
        /^(?:<=)/,
        /^(?:\+=)/,
        /^(?:-=)/,
        /^(?:\*=)/,
        /^(?:\/=)/,
        /^(?:&=)/,
        /^(?:\|=)/,
        /^(?:\^=)/,
        /^(?:%=)/,
        /^(?:\+\+)/,
        /^(?:--)/,
        /^(?:\|\|)/,
        /^(?:&&)/,
        /^(?:>>)/,
        /^(?:<<)/,
        /^(?:=)/,
        /^(?:\+)/,
        /^(?:-)/,
        /^(?:\*)/,
        /^(?:\/)/,
        /^(?:>)/,
        /^(?:%)/,
        /^(?:<)/,
        /^(?:!)/,
        /^(?:\.)/,
        /^(?:\{)/,
        /^(?:\})/,
        /^(?:\[)/,
        /^(?:\])/,
        /^(?:\()/,
        /^(?:\))/,
        /^(?:;)/,
        /^(?:,)/,
        /^(?:&)/,
        /^(?:\|)/,
        /^(?:\^)/,
        /^(?:~)/,
        /^(?:@)/,
        /^(?:\s+)/,
        /^(?:\.)/,
        /^(?:$)/,
      ],

```

#### lexer对象

```js
{
    conditionStack: ["INITIAL"]
    done: false                 // 解析完成
    match: "Cpu"                // 当前正则解析的字符串
    matched: "struct MemItem {                       // 已解析的字符串
    ↵      var FCCode ="EM62", "内存编号";
    ↵      var count = 1, "内存条数";
    ↵}
    ↵
    ↵struct Cpu"
    matches: (2) ["Cpu", "Cpu", index: 0, input: "Cpu {
    ↵      var FCCode = "",  "处理器编号";
    ↵      var…urn false;
    ↵    }
    ↵   }
    ↵ }
    ↵ return true;
    ↵}
    ↵
    ↵", groups: undefined]
    offset: 0
    yy: {lexer: {…}, parser: Parser}
    yyleng: 3
    yylineno: 5
    yylloc: {first_line: 6, last_line: 6, first_column: 7, last_column: 10}
    yytext: "Cpu"
    _backtrack: false
    _input: " {                 // 还没有解析的字符串
    ↵      var FCCode = "",  "处理器编号";
    ↵      var co"
    _more: false
}
```

#### parse中变量的含义

```js
lstack : [{     //每次lexer.lex() 匹配的字符  的开始行和结束行 开始列和结束列
  "first_line": 1,   //开始行
  "first_column": 0,  //开始列
  "last_line": 1,   //结束行
  "last_column": 0   //结束列
} ...]
yyloc:{      //单次的 的开始行和结束行 开始列和结束列 完成后放入lstack中
  "first_line": 1,
  "last_line": 1,
  "first_column": 15,
  "last_column": 16
}

stack : [0,20,4,12,]  //lexer.lex() 返回的token在table中的匹配项（）
state = stack[stack.length - 1] // 上一次循环的匹配字符的token table中的匹配项

vstack : [ null,"struct", "MemItem","{"]  //lexer.lex() 返回的匹配字符
yytext："{"       //单次 返回的匹配字符 完成后放入vstack中

```

# 文件导出

## 文件导出的概念（重要）

iconfig配置的概念：

- 首次配置 = new box
- 升级配置 = mes

展示到 cfr 和 xlsx 中 分成三个部分展示

- base         - 即基础配置 就是上次的配置或者newbox  (在数据中就是 config 中最里面的 mesconfig )
- change     - 即改配或升级 改变了那些配置 （通过 target 配置 减去mesconfig 中的 配置）
- target       - 即 base  + change 也就是最后的目标配置 （就是当前 config 中的配置）

在 cfr 和 xlsx 中各个展示部分的名称

- cfr
  - base         012BASE CONFIGURATION
  - change     014ORDER TRANSACTIONS
  - target        013PROPOSED CONFIGURATION

- xlsx
  - base         Base System
  - change     To Be Install
  - target        Target System
  
  导出baseIPC永远导出第一次的配置

## IPC

#### 关于ipc

> ipc实际上是包含_d_i_p_s_c_,和_d_i_p_s_m_两个文件的压缩包

### 导入IPC

1. productList.vue 调用@/util/export中的ImportIPC方法返回importTemp

   ```js
   {
     id: 1,
     schemaID: '2bddfed9-df64-4810-866a-049da45861da',
     configID: '3f96b6ee-a111-4dc2-8e79-1fd751f0f4cf',
     status: 0,
     schemaName: '张test',
     customerID: null,
     salesID: null,
     technicalID: null,
     customerName: '张博文',
     salesName: '张博文1',
     technicalName: '张博文2',
     createDate: 1600740278,
     visitDate: 1600744952,
     description: '张博文2张博文2张博文2张博文2',
     shipDate: '2020-09-19',
     mesConfigID: '',
     nameCHN: 'K1_Power_E950',
     nameENG: 'K1_Power_E950',
     descriptionCHN:
       'K1 Power E950 企业级Unix服务器;紧凑的4路系统 可提供卓越的性能 极高的敏捷性和业界领先的可靠性;主要配置如下：;配置 2 × 8核心 3.6GHz主频 POWER9 处理器, 激活16核;配置总计384GB容量企业级内存, 激活384GB; 配置 24×16GB DDR4 企业级内存;配置 4*NVMe 通用存储背板;配置总计1600GB硬盘容量; 配置 2×800GB 主流级U.2固态硬盘; 配置 1×1Gb 4端口 网卡;配置 4×2000W企业级服务器电源;配置 4×K1 Power E950标准电源线;配置 指定语言-简体中文（PRC）;',
     descriptionENG:
       'K1 Power E950 Enterprise Unix Server;Critical server;The major configuration is as below;Configure 2 × 8-core Typical 3.6 to 3.8 GHZ , 16 cores activated;Configure total 384GB enterprise memory, 384GB memory activated;Configure 24×16 GB DDR4 Memory;Configure Storage Backplane with Zero DASD 8 SAS 2.5" HDD/SDD Controllers;Configure total 1600GB enterprise disk Capacity; Configure 2×Mainstream 800 GB SSD NVMe U.2 module; Configure 1×PCIe2 4-port 1GbE Adapter;Configure 4×Power Supply - 2000W for Server ;Configure 4×Power Cord To PDU/UPS, ;Configure Language Group Specify - Simplified Chinese ;',
     type: 'SERVER',
     category: 'K1 Power',
     quantity: 1,
     baseInformation: null,
     listpriceHWUSD: 5255588,
     listpriceHWRMB: 39416910,
     listpriceSWUSD: 153300,
     listpriceSWRMB: 1149750,
     listpriceSVUSD: 0,
     listpriceSVRMB: 0,
     serverModel: '9040-MR9',
     serverName: 'K1 Power E950',
     serverPN: 'FUH-9040MR9-0000',
     serverCategory: 'K1 Power',
     discountHW: 0,
     discountSW: 0,
     discountSV: 0,
     priceVersion: 1,
     version: 1,
     components: [
       {
         id: 1,
         PNCode: '9040-MR9',
         FCCode: '9040-MR9',
         uuid: 'b67985e4-b931-43c4-94a8-72fe6cc58da2',
         nameCHN: 'K1 Power E950',
         nameENG: 'K1 Power E950',
         configID: '3f96b6ee-a111-4dc2-8e79-1fd751f0f4cf',
         type: 'FC_MODEL',
         subType: 'Machine',
         quantity: 1,
         cfgType: '',
         placeDef: '',
         placeGroup: '',
         serverModel: '9040-MR9',
         serverName: 'K1 Power E950',
         serverPN: 'FUH-9040MR9-0000',
         serverCategory: 'K1 Power',
         listpriceUSD: 442000,
         listpriceRMB: 3315000,
         discountUSD: 0,
         discountRMB: 0,
         priceVersion: 1,
         version: 1,
         status: 0,
       },
         // 大概50个左右
     ],
   };
   ```

2. 确定导入handleImportIPC方法  生成importConfig对象

   ```js
   {
     name: 'K1_Power_E950',
     descriptionCHN:
       'K1 Power E950 企业级Unix服务器;紧凑的4路系统 可提供卓越的性能 极高的敏捷性和业界领先的可靠性;主要配置如下：;配置 2 × 8核心 3.6GHz主频 POWER9 处理器, 激活16核;配置总计384GB容量企业级内存, 激活384GB; 配置 24×16GB DDR4 企业级内存;配置 4*NVMe 通用存储背板;配置总计1600GB硬盘容量; 配置 2×800GB 主流级U.2固态硬盘; 配置 1×1Gb 4端口 网卡;配置 4×2000W企业级服务器电源;配置 4×K1 Power E950标准电源线;配置 指定语言-简体中文（PRC）;',
     descriptionENG:
       'K1 Power E950 Enterprise Unix Server;Critical server;The major configuration is as below;Configure 2 × 8-core Typical 3.6 to 3.8 GHZ , 16 cores activated;Configure total 384GB enterprise memory, 384GB memory activated;Configure 24×16 GB DDR4 Memory;Configure Storage Backplane with Zero DASD 8 SAS 2.5" HDD/SDD Controllers;Configure total 1600GB enterprise disk Capacity; Configure 2×Mainstream 800 GB SSD NVMe U.2 module; Configure 1×PCIe2 4-port 1GbE Adapter;Configure 4×Power Supply - 2000W for Server ;Configure 4×Power Cord To PDU/UPS, ;Configure Language Group Specify - Simplified Chinese ;',
     quantity: 1,
     solution: {
       schemaID: '4e1444a2-066d-474f-b542-70185e19c443',
     },
     componentList: [
       {
         FCCode: '9040-MR9',
         PNCode: '9040-MR9',
         cfgType: '',
         discountRMB: 0,
         discountUSD: 0,
         listpriceRMB: 3315000,
         listpriceUSD: 442000,
         nameCHN: 'K1 Power E950',
         nameENG: 'K1 Power E950',
         placeDef: '',
         placeGroup: '',
         quantity: 1,
         serverCategory: 'K1 Power',
         serverModel: '9040-MR9',
         serverName: 'K1 Power E950',
         serverPN: 'FUH-9040MR9-0000',
         status: 0,
         subType: 'Machine',
         type: 'FC_MODEL',
         uuid: 'b3fa3790-9a19-47a1-83e0-0ae42f30da07', //对应表中的configID和schemaID
         version: 1,
       },
     ],
   };
   ```

3. 点击保存调用handleDoImport 方法 内部调用api.configurator.saveConfig(this.importConfig)方法

   api 实际调用 src\util\configurator\index.js 生成Configurator类 中的SaveConfig 方法

   生成config 保存在t_config_info表

   生成list保存在t_config_component

   生成对应的temp 保存在t_schema_product_list

> 以上是新建的 更新和update则是对应的更新schemaID和configID对应的数据

#### ImportIPC的操作

JSZip.loadAsync-》加载zip文件，

zip.files['_d_i_p_s_c_'].async('string')-》获取_d_i_p_s_c_文件的字符串

convert.Decode(cfr)-》先用toStr() 方法将文件字符串转为buffer对象，再使用toString方法转为utf-8的字符串-》传入decode解码

decode(inputString)-》这里需要先说下编码的过程  ，而解码就是反向的编码。

### 导出IPC

ExportMachineIPC 方法接收machine -》findDad(machine)-》从数据库里从新查一遍再拼接一个machine数据

GenIPCFile方法接收参数machine :  

```js
async function GenIPCFile(data) { // machine
  let convert = new Convert()
  let zip = new JSZip();
  if (typeof data === 'object') {
    let cfr = new CFR();
    cfr.ParseMachine(data); //转化cfr对象 {body,footer,header}
     // 这里创建了两个经过编码的文件 第一个是cfr 字符串 ，第二个是机器配置的序列化josn字符串
    zip.file(`_d_i_p_s_c_`, convert.Encode(cfr.Print()), { binary: true });
    zip.file(`_d_i_p_s_m_`, convert.Encode(JSON.stringify(data)), { binary: true });
    // 创建压缩文件的blob对象 接下来调用SaveAs方法下载
    return await zip.generateAsync({ type: "blob", mimeType: "application/ipc" })
  } else if (typeof data === 'string') {
    zip.file(`_d_i_p_s_c_`, convert.Encode(data), { binary: true });
    return await zip.generateAsync({ type: "blob", mimeType: "application/ipc" })
  }
}
```

Encode方法

```js
 // 第一步编码：使用encodeURIComponent对cfr字符串编码        再传入encode方法
Encode(inputString) { return toBinary(this.encode(encodeURIComponent(inputString))) }
// 第四步编码：使用Buffer.alloc转化 buffer对象 添加%再转字符串
const toBinary = (str) => {
  return Buffer.alloc(str.length, str).join('%') // 转化为Buffer对象(ArrayBuffer)再用%拼接成字符串
}
```

encode方法 (base64编码)

> 参考：<http://www.ruanyifeng.com/blog/2008/06/base64.html>

```js
// base64编码
encode(inputString) {
    let output = ''
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4
    let i = 0
    inputString = utf8Encode(inputString)
    // 第三步编码： 
    while (i < inputString.length) { 
      // 每三个字符为一组 分别为 chr1, chr2, chr3 charCodeAt返回对应的Unicode码
      chr1 = inputString.charCodeAt(i++)  
      chr2 = inputString.charCodeAt(i++)
      chr3 = inputString.charCodeAt(i++)
      // 将三个字符 转化为 四个字符 不足的用 @ 补位
      enc1 = chr1 >> 2     
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63
      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }
      // 拼接编码好的字符
      output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4)
    }
    return output  // 返回编码后的结果(MDAzMTIwMjAxMDIzQ0hOSVBTJTIwJTIwMjAwMzIlMjAyMDA0MTRBUDY3MjM)
  }
// 第二步编码：使用utf-8格式进行编码   因为javascript内部使用utf-16进项存储所以需要先转化utf-8
const utf8Encode = (string) => {
  //string （'003120201023CHNIPS%20%2020032%20200414AP6723%2023%2'）
  string = string.replace(/\r\n/g, '\n') //回车和换行统一替换成 \n
  let utftext = ''
  for (let n = 0; n < string.length; n++) {
    let c = string.charCodeAt(n) // 当前位置Unicode(十进制的)
    if (c < 128) { // 1个字节
      utftext += String.fromCharCode(c)
       //再转回codecfr（'003120201023CHNIPS%20%2020032%20200414AP6723%2023%2'）
    } else if ((c > 127) && (c < 2048)) { //2个字节
      utftext += String.fromCharCode((c >> 6) | 192)
      utftext += String.fromCharCode((c & 63) | 128)
    } else {//3个字节
      utftext += String.fromCharCode((c >> 12) | 224)
      utftext += String.fromCharCode(((c >> 6) & 63) | 128)
      utftext += String.fromCharCode((c & 63) | 128)
    }
  }
  return utftext
}

```

Jszip用法

```js
var zip = new JSZip();         //创建一个zip对象 也就是zip文件
zip.file("Hello.txt", "Hello World\n");    //在内部创建一个hello.txt 文件 内容是Hello World\n
var img = zip.folder("images");      //在内部创建一个images文件夹
img.file("smile.gif", imgData, {base64: true});  //在images文件加中添加一个smile.gif 文件 ，以base64位编码
zip.generateAsync({type:"blob"})     //生成zip的blob对象
.then(function(content) {
    // see FileSaver.js
    saveAs(content, "example.zip");     //下载 （saveAs 就是使用a标签的方式下载）
});
```

## CFR

### 导出过程

> 正常机器使用直接使用cfr.js  而mes机器使用mes文件夹下的index.js再调用cfr.js

ParseMachine方法传入machine-》

### 导出cfr

> tip：下面所有的位都是， 在编辑器中查看，都是位数加1， 就是编辑器中所在的列

new CFR -> 生成 header  body   footer  -》调用实例的 ParseMachine 传入 machine （对应的产品信息），->调用 实例的Print 生成CFR字符串

#### header

固定格式的1-6行

第1行：00行 独立生成 _00Line 对象  setDefault方法对其赋值

第2行：03行 独立生成 _03Line对象  setDefault方法对其赋值

```js
// 分别表示 设置CFR标准 设置创建日期 生成器 ...
003120210302CHNIPS  20032 200414AP6723 23                                                    20210322 ...
// 安全性分类
030Unclassified          
// 固定格式
05         10   Created on 02 Mar, 2021, at 06:48:21PM by iConfig           
05         00   @ Inspur Power Commercial Systems                           
05         00                                                               
```

第1行  

- 00 开头  
- 31 设置CFR标准
- 20210302 设置创建日期
- CHNIPS  设置生成器  // 默认 CHNIPS
- 20032 200414  设置发布日期和版本  //固定为20032 200414
- AP  设置地区
- 672 设置国家数字代码
- 3  设置价格等级 2=GSA定价，0或空白或null=商业定价。此处的3猜测代表IPS定价  // 默认为3
- (空格)   设置输出系统 0或空白=非锁定，将价格发送给OMS。1=锁定，不能定价，不能订购。2=锁定，可以定价，不能订购 // 默认空格
- 2 设置是否包含产品功能描述 0或空白=不包含说明，1=包含说明，2=直接引用CFReport中的描述 // 默认 2
- 3 设置CFR订单类型 0或空白=未知的，1=硬件订单，2=软件订单，3=硬件+软件订单 //默认3
- (40个空格) 14位 设置用户描述 最大长度40 //默认空格
- (2个空格)  81位 设置合并标识 //默认空格
- (1个空格)  92位 设置延迟处理标识 留空=不需延迟处理，1=first of linked CFREPORTs，2=continuation of linked CFREPORTs 3=composite linked CFREPORT 4=composite linked CFREPORT with locking errors. //默认空格
- 20210322 93位  设置过期日期  // 默认当前年月日
- CN  140位 设置国家Code //默认CN
- zh  142位 设置语言 // 默认zh
- 0 165位  CFIN FLAGS，为World trade用户使用，空白=CFIN创建CFR，0=CFIN没有创建CFR（默认值）  //默认0
- 0 166位 CFOUT指标，为World trade用户使用，空白=CFOUT创建CFR，0=CFOUT没有创建CFR（默认值） //默认0

第2行

- 03 开头
- 0Unclassified   安全性分类 安全性分类 // 默认0Unclassified    也可以是xConfidential

其他行

固定格式 时间不同

#### body

流程

Parse方法传入machineInfo   -》 new CFRContent(this._CFR, machineInfo)

##### 核心类 CFRContent

- _07Line
- _01Line
- HardwareLines
- HPOLines
- A6PLines
- SoftwareLines

setDefault -》 parseMachine 生成07行 —》 this.body.Parse 按类型将部件分类-》调用parse xxx 生成对应的cfr部分-》FixLength修复每一行的长度

FixLength修复 header的 _00Line_03Line _0506Lines ，body的07和01行 软硬件的05行（如果有的话），生成footer

07和01行

```js
07   K1 Power S924 -2                                900942A                         
011INITIAL ORDER CONFIGURATION                                                       
```

07行

- 07 开头
- K1 Power S924 -2    第5位    机型信息 占40位
-

01行

- 01开头
- INITIAL ORDER CONFIGURATION  代表这是哪一部分cfr的代码，1=initial order，2=base 3=proposed 4=order transactions //默认 INITIAL ORDER CONFIGURATION

##### 硬件部分

Hardware  由 parseHardware生成数据

```js
// 08行 给机器看的   9009 42A    1 代表42A有1个 ，4650       1代表4650有一个
089009 42A    14650       1777A       1ENS5       1ESC6       1EU0B       1EP1F       1EP4F   ... 
// 95行
95900942A                   000000000            T9009NEW CPU1             765198 20210322
// 所有96行就是硬件的详细配置了 给人看的 
964650                                            [4650]Rack Indicator- Not Factory Integrated
96777A                                            [777A]Indicator for Inspur Power servers
...
```

 HPO 由 parseHPO生成数据

```js
// 跟硬件部分相同 HPO (预装软件) 也属于硬件
085313 HPO    10631       10967       15000       15989       19209       11072       1
955313HPO                   000000000           NT9009NEW CPU0             765198 20210322  ...
960631                                            [0631]9009-42A Routing Code
960967                                            [0967]Base OS
...
```

##### 软件部分

A6P 由 parseSoftwareA6P生成数据

```js
// 45行给机器看的  5692A6P    1代表5692A6P有1个 ，1101       1代表1101有一个
475692A6P    11101       13450       12313       12315       12508       13435       ...
// 95行 96行同上
955692A6P                   000000000           NT9009NEW CPU0             765198 20210322   ...
961101                                            [1101]DVD Process No Charge
...
```

Software 和 SWMA （软件和维保 ）由parseSoftwareAndSWMA生成数据

```js
// 数据同上
475773SM3    11252      109000       1
955773SM3                   000000000           NT9009NEW CPU0             765198 20210322                                                    3-Year SWMA for 5765-C34/E61/E62/G03/G62/G98  // 这是95行
961252                                            [1252]Per Processor 3 Yr SWMA Small Power 7 Reg
969000                                            [9000]SWMA Renewal Registration
```

#### footer

```js
// 98行  header行数 + body 行数
98   62
// 99行 用前面所有行的数组进行加密 生成校验码
993761877396
```

算法：[GenCheckSum(点击跳转)](#divtop)

#### Print

打印当前的信息，依次输出header，body，footer的content 用换行符拼接

### 导出 MES CFR（待完成）

### ForceUpdate(更新)

cfrString （cfr字符串）-》/n换行符截取成数组-》lines-》去掉05和06开头的元素，-》去掉98行和后面的（尾部）-》new Line(311)生成00行对象-00Line》lines[_00LineIndex]赋值 给`_00Line`-》将00行的时间更新-》以03行_03LineIndex为界将lines数组分割为prepend 和append-》从新生成三个05行-》从新拼接新的lines -》 调用GenCheckSum方法更新底部合计-》98行：7个字符 98 后面跟lines.length+1 -》99行：7个字符 99 后面跟合计的编码结果   -》最后 return lines.join('\n')

#### <a  name="divtop">GenCheckSum</a>（获取footer生成校验码）

```js
static GenCheckSum(lines) {
    let footer = []
    let _98Line = new Line(7)
    _98Line.WriteStrAtIndex('98', '0')
    _98Line.WriteStrBeforeEnd(lines.length + 1 + '')
    footer.push(_98Line.words)
    let _99Line = new Line(12)
    _99Line.WriteStrBeforeEnd(CheckSumLines(lines.concat(footer)) + '')//合计的编码结果
    _99Line.WriteStrAtIndex('99', '0')
    footer.push(_99Line.words) 
    return footer
  }
```

### CheckSumLines (校验码算法)

总的流程

1. 获取每一行的每个字符对应的字符对应的ASCII码

2. GetHash使用预设ASCIICODETABLE 获取每个字符对应的值

3. 然后* mask :每4个字符为一组分别乘16777216、65536、256、1

4. 将每次计算后的值求和得到checksum

5. checksum再转化为二进制

6. 判断二进制的字符串length大于32的话，就处理成32位

7. 再转回10进制数字， 并返回这个数字

传入lines-》设置checksum合计为0 -》遍历lines-》使用calcLine相加每行的编码后的合计-》checksum.toString(2)转化为2进制-》判断转化后的字符串是否超过32位-》超过就-》从后向前截取32位-》转为位数字赋值checksum-》返回checksum

```js
CheckSumLines(lines = []) {
  let checksum = 0
  lines.forEach(value => {
    checksum = calcLine(value, checksum) //calcLine 对应流程1-4，得到checksum
  })
  let str = checksum.toString(2);        // 对应流程的5-7
  if (str.length > 32) {
    str = str.slice(str.length - 32)
    checksum = parseInt(str, 2)
  }
  return checksum
}
```

##### calcLine

参1：当前行的字符串line，参2：checksum -》遍历通过array.form返回line的ASCII码的数组bytesList(调整位数为4的整数倍)-》bytesList每四个为一组进行遍历-》使用GetHash返回对应的自定义码hashCode-》mask初始值为16777216-》 checksum += mask * hashCode-》mask /= 256

```js
   let bytesList = Array.from(
    { length: Math.ceil(line.length / 4) * 4 },
    (v, i) => line.charCodeAt(i) || 1
  )
  // 将每行：按每个字符拆分并返回对应的ASCII组成数组，并且调整length为4的整数倍
    while (true) {
        let mask = 16777216
        let x = bytesList.splice(0, 4) //每四个为一组
        if (x.length === 0) { break } //分不了 就退出循环
        x.forEach(code => {
          let hashCode = GetHash(code) // 获取对应码
          checksum += mask * hashCode; //一直累加
          mask /= 256; //每个分组里*的mask是不断/256减少的 -》16777216、65536、256、1
        })
      }
```

##### GetHash方法

创建一个ASCIICODETABLE（ASCIICODE 自定义hash对照表 ） -》以奇数偶数的方式区分出key value -》GetHash方法中传入ASCIIcode 和index 默认从0开始-》使用递归的方式进行遍历ASCIICODEKEY-》直到找到对应的ASCIIcode-》返回对应的ASCIIVALUE（自定义的数字）

>0x20 是16进制的数字32，在js中可以直接用0x20 表示32

### line类

new 的时候传入length 生成对应长度的空格字符串，保存在实例对象的words中

#### AutoLength

参数1 targetString， 参数2 length 根据设定的长度返回字符串 ，超过目标字符串的长度后面补空格 ，少于的slice截取

#### WriteStrAtIndex

在定好的位置添加字符串 比如 123456.WriteStrAtIndex(xx,4) 最后得到  1234xx56

## XLSX

导出方案的xlsx 和 当前机器的xslx都是使用 new XLS().Export方法

区别在于参数{machines：[] }中是全部的方案中的机器。还是只有当前机器

### XLS().Export

```js
async Export(solution, options) {
    // Sheet of Summary
    let summarySheet = this.newWorkSheet('汇总')
    let summary = new Summary(solution)
    summarySheet.data = summary.Gen() //获取汇总页的二维数组 用于生成工作表对象
    summarySheet.define = summary.GetDefine() //获取汇总页的公式的单元格对象map（可以直接跟工作表对象进行合并）
    // Sheet of Q and P
    solution.machines.forEach(machine => {
      let sheetname = this.genName(machine.nameCHN)
      let sales = this.newWorkSheet(`${sheetname}-销售`) //在worksheets中生成对应名称的{data：[],define:{}}对象
      let order = this.newWorkSheet(`${sheetname}-订单员`)
      let supply = this.newWorkSheet(`${sheetname}-供应链`)
      let buyer = this.newWorkSheet(`${sheetname}-采购员`)
      let quotation = new Quotation(machine)
      sales.data = quotation.Gen('sales')   //获取二维数组
      sales.define = quotation.GetDefine()  //获取公式项的单元格对象
      order.data = quotation.Gen('order')
      order.define = quotation.GetDefine()
      supply.data = quotation.Gen('supply')
      supply.define = quotation.GetDefine()
      buyer.data = quotation.Gen('buyer')
      buyer.define = quotation.GetDefine()
      // let procurement = new Procurement(machine)
      // this.newWorkSheet(`${sheetname}-采购员`).data = procurement.Gen()
    })
    this.packSheets()
    return this.create()
  }
 packSheets() { 
    this._sheetsIndex.forEach(sheetname => {
      let worksheet = XLSX.utils.aoa_to_sheet(this.worksheets[sheetname].data)//生成工作表对象
      worksheet = { ...worksheet, ...this.worksheets[sheetname].define }//合并工作表对象 之前生成的公式进行合并
      XLSX.utils.book_append_sheet(this.workbook, worksheet, sheetname);//工作表对象添加的工作簿workbook中
    })
  }
```

### Summary (汇总页)

#### this.defines 公式单元格汇总

#### Gen

```js
Gen() {
    let header = this.genHeader()
    this.targetRow += header.length
    let total = this.genTotal()
    this.targetRow += total.length
    let detail = this.genProductDetail()
    this.targetRow += detail.length
    return [].concat(header, total, detail)
  }
```

header

![image-20201215133040391](https://bitbw.top/public/img/my_gallery/image-20201215133040391-1608010492671.png)

total

![image-20201215133718173](https://bitbw.top/public/img/my_gallery/image-20201215133718173.png)

detail

![image-20201215133833320](https://bitbw.top/public/img/my_gallery/image-20201215133833320.png)

##### genTotal

```js
genTotal() { // 分别获取定位  this.targetRow 时是13  而对应值的计算分别放在对应的数组中
    this.productTotalCountPosition = `D${this.targetRow + 2}`  // 对应productTotalCount
    this.totalListPriceRMBPosition = `B${this.targetRow + 4}` //对应totalListPrice 
    this.totalSalePriceRMBPosition = `C${this.targetRow + 4}` //对应totalSalePrice
    this.totalSalePriceTaxRMBPosition = `D${this.targetRow + 4}` // ...
    this.totalListPriceUSDPosition = `B${this.targetRow + 5}`
    this.totalSalePriceUSDPosition = `C${this.targetRow + 5}`
    this.totalSalePriceTaxUSDPosition = `D${this.targetRow + 5}`
   ...
  }
```

##### genProductDetail

折后价格 = 列表价格 *（1 - 折扣率）

成交价 = 折后价格 *（1 + 执行税率(D4)）

单台总价 = SUM( 硬件， 软件 ，服务)    // SUM(B${this.targetRow + 13 + index *19}:B${this.targetRow + 15 + index* 19})

总价 = 单台总价*数量(D3)

```js
  this.machines.forEach((machine, index) => {
      ...
      // 这里将需要汇总的定位全放到数组中 最后在GetDefine中合并到this.defines
      // 关于这里为什么用index *19 因为每个机器的明细（detail） 都占19行， 多个机器依次向下添加 对应的detail（19行）
   this.totalListPriceRMB.push(`B${this.targetRow + 11 + index * 19}`)
      this.totalSalePriceRMB.push(`D${this.targetRow + 11 + index * 19}`)
      ...
      // 合并当前detail的需要公式单元格
      this.defines = { ...this.defines, ...define }
  }
```

#### GetDefine

将总的汇总都在这里合成

```js
 GetDefine() {
     // this.productTotalCount ['D31',...]
    this.defines[this.productTotalCountPosition] = { t: 'n', f: `SUM(${this.productTotalCount.join(',')})` }
    this.defines[this.totalListPriceRMBPosition] = { t: 'n', f: `SUM(${this.totalListPriceRMB.join(',')})` }
 ...
    return this.defines
     //{ B17: {t: "n", f: "SUM(B31)"} , B18: {t: "n", f: "SUM(B37)"},B30: {t: "n", f: "SUM(B27:B29)"},...}
  }
```

### genName

```js
  genName(name) {
    name = this.cutName(name) // 去除 ][*?/\ 这些字符 并截取27位 
    // 判断在不在namelist 从后检索可以找到最后一次出现的次数
    let index = this._backupNameList.lastIndexOf(name)
    // 在不在都推进去
    this._backupNameList.push(name)
    // 如果已经存在这个名字了
    if (index > -1) {
      // nowIndex: 获取上一次出现的次数 + 1
      let usedIndex = this._usedIndexList[index]
      let nowIndex = parseInt(usedIndex) + 1
      // 超过27位就截取
      if ((name + nowIndex).length < 27) {
        name = name + '_' + nowIndex
      } else {
        name = name.slice(0, 26 - (nowIndex + '').length) + '_' + nowIndex
      }
      // 放入这是第几次出现
      this._usedIndexList.push(nowIndex)
    } else {
      // 没出现过记次数为0
      this._usedIndexList.push(0)
    }
    return name //返回修改好的名字
  }
```

![image-20201215111528918](https://bitbw.top/public/img/my_gallery/image-20201215111528918-1608010490368.png)

### Quotation

#### constructor

构造函数初始化

```js
constructor(machine) {
    this.machine = machine 
    this.model = this.machine.serverModel.split('-')[0]
    this.mode = this.machine.mesConfigID ? 'MES' : 'NewBox'
    this.defines = {}
    // mes 的 target 或者 newbox 的内容 
    this.targetInfo = this.grepComponents(this.machine.components) 
    /**
    a6pList: (10) [ {…}] 光盘信息 components
    hpoList: []    软件预装 components
    hwList: (21)[{…}, {…}] 硬件 components
    swList: (9)[{…}, }]   软件components
    swList4MES: (2) [{…}, {…}]  软件的解析后的对象
     { auto: [],
     base: {
     entity:  {…},                  //本体 AIX7.x标准版 或者 PowerVM企业版
     cps: Array(1),                 //软件部件 （AIX7标准版激活码）
     swma: {…},                     //维保 （3年维保）
     swmacps: Array(2),             //维保部件（AIX7标准版 3年支持服务（10），注册AIX服务支持）
     actquantity: 10                //激活数量
     },
     mes: [] }
    **/
    this.changeInfo = { hwList: [], swList: [] } // mes 的 To Be Install
    if (this.mode === 'MES') {
      this.sourceInfo = this.grepComponents(this.machine.mesConfig.components) // mes 的 base
      this.changeInfo.hwList = this.mesHW()
      let sw = this.mesSW()
      sw.forEach(sw => {
        this.changeInfo.swList.push(sw.main)
        sw.cps.forEach(cp => {
          this.changeInfo.swList.push(cp)
        })
      })
      this.changeInfo.a6pList = this.mesA6P()
    }
  }
```

#### Gen

返回data二维数组

```js
  Gen(type = 'sales') {
    switch (type) {
      case 'sales':    //销售
        return this.Gen4Sales()
      case 'order':    //订单员
        return this.Gen4Order()
      case 'supply':   //供应链
        return this.Gen4Supply()
      case 'buyer':    //采购员
        return this.Gen4Buyer()
      default:
        break;
    }
  }
  Gen4Sales() {
    this.type = 'sales'
    return this.genQuotation()
  }
  Gen4Order() {
    this.type = 'order'
    return this.genQuotation()
  }
  Gen4Supply() {
    this.type = 'supply'
    return this.genSupply()
  }
  Gen4Buyer() {
    this.type = 'buyer'
    return this.genBuyer()
  }
  GetDefine() {
    return this.defines
  }
```

#### genQuotation

销售和订单员公用的生成方法

```js
  //销售和订单员公用的生成方法
genQuotation() {
    this.defines = {}
    let rows = []
    let title = this.genQuotationTitle()     
    //配置信息 表单日期 方案ID 表单ID 订单类型  价格版本 配置名称 序列号 数量
    let tableHeader = this.genQuotationTableHeader() 
    //表头    Model FCCode PNCode 数量 描述 列表价(RMB) 列表价(USD)
    let tableBody = this.genQuotationTableBody()
    //部件列表   9009 42A 9009-42A 1 K1 Power S924 960750 128100 ...
    let tableFooter = this.genQuotationTableFooter() 
    // 底部汇总  单价 数量 总价
    rows = rows.concat(title, tableHeader, tableBody, tableFooter)
    //this.totalLines 部件的行数
    let start = rows.length - 4 - this.totalLines // start部件列表的开始位置
    let end = rows.length - 4 - 1      // end部件列表的结束位置
    let calcList = []
    for (let index = start; index <= end; index++) {
      // PATCH for listprice < 0  如果有数量小于0的部件价格让其等于0
      if (rows[index][3] < 0) {
        rows[index][5] = 0
        rows[index][6] = 0
      }
      calcList.push(index + 1) // 将部件列表每一行的行数都放到数组中 用于join
    }
    // 尾部公式添加到this.defines中
    // RMB 单价 = 部件列表中所有的RMB价格相加
    // 数量 = 机器数量（B10）
    // 总价 = 单价 * 数量
    this.defines[`B${rows.length - 1}`] = { t: 'n', f: `SUM(F${calcList.join(',F')})` } //RMB单价
    this.defines[`B${rows.length}`] = { t: 'n', f: `SUM(G${calcList.join(',G')})` }  //USD单价
    this.defines[`C${rows.length - 1}`] = { t: 'n', f: `B10` }       //数量
    this.defines[`C${rows.length}`] = { t: 'n', f: `B10` }
    this.defines[`D${rows.length - 1}`] = { t: 'n', f: `B${rows.length - 1}*C${rows.length - 1}` }//RMB总价
    this.defines[`D${rows.length}`] = { t: 'n', f: `B${rows.length}*C${rows.length}` }     //USD总价
    return rows
  }
```

![image-20201216151950077](https://bitbw.top/public/img/my_gallery/image-20201216151950077.png)

## 首页工具功能

### XLSX 2 CFR

ConvertXLSX2CFR-》Convert.XLSX2CFR（文件路径）返回cfr

```js
function XLSX2CFR(path) {
  let workbook = ReadXLSX(path)
  let worksheet = workbook.Sheets[workbook.SheetNames[0]]; //汇总表
  let scan = true
  let row = 1
  let components = []
  let rowType = ''
  while (scan) {
    let indexList = {
      model: `A${row}`,
      FCCode: `B${row}`,
      quantity: `C${row}`,
      name: `D${row}`,
    }
    row++
    if (!Object.hasOwnProperty.call(worksheet, indexList.model)) {
      scan = false;
      break;
    }
    if (worksheet[indexList.model] && worksheet[indexList.FCCode] === undefined && worksheet[indexList.quantity] === undefined && worksheet[indexList.name] === undefined) {
      rowType = worksheet[indexList.model].v
      continue;
    }
    components.push({
      model: `${worksheet[indexList.model].v}`,
      FCCode: worksheet[indexList.FCCode].v.length === 3 ?
        `${worksheet[indexList.model].v}-${worksheet[indexList.FCCode].v}` :
        `${worksheet[indexList.FCCode].v}`,
      quantity: worksheet[indexList.quantity].v,
      nameENG: worksheet[indexList.name].v,
      type: rowType === 'HW' ? 'FC_HARDWARE' : 'FC_SOFTWARE',
      subType: rowType
    })
    if (rowType === 'SW') {
      rowType = 'SW_COMPONENT_SW'
    }
    if (rowType === 'SWMA') {
      rowType = 'SWMA_COMPONENT'
    }
  }
  let cfr = new CFR()
  cfr.ParseMachine({
    nameCHN: 'auto convert from xlsx by iconfig',
    components: components
  })
  return cfr.Print()
}
```

### CFR 2 IPC

ConvertCFR2IPC-》Convert.CFR2IPC（文件路径） 返回cfr的buffer文件对象，

```js
 let cfrdata = await Convert.CFR2IPC(result.filePaths[0]); // buffer文件对象 cfrdata.toString() 转为cfr字符串
    return await GenIPCFile(cfrdata.toString()).then(async content => {
        // 这里因为只有cfr字符串 GenIPCFile 只将cfr放到了压缩文件中 导出的ipc就只有一个cfr
      return await SaveAs(genCFR2IPCName(), content);
 });
```

### IPC 2 CFR

ConvertIPC2CFR-》Convert.IPC2CFR（文件路径）

```js
async function IPC2CFR(path) {
  let config = await ImportIPCFile(fs.readFileSync(path)) //将ipc解压后解码获取内部文件 cfr 和 ipc 返回到config中
  return config.cfr // 直接返回内部cfr即可
}
```

## APP更新

### 本地更新

#### app本地更新(更新user库和rule文件)

#### 对比更新

- 首先判断本地是否有user库 没有直接将工作目录下的file/init下的数据放到对应的本地版本对应的文件夹中

- 通过通过  main.js 的Check 检查 本地userDB的t_local_setting表中version  是否小于  本项目工作目录里的user库的t_local_setting表中version

如果小于：执行updateApp方法

#### updateApp

updateApp   方法在 src\update\index.js 实现： 方法会直接将将工作目录下的file/init 除了user库和sys库已外的文件直接替换本地目录下的对应文件，然后根据版本号执行对应sql语句修改本地user库（user用户库不能直接替换有修改的地方 在版本更新中执行sql）并更新本地user库中的版本号

### 远程更新

>app 的远程更新 使用electron-updater插件实现    autoUpdater 可以实现自动检查更新 前提是使用对应的方式

主要方法在 src\update\remoteUpdate.js 中

#### 必要条件

vue.config.js

```json
    appId: package.name,   // id 自己生成就可以
    releaseInfo: {
       // 发行说明 将添加到 latest.yml 中在 autoUpdater 的 update-available 和 update-downloaded 事件中可以获取到
      releaseNotes:"xxxx",  
    },
    publish: {
      provider: "generic",
      url,     //更新地址这里可以固定一个，等调用updater再传入url
    },
```

#### 更新提示界面

>src\components\mainframe\updater.vue

在mounted 中 sys库更新后 发出检查更新事件  对应触发各个阶段的 handle

通过调用 ipcRenderer 的方法向主进程通信

```js
import {
  onUpdateMessage,      // 监听更新的各个事件
  sendCheckForUpdate,  // 发送执行检查更新的通知  调用 autoUpdater.checkForUpdates() 
  sendStarDownload,   // 发送开始下载的通知   调用 autoUpdater.downloadUpdate()
  sendQuitAndInstall,  // 发送退出程序并开始安装  调用 autoUpdater.quitAndInstall()
  sendReplaceSysDB   // 发送请求远端数据库替换本地的通知 传入url
} from "@/bridge/ipcRenderer"; // 调用渲染进程方法
```

## sys库更新

file/init/iconfig_sys.config

>src\components\mainframe\updater.vue

- checkSysDBVersion -> 首先加载本地sys库的version 数据  然后请求远程版本version 信息
- 远程版本信息 （请求价格版本和部件版本）有三种情况
  - 返回的都是null 就没办法更新 直接退出sys库更新
  - 返回的有一个是null  就直接拿url请求替换
  - 返回两个版本信息  三种情况
    - 本地没有版本信息 那就直接请求替换
    - 分别对比价格和部件版本任何一个小于线上就 请求替换
    - 不小于线上版本 不执行操作

如果需要更新调用 sendReplaceSysDB 传入url 进行更新操作

## 可能优化的点

#### 问题

rule文件的语言是自己写的语言解析器，没有详细的文档，后期维护很麻烦

#### 优化

rule文件字符串语言改用js ，js内部导出server，

GetProductRule方法时使用eval(ruleStr),获取导出的这个server ，其他用法就跟之前一致 ，

server内部实现数据的挂载，检查时调用server内部的 check方法进行检查

<http://192.168.1.104:8888/IConfig_TEST/iConfig_ADMIN_TEST> Setup 1.6.0-local03.exe
