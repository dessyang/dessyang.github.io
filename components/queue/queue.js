import { createApp, ref, computed } from '../../script/vue.esm-browser.prod-3.5.31.js';
import loadTemplate from '../../utils/load_template.js';

loadTemplate('./queue-template.html').then(template => {
    createApp({
        setup() {
            const taskList = ref(JSON.parse(localStorage.getItem('taskQueueData')) || [
                { username: "张三", taskName: "日常代肝", minute: 30, status: "待处理" },
                { username: "李四", taskName: "副本通关", minute: 20, status: "进行中" },
                { username: "王五", taskName: "日常清体力", minute: 15, status: "已完成" },
                { username: "赵六", taskName: "活动任务", minute: 25, status: "已取消" }
            ]);

            const statusList = ["待处理", "进行中", "已完成", "已取消"];

            const statusClass = (status) => {
                switch (status) {
                    case "待处理": return "bg-blue-100 text-blue-800";
                    case "进行中": return "bg-orange-100 text-orange-800 font-medium";
                    case "已完成": return "bg-green-100 text-green-800";
                    case "已取消": return "bg-gray-100 text-gray-500 opacity-70";
                    default: return "";
                }
            };

            const sortTasks = () => {
                const weight = { "进行中": 0, "待处理": 1, "已完成": 2, "已取消": 99 };
                taskList.value.sort((a, b) => (weight[a.status] || 99) - (weight[b.status] || 99));
            };

            const save = () => {
                localStorage.setItem('taskQueueData', JSON.stringify(taskList.value));
            };

            const totalTime = computed(() => {
                return taskList.value.filter(t => t.status !== "已完成").reduce((sum, t) => sum + (Number(t.minute) || 0), 0);
            });

            const finishTime = computed(() => {
                if (totalTime.value <= 0) return "-";
                const end = new Date(Date.now() + totalTime.value * 60000);
                return end.toLocaleString();
            });

            const addTask = () => {
                taskList.value.push({ username: "", taskName: "新任务", minute: 10, status: "待处理" });
                sortTasks();
                save();
                alert("新增成功");
            };

            const delTask = (i) => {
                taskList.value.splice(i, 1);
                sortTasks();
                save();
                alert("已删除任务");
            };

            const clearAll = () => {
                if (!confirm("确定清空所有任务？")) return;
                taskList.value = [];
                save();
                alert("已清空");
            };

            const exportJson = () => {
                const blob = new Blob([JSON.stringify(taskList.value, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "queue-data.json";
                a.click();
                URL.revokeObjectURL(url);
                alert("导出成功");
            };

            const importJson = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const data = JSON.parse(ev.target.result);
                        if (Array.isArray(data)) {
                            taskList.value = data;
                            sortTasks();
                            save();
                            alert("导入成功");
                        }
                    } catch {
                        alert("JSON 格式错误");
                    }
                };
                reader.readAsText(file);
            };

            // 初始化排序
            sortTasks();

            return {
                taskList,
                statusList,
                statusClass,
                totalTime,
                finishTime,
                addTask,
                delTask,
                clearAll,
                exportJson,
                importJson,
                save,
                sortTasks
            };
        },
        template
    }).mount('#app');
});