// 中文搜索支持：lunr 默认只按空白分词，并且会把汉字当作标点去掉，
// 导致中文内容完全搜不到。这里把每个汉字作为一个独立的词来索引和查询。
(function () {
  if (typeof lunr === 'undefined') return;

  var cjk = /[㐀-鿿豈-﫿]/;
  var notWordOrCjk = '[^\\w\\u3400-\\u9fff\\uf900-\\ufaff]+';
  var leading = new RegExp('^' + notWordOrCjk);
  var trailing = new RegExp(notWordOrCjk + '$');
  var defaultTokenizer = lunr.tokenizer;

  var tokenizer = function (obj, metadata) {
    if (obj == null || Array.isArray(obj)) return defaultTokenizer(obj, metadata);

    var str = obj.toString().toLowerCase();
    var tokens = [];
    var push = function (start, end) {
      var tokenMetadata = lunr.utils.clone(metadata) || {};
      tokenMetadata.position = [start, end - start];
      tokenMetadata.index = tokens.length;
      tokens.push(new lunr.Token(str.slice(start, end), tokenMetadata));
    };

    for (var end = 0, start = 0; end <= str.length; end++) {
      var ch = str.charAt(end);
      var isSeparator = end == str.length || ch.match(tokenizer.separator);
      var isCjk = !isSeparator && cjk.test(ch);
      if (isSeparator || isCjk) {
        if (end > start) push(start, end);
        if (isCjk) push(end, end + 1);
        start = end + 1;
      }
    }
    return tokens;
  };
  tokenizer.separator = defaultTokenizer.separator;
  lunr.tokenizer = tokenizer;

  // 默认的 trimmer 用 \W 去掉词首尾的标点，汉字也会被一起去掉；这里改为保留汉字。
  var trimmer = function (token) {
    return token.update(function (s) {
      return s.replace(leading, '').replace(trailing, '');
    });
  };
  trimmer.label = 'trimmer';
  lunr.Pipeline.registeredFunctions.trimmer = trimmer;
  lunr.trimmer = trimmer;
})();

// 主题只在 keyup 时触发搜索。用输入法输入中文或用鼠标粘贴时可能没有对应的 keyup，
// 这里在输入内容变化时补发一次 keyup。
(function () {
  var trigger = function (e) {
    if (e.target.id === 'search-input' && !e.isComposing) {
      e.target.dispatchEvent(new KeyboardEvent('keyup'));
    }
  };
  document.addEventListener('input', trigger);
  document.addEventListener('compositionend', trigger);
})();
