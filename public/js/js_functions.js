function replace_special_chars(txt){
    let ra = txt.replace(/>/g,"&gt;")
    let ran = ra.replace(/</g,"&lt;")
    let ram = ran.replace(/ /g,"&nbsp;")
    return ram;
}

const removeScriptTags = text => {
    text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    text = text.replace(/<\/script>/gi, '');
    return text;
}
  
const js_functions = {
    replace_special_chars,
    removeScriptTags
}

export default js_functions
