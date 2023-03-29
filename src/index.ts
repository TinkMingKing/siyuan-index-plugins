import { Plugin, clientApi} from 'siyuan';
import { main } from './createIndex'

export default class IndexPlugin extends Plugin {
    el: HTMLElement;

    constructor() {
        super();
    }

    //插入按钮
    insertIcon(){
        this.el = document.createElement('div');
        this.el.classList.add('toolbar__item', 'b3-tooltips', 'b3-tooltips__se');
        this.el.setAttribute('aria-label', '插入目录');
        this.el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 12H3"></path><path d="M16 6H3"></path><path d="M16 18H3"></path><path d="M18 9v6"></path><path d="M21 12h-6"></path></svg>';
        this.el.addEventListener('click',() => {
            main();
        });
        clientApi.addToolbarRight(this.el);
    }

    onload() {
        this.insertIcon();   
    }

    onunload() {
        this.el.remove();
    }

}