import { serverApi } from 'siyuan';

export async function main(){
    let parentId = getDocid();
    let [box, path] = await getParentDoc(parentId);
    let data = '';
    data = await createIndex(box, path, data);
    if(data != '')
        insertData(parentId, data);
    else
        await serverApi.pushErrMsg(null, '当前文档下无子文档', 2000);
}

//获取当前文档信息
async function getParentDoc(parentId){
    let result = await serverApi.sql(`SELECT * FROM blocks WHERE id = '${parentId}'`);
    //返回值为数组
    let box = result[0].box;
    let path = result[0].path;
    return [box, path];
}

//获取当前文档id
function getDocid(){
    return document.querySelector('.layout__wnd--active .protyle.fn__flex-1:not(.fn__none) .protyle-background')?.getAttribute("data-node-id");
}

async function requestSubdoc(notebook, path){
    let result = serverApi.request('/api/filetree/listDocsByPath', {
        notebook : notebook,
        path : path
    });
    let data = await serverApi.parseBody(result);
    if(data == null) return [];
    return data.files;
}

function getSubdocIcon(icon, hasChild){
    if(icon == '' || icon == undefined)
        return hasChild ? "📑" : "📄";
    else
        return String.fromCodePoint(parseInt(icon, 16));
}

//创建目录
async function createIndex(notebook, ppath, data, tab = 0) {

    let docs = await requestSubdoc(notebook, ppath);
    tab++;
    //生成写入文本
    for (let doc of docs) {

        let id = doc.id;
        let name = doc.name.slice(0, -3);
        let icon = doc.icon;
        let subFileCount = doc.subFileCount;
        let path = doc.path;
        for(let n=0;n<tab;n++)
            data += '  ';
        data += `* ${getSubdocIcon(icon, subFileCount != 0)}[${name}](siyuan://blocks/${id})\n`;

        if (subFileCount > 0) {//获取下一层级子文档
            data = await createIndex(notebook, path, data, tab);
        }

    }
    return data;
}

async function insertData(id, data){
    await serverApi.prependBlock(id, 'markdown', data);
}