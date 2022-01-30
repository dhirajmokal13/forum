function replace_special_chars(txt){
    let ra = txt.replace(/>/g,"&gt;")
    let ram = ra.replace(/</g,"&lt;")
    return ram;
}

const js_functions = {
    replace_special_chars,
}

export default js_functions