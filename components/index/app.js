import { createApp, ref } from '../../script/vue.esm-browser.prod-3.5.31.js'
import loadTemplate from '../../utils/load_template.js'

// 初始化
loadTemplate("./components/index/index-temp.html").then(template => {
    createApp({
        setup() {
            const navData = ref([
                {
                    title: "排队工具",
                    desc: "用于代肝任务的排队工具",
                    icon: "",
                    url: "components/queue/queue.html",
                    color: "bg-gradient-to-br from-blue-300 to-blue-900 text-white"
                },
                {
                    title: "服务费计算器",
                    desc: "服务费倒扣计算器",
                    icon: "",
                    url: "components/rate/rate.html",
                    color: "bg-gradient-to-br from-red-300 to-red-900 text-white"
                }
            ])

            return { navData }
        },
        template // 外部HTML模板
    }).mount('#app')
})