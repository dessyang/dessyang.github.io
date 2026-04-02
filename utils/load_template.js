// loadTemplate 异步加载外部模板
async function loadTemplate(temPath) {
    const res = await fetch(temPath)
    return await res.text()
}

export default loadTemplate