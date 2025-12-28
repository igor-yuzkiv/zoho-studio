function injectScript(file_path, tag = 'body') {
    const node = document.getElementsByTagName(tag)[0]
    const script = document.createElement('script')

    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', file_path)
    node.appendChild(script)
}

;(async () => {
    injectScript(chrome.runtime.getURL('injection.js'), 'body')
})()
