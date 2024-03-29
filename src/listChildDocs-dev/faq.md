# FAQ

> 更新于listChildDocs版本v0.2.0-beta1


### 为什么同步前刷新可能导致同步覆盖？

如果进行自动刷新时并没有和其他设备进行同步，自动刷新后，设备的旧文档将成为最新，下次同步时将覆盖云端的新文档，可能导致其他设备的编辑丢失。

> 模式为`默认`、`挂件beta`（目录列表在挂件中展示）时，自动刷新对文档没有修改，不会导致同步覆盖。

<u>单击刷新按钮（会同时保存缓存）、双击刷新按钮（保存挂件设置）仍可能导致同步覆盖，请不要在未同步时进行这些操作。</u>

### 开启自动刷新后，文档中目录列表何时会进行刷新？

> 必须先关闭安全模式，挂件才会对文档中的目录列表进行自动刷新。

- 挂件被加载时（例如以下情景：）

  - 打开挂件所在文档（例如从文档树打开）；
  - 浏览挂件所在文档时，由于文档较长挂件被动态加载；
  - 思源启动时，将恢复上次未关闭的文档，如果这些文档里有挂件，那么也进行刷新；
  - 挂件或所在文档显示在浮窗中。

- 点击页签切换到所在文档时（默认仅windows，可通过修改配置文件`includeOs`更改/禁用）；

### 我已经知晓同步相关风险，应该如何关闭安全模式？

1. 修改`config.js`（或`custom.js`）的`safeMode`为`false`;

【建议同时开启只读安全模式`safeModePlus`】

## 关于自动插入助手（代码片段）

### 自动插入助手有什么用？

自动插入助手可以：
- 自动对空白的父文档插入listChildDocs挂件；
- ~~为父文档加入子文档引用或超链接，并随子文档变化进行更新；~~（开发者未完整测试。除非您愿意参与测试并在测试期间持续备份文档，否则请勿使用）

### 自动插入助手风险说明

- 自动插入助手模式为`插入挂件`：

  （默认）设置为打开空白父文档时触发，**（可能导致文档打开卡顿）**
  
  若设置为创建子文档时触发，**（可能导致文档编辑卡顿）**  

- 自动插入助手模式为`插入链接`、`插入引用块`、`插入自定义`：

  可能导致打开、切换文档卡顿。**开发者未测试，这些模式可能存在其他问题，请勿使用**

如果有多个窗口界面（包括浏览器页面），将同时运行着多个自动插入助手，有可能导致**重复插入挂件/子文档链接**；

出现上述情况，请停止使用自动插入助手。（设置-外观-代码片段-JS 移除代码片段，然后重新启动思源）

### 自动插入助手会在什么时候对文档进行修改？

> 本部分只介绍默认设置下的触发时机，若更改了config.js `helperSettings`，请以配置为准。

- 自动插入助手模式为`插入挂件`：

  打开文档时，将获取该文档的子文档。如果打开的文档有子文档且文档为空（只有空格或空段落块也认为空），则插入挂件；

- 自动插入助手模式为`插入链接`、`插入引用块`、`插入自定义`：
  
  打开任意文档时，获取该文档的子文档，如果发现子文档变动，则进行对应修改。

### 如何使用自动插入助手？

> 开发者未对 `插入链接`、`插入引用块`、`插入自定义` 模式进行完整测试，除非您愿意参与测试并在测试期间持续备份文档，否则请勿使用。

#### 启用

1. 在`config.js`（或`custom.js`）中启用只读安全模式`safeModePlus`（设置为`true`）。

2. 在 设置-外观-代码片段-JS 中添加代码片段（复制以下内容）：

    ```javascript
    import("/widgets/listChildDocs/src/addChildDocLinkHelper.js");
    // 如果挂件位置有更改，需要修改
    // import("/widgets/挂件所在文件夹/src/addChildDocLinkHelper.js");
    ```

#### 禁用

在 设置-外观-代码片段-JS 中删除代码片段，然后重新启动思源。

#### 配置自动插入助手

在`config.js`（或`custom.js`）中修改配置`helperSettings`，具体配置项见`config.js`文件内的说明。