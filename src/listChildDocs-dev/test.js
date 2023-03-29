// 请求函数
function request(url, data = null, method = "POST") {
    return new Promise((resolve, reject) => {
      if (method.toUpperCase() == "POST") {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then(
            (data) => resolve(data.json()),
            (error) => {
              reject(error);
            }
          )
          .catch((err) => {
            console.error("请求失败:", err);
          });
      }
    });
  }
  // 弹出提示信息
  async function showMessage(msg) {
    await request("/api/notification/pushMsg", { msg, timeout: 2000 });
  }
  
  // 获取对应笔记本的ID
  // element是文档树上刚刚点击打开文档时点击的那个元素
  function getDataURL(element) {
    let noteBookID = element.getAttribute("data-url");
    let parent = element.parentElement;
    while (noteBookID == null) {
      noteBookID = parent.getAttribute("data-url");
      parent = parent.parentElement;
    }
    return noteBookID;
  }
  
  // 插入子文档导航
  async function insertSubDocList() {
    // 文档树上刚刚点击的那个文档对应的元素
    const navigationFile = document.querySelector(
      '.fn__flex-1.fn__flex-column.file-tree.sy__file li.b3-list-item.b3-list-item--hide-action.b3-list-item--focus[data-type="navigation-file"]'
    );
  
    // 刚打开的文档的path值，示例："/20200812220555-lj3enxa/20210808180320-m0ztypq.sy"
    if (!navigationFile) {
      return false;
    }
    let dataPath = navigationFile.getAttribute("data-path");
    let docID = navigationFile.getAttribute("data-node-id");
    let notebookID = getDataURL(navigationFile);
  
    // 子文档的排序方式
    let sortType = window.siyuan.config.fileTree.sort;
  
    //发送请求获取子文档数据
    let res = await request("/api/filetree/listDocsByPath", {
      notebook: notebookID,
      path: dataPath,
      sort: sortType,
    });
    if (res.code === 0) {
      let subDocsArr = res.data.files;
      if (subDocsArr.length === 0) {
        showMessage("未发现子文档");
        return false;
      }
      let str = "";
      subDocsArr.forEach((subDoc) => {
        let tempArr = subDoc.path.split("/");
        let ID = tempArr[tempArr.length - 1].split(".sy")[0];
        let name = subDoc.name.split(".sy")[0];
        str += `* ((${ID} '${name}'))\n`;
      });
  
      // 将子文档列表嵌入当前文档
      let res_insertBlock = await request("/api/block/prependBlock", {
        data: str,
        dataType: "markdown",
        parentID: docID,
      });
      if (res_insertBlock.code === 0) {
        showMessage(`子文档导航嵌入成功`);
      } else {
        showMessage(`嵌入失败！${res}`);
      }
    }
  }
  // 添加一个按钮
  if (!barMode) {
    const barMode = document.getElementById("barMode");
  }
  barMode.insertAdjacentHTML(
    "beforebegin",
    '<div id="insertSubDocList" class="toolbar__item b3-tooltips b3-tooltips__se" aria-label="插入子文档列表" ></div>'
  );
  const insertSubDocListBtn = document.getElementById("insertSubDocList");
  insertSubDocListBtn.style.width = "auto";
  const insertSubDocListBtnIcon = `<svg t="1675499660408" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2740" width="200" height="200"><path d="M913.6 135.2H380.2c-26.7 0-44.4 17.8-44.4 44.4V224c0 26.7 17.8 44.4 44.4 44.4h533.3c26.7 0 44.4-17.8 44.4-44.4v-44.4c0.1-26.6-17.7-44.4-44.3-44.4zM158 135.2h-44.4c-22.2 0-44.4 22.2-44.4 44.4V224c0 22.2 22.2 44.4 44.4 44.4H158c22.2 0 44.4-22.2 44.4-44.4v-44.4c0.1-22.2-22.1-44.4-44.4-44.4zM158 446.3h-44.4c-22.2 0-44.4 22.2-44.4 44.4v44.4c0 22.2 22.2 44.4 44.4 44.4H158c22.2 0 44.4-22.2 44.4-44.4v-44.4c0.1-22.2-22.1-44.4-44.4-44.4zM913.6 446.3H380.2c-26.7 0-44.4 17.8-44.4 44.4v44.4c0 26.7 17.8 44.4 44.4 44.4h533.3c26.7 0 44.4-17.8 44.4-44.4v-44.4c0.1-26.6-17.7-44.4-44.3-44.4zM158 757.4h-44.4c-22.2 0-44.4 22.2-44.4 44.4v44.4c0 22.2 22.2 44.4 44.4 44.4H158c22.2 0 44.4-22.2 44.4-44.4v-44.4c0.1-22.2-22.1-44.4-44.4-44.4zM913.6 757.4H380.2c-26.7 0-44.4 17.8-44.4 44.4v44.4c0 26.7 17.8 44.4 44.4 44.4h533.3c26.7 0 44.4-17.8 44.4-44.4v-44.4c0.1-26.6-17.7-44.4-44.3-44.4z" fill="#91999f" p-id="2741"></path></svg>`;
  insertSubDocListBtn.innerHTML = insertSubDocListBtnIcon;
  insertSubDocListBtn.addEventListener(
    "click",
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      insertSubDocList();
    },
    true
  );