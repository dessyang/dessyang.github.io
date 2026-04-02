import { createApp, ref, computed, watch } from '../../script/vue.esm-browser.prod-3.5.31.js'
import loadTemplate from '../../utils/load_template.js'

loadTemplate('./rate-template.html').then(template => {
    createApp({
        setup() {
            // 本地存储读取
            const finalAmount = ref(localStorage.getItem('finalAmount') || '1.99')
            const feeItems = ref(JSON.parse(localStorage.getItem('feeItems')) || [
                { name: '服务费', type: 'rate', value: 0.6, min: 0.01, max: 0 }
            ])

            // 保存到本地
            const saveAll = () => {
                localStorage.setItem('finalAmount', finalAmount.value)
                localStorage.setItem('feeItems', JSON.stringify(feeItems.value))
            }

            // 添加/删除
            const addItem = () => {
                feeItems.value.push({ name: '新费用', type: 'rate', value: 0, min: 0, max: 0 })
                saveAll()
            }
            const delItem = (i) => {
                feeItems.value.splice(i, 1)
                saveAll()
            }

            // 计算各项费用（展示用）
            const feeTexts = ref([])
            const getFeeText = (i) => feeTexts.value[i] || '0.00'

            // 核心计算
            const calcAll = () => {
                const F = parseFloat(finalAmount.value) || 0

                // 固定费用总和
                let fixedTotal = 0
                feeItems.value.forEach(it => {
                    if (it.type === 'fixed') fixedTotal += parseFloat(it.value) || 0
                })

                let real = Math.max(F - fixedTotal, 0)
                let totalFee = fixedTotal

                feeTexts.value = []

                feeItems.value.forEach(it => {
                    if (it.type !== 'rate') {
                        feeTexts.value.push('')
                        return
                    }
                    const v = parseFloat(it.value) || 0
                    const min = parseFloat(it.min) || 0
                    const max = parseFloat(it.max) || 0

                    let fee = real * v / 100
                    if (max > 0) fee = Math.min(fee, max)
                    fee = Math.max(fee, min)
                    totalFee += fee
                    feeTexts.value.push(`≈ ${fee.toFixed(2)}`)
                })

                real = Math.max(F - totalFee, 0)
                const realRate = F > 0 ? (totalFee / F) * 100 : 0

                // 结果
                resFinal.value = F.toFixed(2)
                resFee.value = totalFee.toFixed(2)
                resTotalRate.value = realRate.toFixed(2) + '%'
                resReal.value = real.toFixed(2)

                saveAll()
            }

            // 结果
            const resFinal = ref('0.00')
            const resFee = ref('0.00')
            const resTotalRate = ref('0.00%')
            const resReal = ref('0.00')

            // 监听变化自动计算
            watch([finalAmount, feeItems], calcAll, { deep: true })

            // 初始化
            calcAll()

            return {
                finalAmount,
                feeItems,
                addItem,
                delItem,
                getFeeText,
                resFinal,
                resFee,
                resTotalRate,
                resReal
            }
        },
        template
    }).mount('#app')
})