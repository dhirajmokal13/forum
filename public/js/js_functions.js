function replace_special_chars(txt){
    let ra = txt.replace(/>/g,"&gt;")
    let ran = ra.replace(/</g,"&lt;")
    let ram = ran.replace(/ /g,"&nbsp;")
    return ram;
}

const js_functions = {
    replace_special_chars,
}

export default js_functions
