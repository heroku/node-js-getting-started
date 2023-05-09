import * as svg from '@element-plus/icons-vue';
import {App, defineAsyncComponent, nextTick} from "vue";
// 引入组件

const SvgIcon = defineAsyncComponent(() => import('@/components/svgIcon/index.vue'));

export function elSvg(app: App) {
    const icons = svg as any;
    for (const i in icons) {
        // console.log(`ele-${icons[i].name}`)
        app.component(`ele-${icons[i].name}`, icons[i]);
    }
    app.component('SvgIcon', SvgIcon);
}

