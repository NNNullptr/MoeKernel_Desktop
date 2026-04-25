import _extends from "@babel/runtime/helpers/extends";
import React, { useEffect, useImperativeHandle, useContext, Fragment, useMemo, useRef, useReducer } from "react";
import rehypePrism from "rehype-prism-plus";
import rehypeRewrite, { getCodeString } from "rehype-rewrite";
import rehypeAttrs from "rehype-attr";
import raw from "rehype-raw";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { remarkAlert } from "remark-github-blockquote-alert";
import { jsx, jsxs } from "react/jsx-runtime";
import { visit } from "unist-util-visit";
import slug from "rehype-slug";
import headings from "rehype-autolink-headings";
import rehypeIgnore from "rehype-ignore";
import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/taggedTemplateLiteralLoose";
import { rehype } from "rehype";
import _objectDestructuringEmpty from "@babel/runtime/helpers/objectDestructuringEmpty";
function copyTextToClipboard(text, cb) {
  if (typeof document === "undefined") return;
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style = {
    position: "absolute",
    left: "-9999px"
  };
  document.body.appendChild(el);
  const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
  el.select();
  let isCopy = false;
  try {
    const successful = document.execCommand("copy");
    isCopy = !!successful;
  } catch (err) {
    isCopy = false;
  }
  document.body.removeChild(el);
  if (selected && document.getSelection) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
  cb && cb(isCopy);
}
function getParentElement(target) {
  if (!target) return null;
  var dom = target;
  if (dom.dataset.code && dom.classList.contains("copied")) {
    return dom;
  }
  if (dom.parentElement) {
    return getParentElement(dom.parentElement);
  }
  return null;
}
function useCopied(container) {
  var handle = (event) => {
    var target = getParentElement(event.target);
    if (!target) return;
    target.classList.add("active");
    copyTextToClipboard(target.dataset.code, function() {
      setTimeout(() => {
        target.classList.remove("active");
      }, 2e3);
    });
  };
  useEffect(() => {
    var _container$current, _container$current2;
    (_container$current = container.current) == null || _container$current.removeEventListener("click", handle, false);
    (_container$current2 = container.current) == null || _container$current2.addEventListener("click", handle, false);
    return () => {
      var _container$current3;
      (_container$current3 = container.current) == null || _container$current3.removeEventListener("click", handle, false);
    };
  }, [container]);
}
var _excluded$3 = ["prefixCls", "className", "source", "style", "disableCopy", "skipHtml", "onScroll", "onMouseOver", "pluginsFilter", "rehypeRewrite", "wrapperElement", "warpperElement", "urlTransform"];
var defaultUrlTransform = (url) => url;
const MarkdownPreview$1 = /* @__PURE__ */ React.forwardRef((props, ref) => {
  var {
    prefixCls = "wmde-markdown wmde-markdown-color",
    className,
    source,
    style,
    disableCopy = false,
    skipHtml = true,
    onScroll,
    onMouseOver,
    pluginsFilter,
    wrapperElement = {},
    warpperElement = {},
    urlTransform
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded$3);
  var mdp = React.useRef(null);
  useImperativeHandle(ref, () => _extends({}, props, {
    mdp
  }), [mdp, props]);
  var cls = (prefixCls || "") + " " + (className || "");
  useCopied(mdp);
  var rehypePlugins = [...other.rehypePlugins || []];
  var customProps = {
    allowElement: (element, index, parent) => {
      if (other.allowElement) {
        return other.allowElement(element, index, parent);
      }
      return /^[A-Za-z0-9]+$/.test(element.tagName);
    }
  };
  if (!skipHtml) {
    rehypePlugins.push(raw);
  }
  var remarkPlugins = [remarkAlert, ...other.remarkPlugins || [], remarkGfm];
  var wrapperProps = _extends({}, warpperElement, wrapperElement);
  return /* @__PURE__ */ jsx("div", _extends({
    ref: mdp,
    onScroll,
    onMouseOver
  }, wrapperProps, {
    className: cls,
    style,
    children: /* @__PURE__ */ jsx(ReactMarkdown, _extends({}, customProps, other, {
      skipHtml: !skipHtml,
      urlTransform: urlTransform || defaultUrlTransform,
      rehypePlugins: pluginsFilter ? pluginsFilter("rehype", rehypePlugins) : rehypePlugins,
      remarkPlugins: pluginsFilter ? pluginsFilter("remark", remarkPlugins) : remarkPlugins,
      children: source || ""
    }))
  }));
});
var reservedMeta = function reservedMeta2(options) {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === "element" && node.tagName === "code" && node.data && node.data.meta) {
        node.properties = _extends({}, node.properties, {
          "data-meta": String(node.data.meta)
        });
      }
    });
  };
};
var retrieveMeta = function retrieveMeta2(options) {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === "element" && node.tagName === "code" && node.properties && node.properties["dataMeta"]) {
        if (!node.data) {
          node.data = {};
        }
        var metaString = node.properties["dataMeta"];
        if (typeof metaString === "string") {
          node.data.meta = metaString;
        }
        delete node.properties["dataMeta"];
      }
    });
  };
};
var octiconLink = {
  type: "element",
  tagName: "svg",
  properties: {
    className: "octicon octicon-link",
    viewBox: "0 0 16 16",
    version: "1.1",
    width: "16",
    height: "16",
    ariaHidden: "true"
  },
  children: [{
    type: "element",
    tagName: "path",
    children: [],
    properties: {
      fillRule: "evenodd",
      d: "M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"
    }
  }]
};
function copyElement(str) {
  if (str === void 0) {
    str = "";
  }
  return {
    type: "element",
    tagName: "div",
    properties: {
      class: "copied",
      "data-code": str
    },
    children: [{
      type: "element",
      tagName: "svg",
      properties: {
        className: "octicon-copy",
        ariaHidden: "true",
        viewBox: "0 0 16 16",
        fill: "currentColor",
        height: 12,
        width: 12
      },
      children: [{
        type: "element",
        tagName: "path",
        properties: {
          fillRule: "evenodd",
          d: "M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"
        },
        children: []
      }, {
        type: "element",
        tagName: "path",
        properties: {
          fillRule: "evenodd",
          d: "M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"
        },
        children: []
      }]
    }, {
      type: "element",
      tagName: "svg",
      properties: {
        className: "octicon-check",
        ariaHidden: "true",
        viewBox: "0 0 16 16",
        fill: "currentColor",
        height: 12,
        width: 12
      },
      children: [{
        type: "element",
        tagName: "path",
        properties: {
          fillRule: "evenodd",
          d: "M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
        },
        children: []
      }]
    }]
  };
}
var rehypeRewriteHandle = (disableCopy, rewrite) => (node, index, parent) => {
  if (node.type === "element" && parent && parent.type === "root" && /h(1|2|3|4|5|6)/.test(node.tagName)) {
    var child = node.children && node.children[0];
    if (child && child.properties && child.properties.ariaHidden === "true") {
      child.properties = _extends({
        class: "anchor"
      }, child.properties);
      child.children = [octiconLink];
    }
  }
  if (node.type === "element" && node.tagName === "pre" && !disableCopy) {
    var code2 = getCodeString(node.children);
    node.children.push(copyElement(code2));
  }
  rewrite && rewrite(node, index === null ? void 0 : index, parent === null ? void 0 : parent);
};
var defaultRehypePlugins = [slug, headings, rehypeIgnore];
const MarkdownPreview = /* @__PURE__ */ React.forwardRef((props, ref) => {
  var _props$disableCopy;
  var rehypePlugins = [reservedMeta, raw, retrieveMeta, ...defaultRehypePlugins, [rehypeRewrite, {
    rewrite: rehypeRewriteHandle((_props$disableCopy = props.disableCopy) != null ? _props$disableCopy : false, props.rehypeRewrite)
  }], [rehypeAttrs, {
    properties: "attr"
  }], ...props.rehypePlugins || [], [rehypePrism, {
    ignoreMissing: true
  }]];
  return /* @__PURE__ */ jsx(MarkdownPreview$1, _extends({}, props, {
    rehypePlugins,
    ref
  }));
});
function reducer(state, action) {
  return _extends({}, state, action);
}
var EditorContext = /* @__PURE__ */ React.createContext({
  markdown: ""
});
var _templateObject;
function html2Escape(sHtml) {
  return sHtml.replace(/[<&"]/g, (c) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;"
  })[c]);
}
function Markdown(props) {
  var {
    prefixCls
  } = props;
  var {
    markdown = "",
    highlightEnable,
    dispatch
  } = useContext(EditorContext);
  var preRef = /* @__PURE__ */ React.createRef();
  useEffect(() => {
    if (preRef.current && dispatch) {
      dispatch({
        textareaPre: preRef.current
      });
    }
  }, []);
  if (!markdown) {
    return /* @__PURE__ */ jsx("pre", {
      ref: preRef,
      className: prefixCls + "-text-pre wmde-markdown-color"
    });
  }
  var mdStr = '<pre class="language-markdown ' + prefixCls + '-text-pre wmde-markdown-color"><code class="language-markdown">' + html2Escape(String.raw(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["", ""])), markdown)) + "\n</code></pre>";
  if (highlightEnable) {
    try {
      mdStr = rehype().data("settings", {
        fragment: true
      }).use(rehypePrism, {
        ignoreMissing: true
      }).processSync(mdStr).toString();
    } catch (error) {
    }
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "wmde-markdown-color",
    dangerouslySetInnerHTML: {
      __html: mdStr || ""
    }
  });
}
function getCommands$1(data, resulte) {
  if (data === void 0) {
    data = [];
  }
  if (resulte === void 0) {
    resulte = {};
  }
  data.forEach((item) => {
    if (item.children && Array.isArray(item.children)) {
      resulte = _extends({}, resulte, getCommands$1(item.children || []));
    } else if (item.keyCommand && item.shortcuts && item.execute) {
      resulte[item.shortcuts.toLocaleLowerCase()] = item;
    }
  });
  return resulte;
}
function shortcutsHandle(e, commands, commandOrchestrator, dispatch, state) {
  if (commands === void 0) {
    commands = [];
  }
  var data = getCommands$1(commands || []);
  var shortcuts = [];
  if (e.altKey) {
    shortcuts.push("alt");
  }
  if (e.shiftKey) {
    shortcuts.push("shift");
  }
  if (e.metaKey) {
    shortcuts.push("cmd");
  }
  if (e.ctrlKey) {
    shortcuts.push("ctrl");
  }
  if (shortcuts.length > 0 && !/(control|alt|meta|shift)/.test(e.key.toLocaleLowerCase())) {
    shortcuts.push(e.key.toLocaleLowerCase());
  }
  if (/escape/.test(e.key.toLocaleLowerCase())) {
    shortcuts.push("escape");
  }
  if (shortcuts.length < 1) {
    return;
  }
  var equal = !!data[shortcuts.join("+")];
  var command = equal ? data[shortcuts.join("+")] : void 0;
  Object.keys(data).forEach((item) => {
    var isequal = item.split("+").every((v) => {
      if (/ctrlcmd/.test(v)) {
        return shortcuts.includes("ctrl") || shortcuts.includes("cmd");
      }
      return shortcuts.includes(v);
    });
    if (isequal) {
      command = data[item];
    }
  });
  if (command && commandOrchestrator) {
    e.stopPropagation();
    e.preventDefault();
    commandOrchestrator.executeCommand(command, dispatch, state, shortcuts);
    return;
  }
}
var browserSupportsTextareaTextNodes;
function canManipulateViaTextNodes(input) {
  if (input.nodeName !== "TEXTAREA") {
    return false;
  }
  if (typeof browserSupportsTextareaTextNodes === "undefined") {
    var textarea = document.createElement("textarea");
    textarea.value = "1";
    browserSupportsTextareaTextNodes = !!textarea.firstChild;
  }
  return browserSupportsTextareaTextNodes;
}
function insertTextAtPosition(input, text) {
  input.focus();
  if (document.selection) {
    var ieRange = document.selection.createRange();
    ieRange.text = text;
    ieRange.collapse(
      false
      /* to the end */
    );
    ieRange.select();
    return;
  }
  var isSuccess = false;
  if (text !== "") {
    isSuccess = document.execCommand && document.execCommand("insertText", false, text);
  } else {
    isSuccess = document.execCommand && document.execCommand("delete", false);
  }
  if (!isSuccess) {
    var start = input.selectionStart;
    var end = input.selectionEnd;
    if (typeof input.setRangeText === "function") {
      input.setRangeText(text);
    } else {
      var range = document.createRange();
      var textNode = document.createTextNode(text);
      if (canManipulateViaTextNodes(input)) {
        var node = input.firstChild;
        if (!node) {
          input.appendChild(textNode);
        } else {
          var offset = 0;
          var startNode = null;
          var endNode = null;
          while (node && (startNode === null || endNode === null)) {
            var nodeLength = node.nodeValue.length;
            if (start >= offset && start <= offset + nodeLength) {
              range.setStart(startNode = node, start - offset);
            }
            if (end >= offset && end <= offset + nodeLength) {
              range.setEnd(endNode = node, end - offset);
            }
            offset += nodeLength;
            node = node.nextSibling;
          }
          if (start !== end) {
            range.deleteContents();
          }
        }
      }
      if (canManipulateViaTextNodes(input) && range.commonAncestorContainer.nodeName === "#text") {
        range.insertNode(textNode);
      } else {
        var value = input.value;
        input.value = value.slice(0, start) + text + value.slice(end);
      }
    }
    input.setSelectionRange(start + text.length, start + text.length);
    var e = document.createEvent("UIEvent");
    e.initEvent("input", true, false);
    input.dispatchEvent(e);
  }
}
function selectWord(_ref) {
  var {
    text,
    selection,
    prefix,
    suffix = prefix
  } = _ref;
  var result = selection;
  if (text && text.length && selection.start === selection.end) {
    result = getSurroundingWord(text, selection.start);
  }
  if (result.start >= prefix.length && result.end <= text.length - suffix.length) {
    var selectedTextContext = text.slice(result.start - prefix.length, result.end + suffix.length);
    if (selectedTextContext.startsWith(prefix) && selectedTextContext.endsWith(suffix)) {
      return {
        start: result.start - prefix.length,
        end: result.end + suffix.length
      };
    }
  }
  return result;
}
function selectLine(_ref2) {
  var {
    text,
    selection
  } = _ref2;
  var start = text.slice(0, selection.start).lastIndexOf("\n") + 1;
  var end = text.slice(selection.end).indexOf("\n") + selection.end;
  if (end === selection.end - 1) {
    end = text.length;
  }
  return {
    start,
    end
  };
}
function getBreaksNeededForEmptyLineBefore(text, startPosition) {
  if (text === void 0) {
    text = "";
  }
  if (startPosition === 0) return 0;
  var neededBreaks = 2;
  var isInFirstLine = true;
  for (var i = startPosition - 1; i >= 0 && neededBreaks >= 0; i--) {
    switch (text.charCodeAt(i)) {
      case 32:
        continue;
      case 10:
        neededBreaks--;
        isInFirstLine = false;
        break;
      default:
        return neededBreaks;
    }
  }
  return isInFirstLine ? 0 : neededBreaks;
}
function getBreaksNeededForEmptyLineAfter(text, startPosition) {
  if (text === void 0) {
    text = "";
  }
  if (startPosition === text.length - 1) return 0;
  var neededBreaks = 2;
  var isInLastLine = true;
  for (var i = startPosition; i < text.length && neededBreaks >= 0; i++) {
    switch (text.charCodeAt(i)) {
      case 32:
        continue;
      case 10: {
        neededBreaks--;
        isInLastLine = false;
        break;
      }
      default:
        return neededBreaks;
    }
  }
  return isInLastLine ? 0 : neededBreaks;
}
function getSurroundingWord(text, position) {
  if (!text) throw Error("Argument 'text' should be truthy");
  var isWordDelimiter = (c) => c === " " || c.charCodeAt(0) === 10;
  var start = 0;
  var end = text.length;
  for (var i = position; i - 1 > -1; i--) {
    if (isWordDelimiter(text[i - 1])) {
      start = i;
      break;
    }
  }
  for (var _i = position; _i < text.length; _i++) {
    if (isWordDelimiter(text[_i])) {
      end = _i;
      break;
    }
  }
  return {
    start,
    end
  };
}
function executeCommand(_ref3) {
  var {
    api,
    selectedText,
    selection,
    prefix,
    suffix = prefix
  } = _ref3;
  if (selectedText.length >= prefix.length + suffix.length && selectedText.startsWith(prefix) && selectedText.endsWith(suffix)) {
    api.replaceSelection(selectedText.slice(prefix.length, suffix.length ? -suffix.length : void 0));
    api.setSelectionRange({
      start: selection.start - prefix.length,
      end: selection.end - prefix.length
    });
  } else {
    api.replaceSelection("" + prefix + selectedText + suffix);
    api.setSelectionRange({
      start: selection.start + prefix.length,
      end: selection.end + prefix.length
    });
  }
}
function insertBeforeEachLine(selectedText, insertBefore) {
  var lines = selectedText.split(/\n/);
  var insertionLength = 0;
  var modifiedText = lines.map((item, index) => {
    if (typeof insertBefore === "string") {
      if (item.startsWith(insertBefore)) {
        insertionLength -= insertBefore.length;
        return item.slice(insertBefore.length);
      }
      insertionLength += insertBefore.length;
      return insertBefore + item;
    }
    if (typeof insertBefore === "function") {
      if (item.startsWith(insertBefore(item, index))) {
        insertionLength -= insertBefore(item, index).length;
        return item.slice(insertBefore(item, index).length);
      }
      var insertionResult = insertBefore(item, index);
      insertionLength += insertionResult.length;
      return insertBefore(item, index) + item;
    }
    throw Error("insertion is expected to be either a string or a function");
  }).join("\n");
  return {
    modifiedText,
    insertionLength
  };
}
var bold = {
  name: "bold",
  keyCommand: "bold",
  shortcuts: "ctrlcmd+b",
  prefix: "**",
  buttonProps: {
    "aria-label": "Add bold text (ctrl + b)",
    title: "Add bold text (ctrl + b)"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    role: "img",
    width: "12",
    height: "12",
    viewBox: "0 0 384 512",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M304.793 243.891c33.639-18.537 53.657-54.16 53.657-95.693 0-48.236-26.25-87.626-68.626-104.179C265.138 34.01 240.849 32 209.661 32H24c-8.837 0-16 7.163-16 16v33.049c0 8.837 7.163 16 16 16h33.113v318.53H24c-8.837 0-16 7.163-16 16V464c0 8.837 7.163 16 16 16h195.69c24.203 0 44.834-1.289 66.866-7.584C337.52 457.193 376 410.647 376 350.014c0-52.168-26.573-91.684-71.207-106.123zM142.217 100.809h67.444c16.294 0 27.536 2.019 37.525 6.717 15.828 8.479 24.906 26.502 24.906 49.446 0 35.029-20.32 56.79-53.029 56.79h-76.846V100.809zm112.642 305.475c-10.14 4.056-22.677 4.907-31.409 4.907h-81.233V281.943h84.367c39.645 0 63.057 25.38 63.057 63.057.001 28.425-13.66 52.483-34.782 61.284z"
    })
  }),
  execute: (state, api) => {
    var newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: state.command.prefix
    });
    var state1 = api.setSelectionRange(newSelectionRange);
    executeCommand({
      api,
      selectedText: state1.selectedText,
      selection: state.selection,
      prefix: state.command.prefix
    });
  }
};
var codeBlock = {
  name: "codeBlock",
  keyCommand: "codeBlock",
  shortcuts: "ctrlcmd+shift+j",
  prefix: "```",
  buttonProps: {
    "aria-label": "Insert Code Block (ctrl + shift + j)",
    title: "Insert Code Block (ctrl + shift +j)"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    width: "13",
    height: "13",
    role: "img",
    viewBox: "0 0 156 156",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M110.85 120.575 43.7 120.483333 43.7083334 110.091667 110.85 110.191667 110.841667 120.583333 110.85 120.575ZM85.1333334 87.1916666 43.625 86.7083332 43.7083334 76.3166666 85.2083334 76.7916666 85.1333334 87.1916666 85.1333334 87.1916666ZM110.841667 53.4166666 43.7 53.3166666 43.7083334 42.925 110.85 43.025 110.841667 53.4166666ZM36 138C27.2916666 138 20.75 136.216667 16.4 132.666667 12.1333334 129.2 10 124.308333 10 118L10 95.3333332C10 91.0666666 9.25 88.1333332 7.7333334 86.5333332 6.3166668 84.8416666 3.7333334 84 0 84L0 72C3.7333334 72 6.3083334 71.2 7.7333334 69.6 9.2416668 67.9083334 10 64.9333334 10 60.6666666L10 38C10 31.775 12.1333334 26.8833334 16.4 23.3333332 20.7583334 19.7749998 27.2916666 18 36 18L40.6666668 18 40.6666668 30 36 30C34.0212222 29.9719277 32.1263151 30.7979128 30.8 32.2666666 29.3605875 33.8216362 28.5938182 35.8823287 28.6666668 38L28.6666668 60.6666666C28.6666668 67.5083332 26.6666668 72.4 22.6666668 75.3333332 20.9317416 76.7274684 18.8640675 77.6464347 16.6666668 78 18.8916668 78.35 20.8916668 79.2416666 22.6666668 80.6666666 26.6666668 83.95 28.6666668 88.8416666 28.6666668 95.3333332L28.6666668 118C28.6666668 120.308333 29.3750002 122.216667 30.8 123.733333 32.2166666 125.241667 33.9583334 126 36 126L40.6666668 126 40.6666668 138 36 138 36 138ZM114.116667 126 118.783333 126C120.833333 126 122.566667 125.241667 123.983333 123.733333 125.422746 122.178364 126.189515 120.117671 126.116667 118L126.116667 95.3333332C126.116667 88.8333332 128.116667 83.9499998 132.116667 80.6666666 133.9 79.2416666 135.9 78.35 138.116667 78 135.919156 77.6468047 133.851391 76.7277979 132.116667 75.3333332 128.116667 72.3999998 126.116667 67.5 126.116667 60.6666666L126.116667 38C126.189515 35.8823287 125.422746 33.8216361 123.983333 32.2666666 122.657018 30.7979128 120.762111 29.9719277 118.783333 30L114.116667 30 114.116667 18 118.783333 18C127.5 18 133.983333 19.775 138.25 23.3333332 142.608333 26.8833332 144.783333 31.7749998 144.783333 38L144.783333 60.6666666C144.783333 64.9333332 145.5 67.9083332 146.916667 69.6 148.433333 71.2 151.05 72 154.783333 72L154.783333 84C151.05 84 148.433333 84.8333334 146.916667 86.5333332 145.5 88.1333332 144.783333 91.0666666 144.783333 95.3333332L144.783333 118C144.783333 124.308333 142.616667 129.2 138.25 132.666667 133.983333 136.216667 127.5 138 118.783333 138L114.116667 138 114.116667 126 114.116667 126Z"
    })
  }),
  execute: (state, api) => {
    var newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: "```\n",
      suffix: "\n```"
    });
    var state1 = api.setSelectionRange(newSelectionRange);
    var prefix = "\n```\n";
    var suffix = "\n```\n";
    if (state1.selectedText.length >= prefix.length + suffix.length - 2 && state1.selectedText.startsWith(prefix) && state1.selectedText.endsWith(suffix)) {
      prefix = "```\n";
      suffix = "\n```";
    } else {
      if (state1.selection.start >= 1 && state.text.slice(state1.selection.start - 1, state1.selection.start) === "\n" || state1.selection.start === 0) {
        prefix = "```\n";
      }
      if (state1.selection.end <= state.text.length - 1 && state.text.slice(state1.selection.end, state1.selection.end + 1) === "\n" || state1.selection.end === state.text.length) {
        suffix = "\n```";
      }
    }
    var newSelectionRange2 = selectWord({
      text: state.text,
      selection: state.selection,
      prefix,
      suffix
    });
    var state2 = api.setSelectionRange(newSelectionRange2);
    executeCommand({
      api,
      selectedText: state2.selectedText,
      selection: state.selection,
      prefix,
      suffix
    });
  }
};
var code = {
  name: "code",
  keyCommand: "code",
  shortcuts: "ctrlcmd+j",
  prefix: "`",
  buttonProps: {
    "aria-label": "Insert code (ctrl + j)",
    title: "Insert code (ctrl + j)"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    width: "14",
    height: "14",
    role: "img",
    viewBox: "0 0 640 512",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"
    })
  }),
  execute: (state, api) => {
    if (state.selectedText.indexOf("\n") === -1) {
      var newSelectionRange = selectWord({
        text: state.text,
        selection: state.selection,
        prefix: state.command.prefix
      });
      var state1 = api.setSelectionRange(newSelectionRange);
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix
      });
    } else {
      codeBlock.execute(state, api);
    }
  }
};
var comment = {
  name: "comment",
  keyCommand: "comment",
  shortcuts: "ctrlcmd+/",
  prefix: "<!-- ",
  suffix: " -->",
  buttonProps: {
    "aria-label": "Insert comment (ctrl + /)",
    title: "Insert comment (ctrl + /)"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    height: "1em",
    width: "1em",
    viewBox: "0 0 25 25",
    children: /* @__PURE__ */ jsxs("g", {
      fill: "none",
      fillRule: "evenodd",
      children: [/* @__PURE__ */ jsx("polygon", {
        points: ".769 .727 24.981 .727 24.981 24.727 .769 24.727"
      }), /* @__PURE__ */ jsx("path", {
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "3",
        d: "M12.625,23.8787879 L8.125,19.6969697 L5.125,19.6969697 C2.63971863,19.6969697 0.625,17.8247059 0.625,15.5151515 L0.625,7.15151515 C0.625,4.84196074 2.63971863,2.96969697 5.125,2.96969697 L20.125,2.96969697 C22.6102814,2.96969697 24.625,4.84196074 24.625,7.15151515 L24.625,15.5151515 C24.625,17.8247059 22.6102814,19.6969697 20.125,19.6969697 L17.125,19.6969697 L12.625,23.8787879"
      }), /* @__PURE__ */ jsx("path", {
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "3",
        d: "M10.625,8.54545455 L7.25,11.3333333 L10.625,14.1212121 M15.6875,8.54545455 L19.0625,11.3333333 L15.6875,14.1212121"
      })]
    })
  }),
  execute: (state, api) => {
    var newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: state.command.prefix,
      suffix: state.command.suffix
    });
    var state1 = api.setSelectionRange(newSelectionRange);
    executeCommand({
      api,
      selectedText: state1.selectedText,
      selection: state.selection,
      prefix: state.command.prefix,
      suffix: state.command.suffix
    });
  }
};
var divider = {
  keyCommand: "divider"
};
var fullscreen = {
  name: "fullscreen",
  keyCommand: "fullscreen",
  shortcuts: "ctrlcmd+0",
  value: "fullscreen",
  buttonProps: {
    "aria-label": "Toggle fullscreen (ctrl + 0)",
    title: "Toggle fullscreen (ctrl+ 0)"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 520 520",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M118 171.133334L118 342.200271C118 353.766938 126.675 365.333605 141.133333 365.333605L382.634614 365.333605C394.201281 365.333605 405.767948 356.658605 405.767948 342.200271L405.767948 171.133334C405.767948 159.566667 397.092948 148 382.634614 148L141.133333 148C126.674999 148 117.999999 156.675 118 171.133334zM465.353591 413.444444L370 413.444444 370 471.222222 474.0221 471.222222C500.027624 471.222222 520.254143 451 520.254143 425L520.254143 321 462.464089 321 462.464089 413.444444 465.353591 413.444444zM471.0221 43L367 43 367 100.777778 462.353591 100.777778 462.353591 196.111111 520.143647 196.111111 520.143647 89.2222219C517.254144 63.2222219 497.027624 43 471.0221 43zM57.7900547 100.777778L153.143646 100.777778 153.143646 43 46.2320439 43C20.2265191 43 0 63.2222219 0 89.2222219L0 193.222222 57.7900547 193.222222 57.7900547 100.777778zM57.7900547 321L0 321 0 425C0 451 20.2265191 471.222222 46.2320439 471.222223L150.254143 471.222223 150.254143 413.444445 57.7900547 413.444445 57.7900547 321z"
    })
  }),
  execute: (state, api, dispatch, executeCommandState, shortcuts) => {
    api.textArea.focus();
    if (shortcuts && dispatch && executeCommandState) {
      dispatch({
        fullscreen: !executeCommandState.fullscreen
      });
    }
  }
};
var group = (arr, options) => {
  var data = _extends({
    children: arr,
    icon: /* @__PURE__ */ jsx("svg", {
      width: "12",
      height: "12",
      viewBox: "0 0 520 520",
      children: /* @__PURE__ */ jsx("path", {
        fill: "currentColor",
        d: "M15.7083333,468 C7.03242448,468 0,462.030833 0,454.666667 L0,421.333333 C0,413.969167 7.03242448,408 15.7083333,408 L361.291667,408 C369.967576,408 377,413.969167 377,421.333333 L377,454.666667 C377,462.030833 369.967576,468 361.291667,468 L15.7083333,468 Z M21.6666667,366 C9.69989583,366 0,359.831861 0,352.222222 L0,317.777778 C0,310.168139 9.69989583,304 21.6666667,304 L498.333333,304 C510.300104,304 520,310.168139 520,317.777778 L520,352.222222 C520,359.831861 510.300104,366 498.333333,366 L21.6666667,366 Z M136.835938,64 L136.835937,126 L107.25,126 L107.25,251 L40.75,251 L40.75,126 L-5.68434189e-14,126 L-5.68434189e-14,64 L136.835938,64 Z M212,64 L212,251 L161.648438,251 L161.648438,64 L212,64 Z M378,64 L378,126 L343.25,126 L343.25,251 L281.75,251 L281.75,126 L238,126 L238,64 L378,64 Z M449.047619,189.550781 L520,189.550781 L520,251 L405,251 L405,64 L449.047619,64 L449.047619,189.550781 Z"
      })
    }),
    execute: () => {
    }
  }, options, {
    keyCommand: "group"
  });
  if (Array.isArray(data.children)) {
    data.children = data.children.map((_ref) => {
      var item = _extends({}, (_objectDestructuringEmpty(_ref), _ref));
      item.parent = data;
      return _extends({}, item);
    });
  }
  return data;
};
var hr = {
  name: "hr",
  keyCommand: "hr",
  shortcuts: "ctrlcmd+h",
  prefix: "\n\n---\n",
  suffix: "",
  buttonProps: {
    "aria-label": "Insert HR (ctrl + h)",
    title: "Insert HR (ctrl + h)"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 175 175",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M0,129 L175,129 L175,154 L0,154 L0,129 Z M3,9 L28.2158203,9 L28.2158203,47.9824219 L55.7695313,47.9824219 L55.7695313,9 L81.0966797,9 L81.0966797,107.185547 L55.7695313,107.185547 L55.7695313,68.0214844 L28.2158203,68.0214844 L28.2158203,107.185547 L3,107.185547 L3,9 Z M93.1855469,100.603516 L93.1855469,19 L135.211914,19 C143.004922,19 148.960917,19.6679621 153.080078,21.0039063 C157.199239,22.3398504 160.520495,24.8168764 163.043945,28.4350586 C165.567395,32.0532407 166.829102,36.459935 166.829102,41.6552734 C166.829102,46.1826398 165.864267,50.0883625 163.93457,53.3725586 C162.004873,56.6567547 159.351579,59.3193257 155.974609,61.3603516 C153.822255,62.6591862 150.872089,63.7353473 147.124023,64.5888672 C150.129898,65.5908253 152.319329,66.5927684 153.692383,67.5947266 C154.620122,68.2626987 155.965323,69.6913953 157.728027,71.8808594 C159.490731,74.0703234 160.668942,75.7587831 161.262695,76.9462891 L173,100.603516 L144.953125,100.603516 L131.482422,75.6660156 C129.775382,72.4374839 128.253913,70.3408251 126.917969,69.3759766 C125.0996,68.1142515 123.040051,67.4833984 120.739258,67.4833984 L118.512695,67.4833984 L118.512695,100.603516 L93.1855469,100.603516 Z M118.512695,52.0644531 L129.144531,52.0644531 C130.294928,52.0644531 132.521468,51.6933631 135.824219,50.9511719 C137.494149,50.6171858 138.857905,49.7636787 139.915527,48.390625 C140.97315,47.0175713 141.501953,45.4404386 141.501953,43.6591797 C141.501953,41.0244009 140.667001,39.0019602 138.99707,37.5917969 C137.32714,36.1816336 134.191429,35.4765625 129.589844,35.4765625 L117.512695,35.4765625 L118.512695,52.0644531 Z",
      transform: "translate(0 9)"
    })
  }),
  execute: (state, api) => {
    var newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: state.command.prefix,
      suffix: state.command.suffix
    });
    var state1 = api.setSelectionRange(newSelectionRange);
    if (state1.selectedText.length >= state.command.prefix.length && state1.selectedText.startsWith(state.command.prefix)) {
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix,
        suffix: state.command.suffix
      });
    } else {
      state1 = api.setSelectionRange({
        start: state.selection.start,
        end: state.selection.start
      });
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix,
        suffix: state.command.suffix
      });
    }
  }
};
var image = {
  name: "image",
  keyCommand: "image",
  shortcuts: "ctrlcmd+k",
  prefix: "![image](",
  suffix: ")",
  buttonProps: {
    "aria-label": "Add image (ctrl + k)",
    title: "Add image (ctrl + k)"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 20 20",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
    })
  }),
  execute: (state, api) => {
    var newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: state.command.prefix,
      suffix: state.command.suffix
    });
    var state1 = api.setSelectionRange(newSelectionRange);
    if (state1.selectedText.includes("http") || state1.selectedText.includes("www")) {
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix,
        suffix: state.command.suffix
      });
    } else {
      newSelectionRange = selectWord({
        text: state.text,
        selection: state.selection,
        prefix: "![",
        suffix: "]()"
      });
      state1 = api.setSelectionRange(newSelectionRange);
      if (state1.selectedText.length === 0) {
        executeCommand({
          api,
          selectedText: state1.selectedText,
          selection: state.selection,
          prefix: "![image",
          suffix: "](url)"
        });
      } else {
        executeCommand({
          api,
          selectedText: state1.selectedText,
          selection: state.selection,
          prefix: "![",
          suffix: "]()"
        });
      }
    }
  }
};
var italic = {
  name: "italic",
  keyCommand: "italic",
  shortcuts: "ctrlcmd+i",
  prefix: "*",
  buttonProps: {
    "aria-label": "Add italic text (ctrl + i)",
    title: "Add italic text (ctrl + i)"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    "data-name": "italic",
    width: "12",
    height: "12",
    role: "img",
    viewBox: "0 0 320 512",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M204.758 416h-33.849l62.092-320h40.725a16 16 0 0 0 15.704-12.937l6.242-32C297.599 41.184 290.034 32 279.968 32H120.235a16 16 0 0 0-15.704 12.937l-6.242 32C96.362 86.816 103.927 96 113.993 96h33.846l-62.09 320H46.278a16 16 0 0 0-15.704 12.935l-6.245 32C22.402 470.815 29.967 480 40.034 480h158.479a16 16 0 0 0 15.704-12.935l6.245-32c1.927-9.88-5.638-19.065-15.704-19.065z"
    })
  }),
  execute: (state, api) => {
    var newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: state.command.prefix
    });
    var state1 = api.setSelectionRange(newSelectionRange);
    executeCommand({
      api,
      selectedText: state1.selectedText,
      selection: state.selection,
      prefix: state.command.prefix
    });
  }
};
var link = {
  name: "link",
  keyCommand: "link",
  shortcuts: "ctrlcmd+l",
  prefix: "[",
  suffix: "](url)",
  buttonProps: {
    "aria-label": "Add a link (ctrl + l)",
    title: "Add a link (ctrl + l)"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    "data-name": "italic",
    width: "12",
    height: "12",
    role: "img",
    viewBox: "0 0 520 520",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M331.751196,182.121107 C392.438214,241.974735 391.605313,337.935283 332.11686,396.871226 C332.005129,396.991316 331.873084,397.121413 331.751196,397.241503 L263.493918,464.491645 C203.291404,523.80587 105.345257,523.797864 45.151885,464.491645 C-15.0506283,405.187427 -15.0506283,308.675467 45.151885,249.371249 L82.8416853,212.237562 C92.836501,202.39022 110.049118,208.9351 110.56511,222.851476 C111.223305,240.5867 114.451306,258.404985 120.407566,275.611815 C122.424812,281.438159 120.983487,287.882964 116.565047,292.23621 L103.272145,305.332975 C74.8052033,333.379887 73.9123737,379.047937 102.098973,407.369054 C130.563883,435.969378 177.350591,436.139505 206.033884,407.879434 L274.291163,340.6393 C302.9257,312.427264 302.805844,266.827265 274.291163,238.733318 C270.531934,235.036561 266.74528,232.16442 263.787465,230.157924 C259.544542,227.2873 256.928256,222.609848 256.731165,217.542518 C256.328935,206.967633 260.13184,196.070508 268.613213,187.714278 L289.998463,166.643567 C295.606326,161.118448 304.403592,160.439942 310.906317,164.911276 C318.353355,170.034591 325.328531,175.793397 331.751196,182.121107 Z M240.704978,55.4828366 L172.447607,122.733236 C172.325719,122.853326 172.193674,122.983423 172.081943,123.103513 C117.703294,179.334654 129.953294,261.569283 185.365841,328.828764 C191.044403,335.721376 198.762988,340.914712 206.209732,346.037661 C212.712465,350.509012 221.510759,349.829503 227.117615,344.305363 L248.502893,323.234572 C256.984277,314.87831 260.787188,303.981143 260.384957,293.406218 C260.187865,288.338869 257.571576,283.661398 253.328648,280.790763 C250.370829,278.78426 246.58417,275.912107 242.824936,272.215337 C214.310216,244.121282 206.209732,204.825874 229.906702,179.334654 L298.164073,112.094263 C326.847404,83.8340838 373.633159,84.0042113 402.099123,112.604645 C430.285761,140.92587 429.393946,186.594095 400.92595,214.641114 L387.63303,227.737929 C383.214584,232.091191 381.773257,238.536021 383.790506,244.362388 C389.746774,261.569283 392.974779,279.387637 393.632975,297.122928 C394.149984,311.039357 411.361608,317.584262 421.356437,307.736882 L459.046288,270.603053 C519.249898,211.29961 519.249898,114.787281 459.047304,55.4828366 C398.853851,-3.82360914 300.907572,-3.83161514 240.704978,55.4828366 Z"
    })
  }),
  execute: (state, api) => {
    var newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: state.command.prefix,
      suffix: state.command.suffix
    });
    var state1 = api.setSelectionRange(newSelectionRange);
    if (state1.selectedText.includes("http") || state1.selectedText.includes("www")) {
      newSelectionRange = selectWord({
        text: state.text,
        selection: state.selection,
        prefix: "[](",
        suffix: ")"
      });
      state1 = api.setSelectionRange(newSelectionRange);
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: "[](",
        suffix: ")"
      });
    } else {
      if (state1.selectedText.length === 0) {
        executeCommand({
          api,
          selectedText: state1.selectedText,
          selection: state.selection,
          prefix: "[title",
          suffix: "](url)"
        });
      } else {
        executeCommand({
          api,
          selectedText: state1.selectedText,
          selection: state.selection,
          prefix: state.command.prefix,
          suffix: state.command.suffix
        });
      }
    }
  }
};
var makeList = (state, api, insertBefore) => {
  var newSelectionRange = selectWord({
    text: state.text,
    selection: state.selection,
    prefix: state.command.prefix
  });
  var state1 = api.setSelectionRange(newSelectionRange);
  var breaksBeforeCount = getBreaksNeededForEmptyLineBefore(state1.text, state1.selection.start);
  var breaksBefore = Array(breaksBeforeCount + 1).join("\n");
  var breaksAfterCount = getBreaksNeededForEmptyLineAfter(state1.text, state1.selection.end);
  var breaksAfter = Array(breaksAfterCount + 1).join("\n");
  var {
    modifiedText,
    insertionLength
  } = insertBeforeEachLine(state1.selectedText, insertBefore);
  if (insertionLength < 0) {
    var selectionStart = state1.selection.start;
    var selectionEnd = state1.selection.end;
    if (state1.selection.start > 0 && state.text.slice(state1.selection.start - 1, state1.selection.start) === "\n") {
      selectionStart -= 1;
    }
    if (state1.selection.end < state.text.length - 1 && state.text.slice(state1.selection.end, state1.selection.end + 1) === "\n") {
      selectionEnd += 1;
    }
    api.setSelectionRange({
      start: selectionStart,
      end: selectionEnd
    });
    api.replaceSelection("" + modifiedText);
    api.setSelectionRange({
      start: selectionStart,
      end: selectionStart + modifiedText.length
    });
  } else {
    api.replaceSelection("" + breaksBefore + modifiedText + breaksAfter);
    var _selectionStart = state1.selection.start + breaksBeforeCount;
    var _selectionEnd = _selectionStart + modifiedText.length;
    api.setSelectionRange({
      start: _selectionStart,
      end: _selectionEnd
    });
  }
};
var unorderedListCommand = {
  name: "unordered-list",
  keyCommand: "list",
  shortcuts: "ctrl+shift+u",
  prefix: "- ",
  buttonProps: {
    "aria-label": "Add unordered list (ctrl + shift + u)",
    title: "Add unordered list (ctrl + shift + u)"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    "data-name": "unordered-list",
    width: "12",
    height: "12",
    viewBox: "0 0 512 512",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M96 96c0 26.51-21.49 48-48 48S0 122.51 0 96s21.49-48 48-48 48 21.49 48 48zM48 208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm0 160c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm96-236h352c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
    })
  }),
  execute: (state, api) => {
    makeList(state, api, "- ");
  }
};
var orderedListCommand = {
  name: "ordered-list",
  keyCommand: "list",
  shortcuts: "ctrl+shift+o",
  prefix: "1. ",
  buttonProps: {
    "aria-label": "Add ordered list (ctrl + shift + o)",
    title: "Add ordered list (ctrl + shift + o)"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    "data-name": "ordered-list",
    width: "12",
    height: "12",
    role: "img",
    viewBox: "0 0 512 512",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M3.263 139.527c0-7.477 3.917-11.572 11.573-11.572h15.131V88.078c0-5.163.534-10.503.534-10.503h-.356s-1.779 2.67-2.848 3.738c-4.451 4.273-10.504 4.451-15.666-1.068l-5.518-6.231c-5.342-5.341-4.984-11.216.534-16.379l21.72-19.938C32.815 33.602 36.732 32 42.785 32H54.89c7.656 0 11.749 3.916 11.749 11.572v84.384h15.488c7.655 0 11.572 4.094 11.572 11.572v8.901c0 7.477-3.917 11.572-11.572 11.572H14.836c-7.656 0-11.573-4.095-11.573-11.572v-8.902zM2.211 304.591c0-47.278 50.955-56.383 50.955-69.165 0-7.18-5.954-8.755-9.28-8.755-3.153 0-6.479 1.051-9.455 3.852-5.079 4.903-10.507 7.004-16.111 2.451l-8.579-6.829c-5.779-4.553-7.18-9.805-2.803-15.409C13.592 201.981 26.025 192 47.387 192c19.437 0 44.476 10.506 44.476 39.573 0 38.347-46.753 46.402-48.679 56.909h39.049c7.529 0 11.557 4.027 11.557 11.382v8.755c0 7.354-4.028 11.382-11.557 11.382h-67.94c-7.005 0-12.083-4.028-12.083-11.382v-4.028zM5.654 454.61l5.603-9.28c3.853-6.654 9.105-7.004 15.584-3.152 4.903 2.101 9.63 3.152 14.359 3.152 10.155 0 14.358-3.502 14.358-8.23 0-6.654-5.604-9.106-15.934-9.106h-4.728c-5.954 0-9.28-2.101-12.258-7.88l-1.05-1.926c-2.451-4.728-1.226-9.806 2.801-14.884l5.604-7.004c6.829-8.405 12.257-13.483 12.257-13.483v-.35s-4.203 1.051-12.608 1.051H16.685c-7.53 0-11.383-4.028-11.383-11.382v-8.755c0-7.53 3.853-11.382 11.383-11.382h58.484c7.529 0 11.382 4.027 11.382 11.382v3.327c0 5.778-1.401 9.806-5.079 14.183l-17.509 20.137c19.611 5.078 28.716 20.487 28.716 34.845 0 21.363-14.358 44.126-48.503 44.126-16.636 0-28.192-4.728-35.896-9.455-5.779-4.202-6.304-9.805-2.626-15.934zM144 132h352c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
    })
  }),
  execute: (state, api) => {
    makeList(state, api, (item, index) => index + 1 + ". ");
  }
};
var checkedListCommand = {
  name: "checked-list",
  keyCommand: "list",
  shortcuts: "ctrl+shift+c",
  prefix: "- [ ] ",
  buttonProps: {
    "aria-label": "Add checked list (ctrl + shift + c)",
    title: "Add checked list (ctrl + shift + c)"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    "data-name": "checked-list",
    width: "12",
    height: "12",
    role: "img",
    viewBox: "0 0 512 512",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M208 132h288c8.8 0 16-7.2 16-16V76c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zm0 160h288c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zm0 160h288c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zM64 368c-26.5 0-48.6 21.5-48.6 48s22.1 48 48.6 48 48-21.5 48-48-21.5-48-48-48zm92.5-299l-72.2 72.2-15.6 15.6c-4.7 4.7-12.9 4.7-17.6 0L3.5 109.4c-4.7-4.7-4.7-12.3 0-17l15.7-15.7c4.7-4.7 12.3-4.7 17 0l22.7 22.1 63.7-63.3c4.7-4.7 12.3-4.7 17 0l17 16.5c4.6 4.7 4.6 12.3-.1 17zm0 159.6l-72.2 72.2-15.7 15.7c-4.7 4.7-12.9 4.7-17.6 0L3.5 269c-4.7-4.7-4.7-12.3 0-17l15.7-15.7c4.7-4.7 12.3-4.7 17 0l22.7 22.1 63.7-63.7c4.7-4.7 12.3-4.7 17 0l17 17c4.6 4.6 4.6 12.2-.1 16.9z"
    })
  }),
  execute: (state, api) => {
    makeList(state, api, (item, index) => "- [ ] ");
  }
};
var codePreview = {
  name: "preview",
  keyCommand: "preview",
  value: "preview",
  shortcuts: "ctrlcmd+9",
  buttonProps: {
    "aria-label": "Preview code (ctrl + 9)",
    title: "Preview code (ctrl + 9)"
  },
  icon: /* @__PURE__ */ jsxs("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 520 520",
    children: [/* @__PURE__ */ jsx("polygon", {
      fill: "currentColor",
      points: "0 71.293 0 122 38.023 123 38.023 398 0 397 0 449.707 91.023 450.413 91.023 72.293"
    }), /* @__PURE__ */ jsx("polygon", {
      fill: "currentColor",
      points: "148.023 72.293 520 71.293 520 122 200.023 124 200.023 397 520 396 520 449.707 148.023 450.413"
    })]
  }),
  execute: (state, api, dispatch, executeCommandState, shortcuts) => {
    api.textArea.focus();
    if (shortcuts && dispatch && executeCommandState) {
      dispatch({
        preview: "preview"
      });
    }
  }
};
var codeEdit = {
  name: "edit",
  keyCommand: "preview",
  value: "edit",
  shortcuts: "ctrlcmd+7",
  buttonProps: {
    "aria-label": "Edit code (ctrl + 7)",
    title: "Edit code (ctrl + 7)"
  },
  icon: /* @__PURE__ */ jsxs("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 520 520",
    children: [/* @__PURE__ */ jsx("polygon", {
      fill: "currentColor",
      points: "0 71.293 0 122 319 122 319 397 0 397 0 449.707 372 449.413 372 71.293"
    }), /* @__PURE__ */ jsx("polygon", {
      fill: "currentColor",
      points: "429 71.293 520 71.293 520 122 481 123 481 396 520 396 520 449.707 429 449.413"
    })]
  }),
  execute: (state, api, dispatch, executeCommandState, shortcuts) => {
    api.textArea.focus();
    if (shortcuts && dispatch && executeCommandState) {
      dispatch({
        preview: "edit"
      });
    }
  }
};
var codeLive = {
  name: "live",
  keyCommand: "preview",
  value: "live",
  shortcuts: "ctrlcmd+8",
  buttonProps: {
    "aria-label": "Live code (ctrl + 8)",
    title: "Live code (ctrl + 8)"
  },
  icon: /* @__PURE__ */ jsxs("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 520 520",
    children: [/* @__PURE__ */ jsx("polygon", {
      fill: "currentColor",
      points: "0 71.293 0 122 179 122 179 397 0 397 0 449.707 232 449.413 232 71.293"
    }), /* @__PURE__ */ jsx("polygon", {
      fill: "currentColor",
      points: "289 71.293 520 71.293 520 122 341 123 341 396 520 396 520 449.707 289 449.413"
    })]
  }),
  execute: (state, api, dispatch, executeCommandState, shortcuts) => {
    api.textArea.focus();
    if (shortcuts && dispatch && executeCommandState) {
      dispatch({
        preview: "live"
      });
    }
  }
};
var quote = {
  name: "quote",
  keyCommand: "quote",
  shortcuts: "ctrlcmd+q",
  prefix: "> ",
  buttonProps: {
    "aria-label": "Insert a quote (ctrl + q)",
    title: "Insert a quote (ctrl + q)"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 520 520",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M520,95.75 L520,225.75 C520,364.908906 457.127578,437.050625 325.040469,472.443125 C309.577578,476.586875 294.396016,464.889922 294.396016,448.881641 L294.396016,414.457031 C294.396016,404.242891 300.721328,395.025078 310.328125,391.554687 C377.356328,367.342187 414.375,349.711094 414.375,274.5 L341.25,274.5 C314.325781,274.5 292.5,252.674219 292.5,225.75 L292.5,95.75 C292.5,68.8257812 314.325781,47 341.25,47 L471.25,47 C498.174219,47 520,68.8257812 520,95.75 Z M178.75,47 L48.75,47 C21.8257813,47 0,68.8257812 0,95.75 L0,225.75 C0,252.674219 21.8257813,274.5 48.75,274.5 L121.875,274.5 C121.875,349.711094 84.8563281,367.342187 17.828125,391.554687 C8.22132813,395.025078 1.89601563,404.242891 1.89601563,414.457031 L1.89601563,448.881641 C1.89601563,464.889922 17.0775781,476.586875 32.5404687,472.443125 C164.627578,437.050625 227.5,364.908906 227.5,225.75 L227.5,95.75 C227.5,68.8257812 205.674219,47 178.75,47 Z"
    })
  }),
  execute: (state, api) => {
    var newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: state.command.prefix
    });
    var state1 = api.setSelectionRange(newSelectionRange);
    var breaksBeforeCount = getBreaksNeededForEmptyLineBefore(state1.text, state1.selection.start);
    var breaksBefore = Array(breaksBeforeCount + 1).join("\n");
    var breaksAfterCount = getBreaksNeededForEmptyLineAfter(state1.text, state1.selection.end);
    var breaksAfter = Array(breaksAfterCount + 1).join("\n");
    var modifiedText = insertBeforeEachLine(state1.selectedText, state.command.prefix);
    api.replaceSelection("" + breaksBefore + modifiedText.modifiedText + breaksAfter);
    var selectionStart = state1.selection.start + breaksBeforeCount;
    var selectionEnd = selectionStart + modifiedText.modifiedText.length;
    api.setSelectionRange({
      start: selectionStart,
      end: selectionEnd
    });
  }
};
var strikethrough = {
  name: "strikethrough",
  keyCommand: "strikethrough",
  shortcuts: "ctrl+shift+x",
  buttonProps: {
    "aria-label": "Add strikethrough text (ctrl + shift + x)",
    title: "Add strikethrough text (ctrl + shift + x)"
  },
  prefix: "~~",
  icon: /* @__PURE__ */ jsx("svg", {
    "data-name": "strikethrough",
    width: "12",
    height: "12",
    role: "img",
    viewBox: "0 0 512 512",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M496 288H16c-8.837 0-16-7.163-16-16v-32c0-8.837 7.163-16 16-16h480c8.837 0 16 7.163 16 16v32c0 8.837-7.163 16-16 16zm-214.666 16c27.258 12.937 46.524 28.683 46.524 56.243 0 33.108-28.977 53.676-75.621 53.676-32.325 0-76.874-12.08-76.874-44.271V368c0-8.837-7.164-16-16-16H113.75c-8.836 0-16 7.163-16 16v19.204c0 66.845 77.717 101.82 154.487 101.82 88.578 0 162.013-45.438 162.013-134.424 0-19.815-3.618-36.417-10.143-50.6H281.334zm-30.952-96c-32.422-13.505-56.836-28.946-56.836-59.683 0-33.92 30.901-47.406 64.962-47.406 42.647 0 64.962 16.593 64.962 32.985V136c0 8.837 7.164 16 16 16h45.613c8.836 0 16-7.163 16-16v-30.318c0-52.438-71.725-79.875-142.575-79.875-85.203 0-150.726 40.972-150.726 125.646 0 22.71 4.665 41.176 12.777 56.547h129.823z"
    })
  }),
  execute: (state, api) => {
    var newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: state.command.prefix
    });
    var state1 = api.setSelectionRange(newSelectionRange);
    executeCommand({
      api,
      selectedText: state1.selectedText,
      selection: state.selection,
      prefix: state.command.prefix
    });
  }
};
var heading1 = {
  name: "heading1",
  keyCommand: "heading1",
  shortcuts: "ctrlcmd+1",
  prefix: "# ",
  suffix: "",
  buttonProps: {
    "aria-label": "Insert Heading 1 (ctrl + 1)",
    title: "Insert Heading 1 (ctrl + 1)"
  },
  icon: /* @__PURE__ */ jsx("div", {
    style: {
      fontSize: 18,
      textAlign: "left"
    },
    children: "Heading 1"
  }),
  execute: (state, api) => {
    headingExecute({
      state,
      api,
      prefix: state.command.prefix,
      suffix: state.command.suffix
    });
  }
};
var title1 = heading1;
function headingExecute(_ref) {
  var {
    state,
    api,
    prefix,
    suffix = prefix
  } = _ref;
  var newSelectionRange = selectLine({
    text: state.text,
    selection: state.selection
  });
  var state1 = api.setSelectionRange(newSelectionRange);
  executeCommand({
    api,
    selectedText: state1.selectedText,
    selection: state.selection,
    prefix,
    suffix
  });
}
_extends({}, heading1, {
  icon: /* @__PURE__ */ jsx("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 520 520",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M15.7083333,468 C7.03242448,468 0,462.030833 0,454.666667 L0,421.333333 C0,413.969167 7.03242448,408 15.7083333,408 L361.291667,408 C369.967576,408 377,413.969167 377,421.333333 L377,454.666667 C377,462.030833 369.967576,468 361.291667,468 L15.7083333,468 Z M21.6666667,366 C9.69989583,366 0,359.831861 0,352.222222 L0,317.777778 C0,310.168139 9.69989583,304 21.6666667,304 L498.333333,304 C510.300104,304 520,310.168139 520,317.777778 L520,352.222222 C520,359.831861 510.300104,366 498.333333,366 L21.6666667,366 Z M136.835938,64 L136.835937,126 L107.25,126 L107.25,251 L40.75,251 L40.75,126 L-5.68434189e-14,126 L-5.68434189e-14,64 L136.835938,64 Z M212,64 L212,251 L161.648438,251 L161.648438,64 L212,64 Z M378,64 L378,126 L343.25,126 L343.25,251 L281.75,251 L281.75,126 L238,126 L238,64 L378,64 Z M449.047619,189.550781 L520,189.550781 L520,251 L405,251 L405,64 L449.047619,64 L449.047619,189.550781 Z"
    })
  })
});
var heading2 = {
  name: "heading2",
  keyCommand: "heading2",
  shortcuts: "ctrlcmd+2",
  prefix: "## ",
  suffix: "",
  buttonProps: {
    "aria-label": "Insert Heading 2 (ctrl + 2)",
    title: "Insert Heading 2 (ctrl + 2)"
  },
  icon: /* @__PURE__ */ jsx("div", {
    style: {
      fontSize: 16,
      textAlign: "left"
    },
    children: "Heading 2"
  }),
  execute: (state, api) => {
    headingExecute({
      state,
      api,
      prefix: state.command.prefix,
      suffix: state.command.suffix
    });
  }
};
var title2 = heading2;
var heading3 = {
  name: "heading3",
  keyCommand: "heading3",
  shortcuts: "ctrlcmd+3",
  prefix: "### ",
  suffix: "",
  buttonProps: {
    "aria-label": "Insert Heading 3 (ctrl + 3)",
    title: "Insert Heading 3 (ctrl + 3)"
  },
  icon: /* @__PURE__ */ jsx("div", {
    style: {
      fontSize: 15,
      textAlign: "left"
    },
    children: "Heading 3"
  }),
  execute: (state, api) => {
    headingExecute({
      state,
      api,
      prefix: state.command.prefix,
      suffix: state.command.suffix
    });
  }
};
var title3 = heading3;
var heading4 = {
  name: "heading4",
  keyCommand: "heading4",
  shortcuts: "ctrlcmd+4",
  prefix: "#### ",
  suffix: "",
  buttonProps: {
    "aria-label": "Insert Heading 4 (ctrl + 4)",
    title: "Insert Heading 4 (ctrl + 4)"
  },
  icon: /* @__PURE__ */ jsx("div", {
    style: {
      fontSize: 14,
      textAlign: "left"
    },
    children: "Heading 4"
  }),
  execute: (state, api) => {
    headingExecute({
      state,
      api,
      prefix: state.command.prefix,
      suffix: state.command.suffix
    });
  }
};
var title4 = heading4;
var heading5 = {
  name: "heading5",
  keyCommand: "heading5",
  shortcuts: "ctrlcmd+5",
  prefix: "##### ",
  suffix: "",
  buttonProps: {
    "aria-label": "Insert Heading 5 (ctrl + 5)",
    title: "Insert Heading 5 (ctrl + 5)"
  },
  icon: /* @__PURE__ */ jsx("div", {
    style: {
      fontSize: 12,
      textAlign: "left"
    },
    children: "Heading 5"
  }),
  execute: (state, api) => {
    headingExecute({
      state,
      api,
      prefix: state.command.prefix,
      suffix: state.command.suffix
    });
  }
};
var title5 = heading5;
var heading6 = {
  name: "heading6",
  keyCommand: "heading6",
  shortcuts: "ctrlcmd+6",
  prefix: "###### ",
  suffix: "",
  buttonProps: {
    "aria-label": "Insert Heading 6 (ctrl + 6)",
    title: "Insert Heading 6 (ctrl + 6)"
  },
  icon: /* @__PURE__ */ jsx("div", {
    style: {
      fontSize: 12,
      textAlign: "left"
    },
    children: "Heading 6"
  }),
  execute: (state, api) => {
    headingExecute({
      state,
      api,
      prefix: state.command.prefix,
      suffix: state.command.suffix
    });
  }
};
var title6 = heading6;
var table = {
  name: "table",
  keyCommand: "table",
  prefix: "\n| Header | Header |\n|--------|--------|\n| Cell | Cell |\n| Cell | Cell |\n| Cell | Cell |\n\n",
  suffix: "",
  buttonProps: {
    "aria-label": "Add table",
    title: "Add table"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    role: "img",
    width: "12",
    height: "12",
    viewBox: "0 0 512 512",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M64 256V160H224v96H64zm0 64H224v96H64V320zm224 96V320H448v96H288zM448 256H288V160H448v96zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
      //Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com
    })
  }),
  execute: (state, api) => {
    var newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: state.command.prefix,
      suffix: state.command.suffix
    });
    var state1 = api.setSelectionRange(newSelectionRange);
    if (state1.selectedText.length >= state.command.prefix.length + state.command.suffix.length && state1.selectedText.startsWith(state.command.prefix)) {
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix,
        suffix: state.command.suffix
      });
    } else {
      state1 = api.setSelectionRange({
        start: state.selection.start,
        end: state.selection.start
      });
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix,
        suffix: state.command.suffix
      });
    }
  }
};
var help = {
  name: "help",
  keyCommand: "help",
  buttonProps: {
    "aria-label": "Open help",
    title: "Open help"
  },
  icon: /* @__PURE__ */ jsx("svg", {
    viewBox: "0 0 16 16",
    width: "12px",
    height: "12px",
    children: /* @__PURE__ */ jsx("path", {
      d: "M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8Zm.9 13H7v-1.8h1.9V13Zm-.1-3.6v.5H7.1v-.6c.2-2.1 2-1.9 1.9-3.2.1-.7-.3-1.1-1-1.1-.8 0-1.2.7-1.2 1.6H5c0-1.7 1.2-3 2.9-3 2.3 0 3 1.4 3 2.3.1 2.3-1.9 2-2.1 3.5Z",
      fill: "currentColor"
    })
  }),
  execute: () => {
    window.open("https://www.markdownguide.org/basic-syntax/", "_blank", "noreferrer");
  }
};
var getCommands = () => [bold, italic, strikethrough, hr, group([title1, title2, title3, title4, title5, title6], {
  name: "title",
  groupName: "title",
  buttonProps: {
    "aria-label": "Insert title",
    title: "Insert title"
  }
}), divider, link, quote, code, codeBlock, comment, image, table, divider, unorderedListCommand, orderedListCommand, checkedListCommand, divider, help];
var getExtraCommands = () => [codeEdit, codeLive, codePreview, divider, fullscreen];
function getStateFromTextArea(textArea) {
  var _textArea$value;
  return {
    selection: {
      start: textArea.selectionStart,
      end: textArea.selectionEnd
    },
    text: textArea.value,
    selectedText: (_textArea$value = textArea.value) == null ? void 0 : _textArea$value.slice(textArea.selectionStart, textArea.selectionEnd)
  };
}
class TextAreaTextApi {
  constructor(textArea) {
    this.textArea = void 0;
    this.textArea = textArea;
  }
  /**
   * Replaces the current selection with the new text. This will make the new selectedText to be empty, the
   * selection start and selection end will be the same and will both point to the end
   * @param text Text that should replace the current selection
   */
  replaceSelection(text) {
    insertTextAtPosition(this.textArea, text);
    return getStateFromTextArea(this.textArea);
  }
  /**
   * Selects the specified text range
   * @param selection
   */
  setSelectionRange(selection) {
    this.textArea.focus();
    this.textArea.selectionStart = selection.start;
    this.textArea.selectionEnd = selection.end;
    return getStateFromTextArea(this.textArea);
  }
}
class TextAreaCommandOrchestrator {
  constructor(textArea) {
    this.textArea = void 0;
    this.textApi = void 0;
    this.textArea = textArea;
    this.textApi = new TextAreaTextApi(textArea);
  }
  getState() {
    if (!this.textArea) return false;
    return getStateFromTextArea(this.textArea);
  }
  executeCommand(command, dispatch, state, shortcuts) {
    command.execute && command.execute(_extends({
      command
    }, getStateFromTextArea(this.textArea)), this.textApi, dispatch, state, shortcuts);
  }
}
function stopPropagation(e) {
  e.stopPropagation();
  e.preventDefault();
}
function handleLineMove(e, direction) {
  stopPropagation(e);
  var target = e.target;
  var textArea = new TextAreaTextApi(target);
  var selection = {
    start: target.selectionStart,
    end: target.selectionEnd
  };
  selection = selectLine({
    text: target.value,
    selection
  });
  if (direction < 0 && selection.start <= 0 || direction > 0 && selection.end >= target.value.length) {
    return;
  }
  var blockText = target.value.slice(selection.start, selection.end);
  if (direction < 0) {
    var prevLineSelection = selectLine({
      text: target.value,
      selection: {
        start: selection.start - 1,
        end: selection.start - 1
      }
    });
    var prevLineText = target.value.slice(prevLineSelection.start, prevLineSelection.end);
    textArea.setSelectionRange({
      start: prevLineSelection.start,
      end: selection.end
    });
    insertTextAtPosition(target, blockText + "\n" + prevLineText);
    textArea.setSelectionRange({
      start: prevLineSelection.start,
      end: prevLineSelection.start + blockText.length
    });
  } else {
    var nextLineSelection = selectLine({
      text: target.value,
      selection: {
        start: selection.end + 1,
        end: selection.end + 1
      }
    });
    var nextLineText = target.value.slice(nextLineSelection.start, nextLineSelection.end);
    textArea.setSelectionRange({
      start: selection.start,
      end: nextLineSelection.end
    });
    insertTextAtPosition(target, nextLineText + "\n" + blockText);
    textArea.setSelectionRange({
      start: nextLineSelection.end - blockText.length,
      end: nextLineSelection.end
    });
  }
}
function handleKeyDown(e, tabSize, defaultTabEnable) {
  if (tabSize === void 0) {
    tabSize = 2;
  }
  if (defaultTabEnable === void 0) {
    defaultTabEnable = false;
  }
  var target = e.target;
  var starVal = target.value.substr(0, target.selectionStart);
  var valArr = starVal.split("\n");
  var currentLineStr = valArr[valArr.length - 1];
  var textArea = new TextAreaTextApi(target);
  if (!defaultTabEnable && e.code && e.code.toLowerCase() === "tab") {
    stopPropagation(e);
    var space = new Array(tabSize + 1).join("  ");
    if (target.selectionStart !== target.selectionEnd) {
      var _star = target.value.substring(0, target.selectionStart).split("\n");
      var _end = target.value.substring(0, target.selectionEnd).split("\n");
      var modifiedTextLine = [];
      _end.forEach((item, idx) => {
        if (item !== _star[idx]) {
          modifiedTextLine.push(item);
        }
      });
      var modifiedText = modifiedTextLine.join("\n");
      var oldSelectText = target.value.substring(target.selectionStart, target.selectionEnd);
      var newStarNum = target.value.substring(0, target.selectionStart).length;
      textArea.setSelectionRange({
        start: target.value.indexOf(modifiedText),
        end: target.selectionEnd
      });
      var modifiedTextObj = insertBeforeEachLine(modifiedText, e.shiftKey ? "" : space);
      var text = modifiedTextObj.modifiedText;
      if (e.shiftKey) {
        text = text.split("\n").map((item) => item.replace(new RegExp("^" + space), "")).join("\n");
      }
      textArea.replaceSelection(text);
      var startTabSize = e.shiftKey ? -tabSize : tabSize;
      var endTabSize = e.shiftKey ? -modifiedTextLine.length * tabSize : modifiedTextLine.length * tabSize;
      textArea.setSelectionRange({
        start: newStarNum + startTabSize,
        end: newStarNum + oldSelectText.length + endTabSize
      });
    } else {
      return insertTextAtPosition(target, space);
    }
  } else if (e.keyCode === 13 && e.code.toLowerCase() === "enter" && (/^(-|\*)\s/.test(currentLineStr) || /^\d+.\s/.test(currentLineStr)) && !e.shiftKey) {
    stopPropagation(e);
    var startStr = "\n- ";
    if (currentLineStr.startsWith("*")) {
      startStr = "\n* ";
    }
    if (currentLineStr.startsWith("- [ ]") || currentLineStr.startsWith("- [X]") || currentLineStr.startsWith("- [x]")) {
      startStr = "\n- [ ] ";
    }
    if (/^\d+.\s/.test(currentLineStr)) {
      startStr = "\n" + (parseInt(currentLineStr) + 1) + ". ";
    }
    return insertTextAtPosition(target, startStr);
  } else if (e.code && e.code.toLowerCase() === "keyd" && e.ctrlKey) {
    stopPropagation(e);
    var selection = {
      start: target.selectionStart,
      end: target.selectionEnd
    };
    var savedSelection = selection;
    selection = selectLine({
      text: target.value,
      selection
    });
    var textToDuplicate = target.value.slice(selection.start, selection.end);
    textArea.setSelectionRange({
      start: selection.end,
      end: selection.end
    });
    insertTextAtPosition(target, "\n" + textToDuplicate);
    textArea.setSelectionRange({
      start: savedSelection.start,
      end: savedSelection.end
    });
  } else if (e.code && e.code.toLowerCase() === "arrowup" && e.altKey) {
    handleLineMove(e, -1);
  } else if (e.code && e.code.toLowerCase() === "arrowdown" && e.altKey) {
    handleLineMove(e, 1);
  }
}
var _excluded$2 = ["prefixCls", "onChange"], _excluded2 = ["markdown", "commands", "fullscreen", "preview", "highlightEnable", "extraCommands", "tabSize", "defaultTabEnable", "autoFocusEnd", "textareaWarp", "dispatch"];
function Textarea(props) {
  var {
    prefixCls,
    onChange: _onChange
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded$2);
  var _useContext = useContext(EditorContext), {
    markdown,
    commands,
    fullscreen: fullscreen2,
    preview,
    highlightEnable,
    extraCommands,
    tabSize,
    defaultTabEnable,
    autoFocusEnd,
    textareaWarp,
    dispatch
  } = _useContext;
  _objectWithoutPropertiesLoose(_useContext, _excluded2);
  var textRef = React.useRef(null);
  var executeRef = React.useRef();
  var statesRef = React.useRef({
    fullscreen: fullscreen2,
    preview
  });
  useEffect(() => {
    statesRef.current = {
      fullscreen: fullscreen2,
      preview,
      highlightEnable
    };
  }, [fullscreen2, preview, highlightEnable]);
  useEffect(() => {
    if (textRef.current && dispatch) {
      var commandOrchestrator = new TextAreaCommandOrchestrator(textRef.current);
      executeRef.current = commandOrchestrator;
      dispatch({
        textarea: textRef.current,
        commandOrchestrator
      });
    }
  }, []);
  useEffect(() => {
    if (autoFocusEnd && textRef.current && textareaWarp) {
      textRef.current.focus();
      var length = textRef.current.value.length;
      textRef.current.setSelectionRange(length, length);
      setTimeout(() => {
        if (textareaWarp) {
          textareaWarp.scrollTop = textareaWarp.scrollHeight;
        }
        if (textRef.current) {
          textRef.current.scrollTop = textRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [textareaWarp]);
  var onKeyDown = (e) => {
    handleKeyDown(e, tabSize, defaultTabEnable);
    shortcutsHandle(e, [...commands || [], ...extraCommands || []], executeRef.current, dispatch, statesRef.current);
  };
  useEffect(() => {
    if (textRef.current) {
      textRef.current.addEventListener("keydown", onKeyDown);
    }
    return () => {
      if (textRef.current) {
        textRef.current.removeEventListener("keydown", onKeyDown);
      }
    };
  }, []);
  return /* @__PURE__ */ jsx("textarea", _extends({
    autoComplete: "off",
    autoCorrect: "off",
    autoCapitalize: "off",
    spellCheck: false
  }, other, {
    ref: textRef,
    className: prefixCls + "-text-input " + (other.className ? other.className : ""),
    value: markdown,
    onChange: (e) => {
      dispatch && dispatch({
        markdown: e.target.value
      });
      _onChange && _onChange(e);
    }
  }));
}
var _excluded$1 = ["prefixCls", "className", "onScroll", "renderTextarea"];
function createTextArea(options) {
  var _options$useMinHeight;
  var MarkdownComponent = options == null ? void 0 : options.Markdown;
  var useMinHeight = (_options$useMinHeight = options == null ? void 0 : options.useMinHeight) != null ? _options$useMinHeight : false;
  return function TextArea2(props) {
    var _ref = props || {}, {
      prefixCls,
      className,
      onScroll,
      renderTextarea
    } = _ref, otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$1);
    var {
      markdown,
      scrollTop,
      commands,
      minHeight,
      highlightEnable,
      extraCommands,
      dispatch
    } = useContext(EditorContext);
    var textRef = React.useRef(null);
    var executeRef = React.useRef();
    var warp = /* @__PURE__ */ React.createRef();
    useEffect(() => {
      var state = {};
      if (warp.current) {
        state.textareaWarp = warp.current || void 0;
        warp.current.scrollTop = scrollTop || 0;
      }
      if (dispatch) {
        dispatch(_extends({}, state));
      }
    }, []);
    useEffect(() => {
      if (textRef.current && dispatch) {
        var commandOrchestrator = new TextAreaCommandOrchestrator(textRef.current);
        executeRef.current = commandOrchestrator;
        dispatch({
          textarea: textRef.current,
          commandOrchestrator
        });
      }
    }, []);
    var textStyle = MarkdownComponent && highlightEnable ? {} : {
      WebkitTextFillColor: "initial",
      overflow: "auto"
    };
    return /* @__PURE__ */ jsx("div", {
      ref: warp,
      className: prefixCls + "-area " + (className || ""),
      onScroll,
      children: /* @__PURE__ */ jsx("div", {
        className: prefixCls + "-text",
        style: useMinHeight ? {
          minHeight
        } : void 0,
        children: renderTextarea ? /* @__PURE__ */ React.cloneElement(renderTextarea(_extends({}, otherProps, {
          value: markdown,
          autoComplete: "off",
          autoCorrect: "off",
          spellCheck: "false",
          autoCapitalize: "off",
          className: prefixCls + "-text-input",
          style: {
            WebkitTextFillColor: "inherit",
            overflow: "auto"
          }
        }), {
          dispatch,
          onChange: otherProps.onChange,
          shortcuts: shortcutsHandle,
          useContext: {
            commands,
            extraCommands,
            commandOrchestrator: executeRef.current
          }
        }), {
          ref: textRef
        }) : /* @__PURE__ */ jsxs(Fragment, {
          children: [MarkdownComponent && highlightEnable && /* @__PURE__ */ jsx(MarkdownComponent, {
            prefixCls
          }), /* @__PURE__ */ jsx(Textarea, _extends({
            prefixCls
          }, otherProps, {
            style: textStyle
          }))]
        })
      })
    });
  };
}
const TextArea = createTextArea({
  Markdown,
  useMinHeight: true
});
function Child(props) {
  var {
    prefixCls,
    groupName,
    commands,
    children
  } = props || {};
  var {
    barPopup = {}
  } = useContext(EditorContext);
  return useMemo(
    () => /* @__PURE__ */ jsx("div", {
      className: prefixCls + "-toolbar-child " + (groupName && barPopup[groupName] ? "active" : ""),
      onClick: (e) => e.stopPropagation(),
      children: Array.isArray(commands) ? /* @__PURE__ */ jsx(Toolbar, _extends({
        commands
      }, props, {
        isChild: true
      })) : children
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [commands, barPopup, groupName, prefixCls]
  );
}
function ToolbarItems(props) {
  var {
    prefixCls,
    overflow
  } = props;
  var {
    fullscreen: fullscreen2,
    preview,
    barPopup = {},
    components,
    commandOrchestrator,
    dispatch
  } = useContext(EditorContext);
  var originalOverflow = useRef("");
  function handleClick(command, name) {
    if (!dispatch) return;
    var state = {
      barPopup: _extends({}, barPopup)
    };
    if (command.keyCommand === "preview") {
      state.preview = command.value;
    }
    if (command.keyCommand === "fullscreen") {
      state.fullscreen = !fullscreen2;
    }
    if (props.commands && command.keyCommand === "group") {
      props.commands.forEach((item) => {
        if (name === item.groupName) {
          state.barPopup[name] = true;
        } else if (item.keyCommand) {
          state.barPopup[item.groupName] = false;
        }
      });
    } else if (name || command.parent) {
      Object.keys(state.barPopup || {}).forEach((keyName) => {
        state.barPopup[keyName] = false;
      });
    }
    if (Object.keys(state).length) {
      dispatch(_extends({}, state));
    }
    commandOrchestrator && commandOrchestrator.executeCommand(command);
  }
  useEffect(() => {
    if (document && overflow) {
      if (fullscreen2) {
        document.body.style.overflow = "hidden";
      } else {
        if (!originalOverflow.current) {
          originalOverflow.current = window.getComputedStyle(document.body, null).overflow;
        }
        document.body.style.overflow = originalOverflow.current;
      }
    }
  }, [fullscreen2, originalOverflow, overflow]);
  return /* @__PURE__ */ jsx("ul", {
    children: (props.commands || []).map((item, idx) => {
      if (item.keyCommand === "divider") {
        return /* @__PURE__ */ jsx("li", _extends({}, item.liProps, {
          className: prefixCls + "-toolbar-divider"
        }), idx);
      }
      if (!item.keyCommand) return /* @__PURE__ */ jsx(Fragment, {}, idx);
      var activeBtn = fullscreen2 && item.keyCommand === "fullscreen" || item.keyCommand === "preview" && preview === item.value;
      var childNode = item.children && typeof item.children === "function" ? item.children({
        getState: () => commandOrchestrator.getState(),
        textApi: commandOrchestrator ? commandOrchestrator.textApi : void 0,
        close: () => handleClick({}, item.groupName),
        execute: () => handleClick({
          execute: item.execute
        }),
        dispatch
      }) : void 0;
      var disabled = barPopup && preview && preview === "preview" && !/(preview|fullscreen)/.test(item.keyCommand);
      var render = (components == null ? void 0 : components.toolbar) || item.render;
      var com = render && typeof render === "function" ? render(item, !!disabled, handleClick, idx) : null;
      return /* @__PURE__ */ jsxs("li", _extends({}, item.liProps, {
        className: activeBtn ? "active" : "",
        children: [com && /* @__PURE__ */ React.isValidElement(com) && com, !com && !item.buttonProps && item.icon, !com && item.buttonProps && /* @__PURE__ */ React.createElement("button", _extends({
          type: "button",
          key: idx,
          disabled,
          "data-name": item.name
        }, item.buttonProps, {
          onClick: (evn) => {
            evn.stopPropagation();
            handleClick(item, item.groupName);
          }
        }), item.icon), item.children && /* @__PURE__ */ jsx(Child, {
          overflow,
          groupName: item.groupName,
          prefixCls,
          children: childNode,
          commands: Array.isArray(item.children) ? item.children : void 0
        })]
      }), idx);
    })
  });
}
function Toolbar(props) {
  if (props === void 0) {
    props = {};
  }
  var {
    prefixCls,
    isChild,
    className
  } = props;
  var {
    commands,
    extraCommands
  } = useContext(EditorContext);
  return /* @__PURE__ */ jsxs("div", {
    className: prefixCls + "-toolbar " + className,
    children: [/* @__PURE__ */ jsx(ToolbarItems, _extends({}, props, {
      commands: props.commands || commands || []
    })), !isChild && /* @__PURE__ */ jsx(ToolbarItems, _extends({}, props, {
      commands: extraCommands || []
    }))]
  });
}
function ToolbarVisibility(props) {
  var {
    hideToolbar,
    toolbarBottom,
    placement,
    overflow,
    prefixCls
  } = props;
  if (hideToolbar || placement === "bottom" && !toolbarBottom || placement === "top" && toolbarBottom) {
    return null;
  }
  var cls = toolbarBottom ? "bottom" : "";
  return /* @__PURE__ */ jsx(Toolbar, {
    prefixCls,
    overflow,
    className: cls
  });
}
var DragBar = (props) => {
  var {
    prefixCls,
    onChange
  } = props || {};
  var $dom = useRef(null);
  var dragRef = useRef();
  var heightRef = useRef(props.height);
  useEffect(() => {
    if (heightRef.current !== props.height) {
      heightRef.current = props.height;
    }
  }, [props.height]);
  function handleMouseMove(event) {
    if (dragRef.current) {
      var _changedTouches$;
      var clientY = event.clientY || ((_changedTouches$ = event.changedTouches[0]) == null ? void 0 : _changedTouches$.clientY);
      var newHeight = dragRef.current.height + clientY - dragRef.current.dragY;
      if (newHeight >= props.minHeight && newHeight <= props.maxHeight) {
        onChange && onChange(dragRef.current.height + (clientY - dragRef.current.dragY));
      }
    }
  }
  function handleMouseUp() {
    var _$dom$current, _$dom$current2;
    dragRef.current = void 0;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    (_$dom$current = $dom.current) == null || _$dom$current.removeEventListener("touchmove", handleMouseMove);
    (_$dom$current2 = $dom.current) == null || _$dom$current2.removeEventListener("touchend", handleMouseUp);
  }
  function handleMouseDown(event) {
    var _changedTouches$2, _$dom$current3, _$dom$current4;
    event.preventDefault();
    var clientY = event.clientY || ((_changedTouches$2 = event.changedTouches[0]) == null ? void 0 : _changedTouches$2.clientY);
    dragRef.current = {
      height: heightRef.current,
      dragY: clientY
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    (_$dom$current3 = $dom.current) == null || _$dom$current3.addEventListener("touchmove", handleMouseMove, {
      passive: false
    });
    (_$dom$current4 = $dom.current) == null || _$dom$current4.addEventListener("touchend", handleMouseUp, {
      passive: false
    });
  }
  useEffect(() => {
    if (document) {
      var _$dom$current5, _$dom$current6;
      (_$dom$current5 = $dom.current) == null || _$dom$current5.addEventListener("touchstart", handleMouseDown, {
        passive: false
      });
      (_$dom$current6 = $dom.current) == null || _$dom$current6.addEventListener("mousedown", handleMouseDown);
    }
    return () => {
      if (document) {
        var _$dom$current7;
        (_$dom$current7 = $dom.current) == null || _$dom$current7.removeEventListener("touchstart", handleMouseDown);
        document.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);
  var svg = useMemo(() => /* @__PURE__ */ jsx("svg", {
    viewBox: "0 0 512 512",
    height: "100%",
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M304 256c0 26.5-21.5 48-48 48s-48-21.5-48-48 21.5-48 48-48 48 21.5 48 48zm120-48c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48zm-336 0c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z"
    })
  }), []);
  return /* @__PURE__ */ jsx("div", {
    className: prefixCls + "-bar",
    ref: $dom,
    children: svg
  });
};
var _excluded = ["prefixCls", "className", "value", "commands", "commandsFilter", "direction", "extraCommands", "height", "enableScroll", "visibleDragbar", "highlightEnable", "preview", "fullscreen", "overflow", "previewOptions", "textareaProps", "maxHeight", "minHeight", "autoFocus", "autoFocusEnd", "tabSize", "defaultTabEnable", "onChange", "onStatistics", "onHeightChange", "hideToolbar", "toolbarBottom", "components", "renderTextarea"];
function setGroupPopFalse(data) {
  if (data === void 0) {
    data = {};
  }
  Object.keys(data).forEach((keyname) => {
    data[keyname] = false;
  });
  return data;
}
function createMDEditor(options) {
  var {
    MarkdownPreview: MarkdownPreview2,
    TextArea: TextArea2
  } = options;
  var PreviewComponent = MarkdownPreview2;
  var TextAreaComponent = TextArea2;
  var InternalMDEditor = /* @__PURE__ */ React.forwardRef((props, ref) => {
    var _ref = props || {}, {
      prefixCls = "w-md-editor",
      className,
      value: propsValue,
      commands = getCommands(),
      commandsFilter,
      direction,
      extraCommands = getExtraCommands(),
      height = 200,
      enableScroll = true,
      visibleDragbar = typeof props.visiableDragbar === "boolean" ? props.visiableDragbar : true,
      highlightEnable = true,
      preview: previewType = "live",
      fullscreen: fullscreen2 = false,
      overflow = true,
      previewOptions = {},
      textareaProps,
      maxHeight = 1200,
      minHeight = 100,
      autoFocus,
      autoFocusEnd = false,
      tabSize = 2,
      defaultTabEnable = false,
      onChange,
      onStatistics,
      onHeightChange,
      hideToolbar,
      toolbarBottom = false,
      components,
      renderTextarea
    } = _ref, other = _objectWithoutPropertiesLoose(_ref, _excluded);
    var cmds = commands.map((item) => commandsFilter ? commandsFilter(item, false) : item).filter(Boolean);
    var extraCmds = extraCommands.map((item) => commandsFilter ? commandsFilter(item, true) : item).filter(Boolean);
    var [state, dispatch] = useReducer(reducer, {
      markdown: propsValue,
      preview: previewType,
      components,
      height,
      minHeight,
      highlightEnable,
      tabSize,
      defaultTabEnable,
      scrollTop: 0,
      scrollTopPreview: 0,
      commands: cmds,
      extraCommands: extraCmds,
      fullscreen: fullscreen2,
      barPopup: {}
    });
    var container = useRef(null);
    var previewRef = useRef(null);
    var enableScrollRef = useRef(enableScroll);
    useImperativeHandle(ref, () => _extends({}, state, {
      container: container.current,
      dispatch
    }));
    useMemo(() => enableScrollRef.current = enableScroll, [enableScroll]);
    useEffect(() => {
      var stateInit = {};
      if (container.current) {
        stateInit.container = container.current || void 0;
      }
      stateInit.markdown = propsValue || "";
      stateInit.barPopup = {};
      if (dispatch) {
        dispatch(_extends({}, state, stateInit));
      }
    }, []);
    var cls = [className, "wmde-markdown-var", direction ? prefixCls + "-" + direction : null, prefixCls, state.preview ? prefixCls + "-show-" + state.preview : null, state.fullscreen ? prefixCls + "-fullscreen" : null].filter(Boolean).join(" ").trim();
    useMemo(() => propsValue !== state.markdown && dispatch({
      markdown: propsValue || ""
    }), [propsValue, state.markdown]);
    useMemo(() => previewType !== state.preview && dispatch({
      preview: previewType
    }), [previewType]);
    useMemo(() => tabSize !== state.tabSize && dispatch({
      tabSize
    }), [tabSize]);
    useMemo(
      () => highlightEnable !== state.highlightEnable && dispatch({
        highlightEnable
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [highlightEnable]
    );
    useMemo(() => autoFocus !== state.autoFocus && dispatch({
      autoFocus
    }), [autoFocus]);
    useMemo(() => autoFocusEnd !== state.autoFocusEnd && dispatch({
      autoFocusEnd
    }), [autoFocusEnd]);
    useMemo(
      () => fullscreen2 !== state.fullscreen && dispatch({
        fullscreen: fullscreen2
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [fullscreen2]
    );
    useMemo(() => height !== state.height && dispatch({
      height
    }), [height]);
    useMemo(() => height !== state.height && onHeightChange && onHeightChange(state.height, height, state), [height, onHeightChange, state]);
    useMemo(() => commands !== state.commands && dispatch({
      commands: cmds
    }), [props.commands]);
    useMemo(() => extraCommands !== state.extraCommands && dispatch({
      extraCommands: extraCmds
    }), [props.extraCommands]);
    var textareaDomRef = useRef();
    var active = useRef("preview");
    var initScroll = useRef(false);
    useMemo(() => {
      textareaDomRef.current = state.textareaWarp;
      if (state.textareaWarp) {
        state.textareaWarp.addEventListener("mouseover", () => {
          active.current = "text";
        });
        state.textareaWarp.addEventListener("mouseleave", () => {
          active.current = "preview";
        });
      }
    }, [state.textareaWarp]);
    var handleScroll = (e, type) => {
      if (!enableScrollRef.current) return;
      var textareaDom = textareaDomRef.current;
      var previewDom = previewRef.current ? previewRef.current : void 0;
      if (!initScroll.current) {
        active.current = type;
        initScroll.current = true;
      }
      if (textareaDom && previewDom) {
        var scale = (textareaDom.scrollHeight - textareaDom.offsetHeight) / (previewDom.scrollHeight - previewDom.offsetHeight);
        if (e.target === textareaDom && active.current === "text") {
          previewDom.scrollTop = textareaDom.scrollTop / scale;
        }
        if (e.target === previewDom && active.current === "preview") {
          textareaDom.scrollTop = previewDom.scrollTop * scale;
        }
        var scrollTop = 0;
        if (active.current === "text") {
          scrollTop = textareaDom.scrollTop || 0;
        } else if (active.current === "preview") {
          scrollTop = previewDom.scrollTop || 0;
        }
        dispatch({
          scrollTop
        });
      }
    };
    var previewClassName = prefixCls + "-preview " + (previewOptions.className || "");
    var handlePreviewScroll = (e) => handleScroll(e, "preview");
    var mdPreview = useMemo(() => /* @__PURE__ */ jsx("div", {
      ref: previewRef,
      className: previewClassName,
      children: /* @__PURE__ */ jsx(PreviewComponent, _extends({}, previewOptions, {
        onScroll: handlePreviewScroll,
        source: state.markdown || ""
      }))
    }), [previewClassName, previewOptions, state.markdown]);
    var preview = (components == null ? void 0 : components.preview) && (components == null ? void 0 : components.preview(state.markdown || "", state, dispatch));
    if (preview && /* @__PURE__ */ React.isValidElement(preview)) {
      mdPreview = /* @__PURE__ */ jsx("div", {
        className: previewClassName,
        ref: previewRef,
        onScroll: handlePreviewScroll,
        children: preview
      });
    }
    var containerStyle = _extends({}, other.style, {
      height: state.height || "100%"
    });
    var containerClick = () => dispatch({
      barPopup: _extends({}, setGroupPopFalse(state.barPopup))
    });
    var dragBarChange = (newHeight) => dispatch({
      height: newHeight
    });
    var changeHandle = (evn) => {
      onChange && onChange(evn.target.value, evn, state);
      if (textareaProps && textareaProps.onChange) {
        textareaProps.onChange(evn);
      }
      if (state.textarea && state.textarea instanceof HTMLTextAreaElement && onStatistics) {
        var obj = new TextAreaCommandOrchestrator(state.textarea);
        var objState = obj.getState() || {};
        onStatistics(_extends({}, objState, {
          lineCount: evn.target.value.split("\n").length,
          length: evn.target.value.length
        }));
      }
    };
    return /* @__PURE__ */ jsx(EditorContext.Provider, {
      value: _extends({}, state, {
        dispatch
      }),
      children: /* @__PURE__ */ jsxs("div", _extends({
        ref: container,
        className: cls
      }, other, {
        onClick: containerClick,
        style: containerStyle,
        children: [/* @__PURE__ */ jsx(ToolbarVisibility, {
          hideToolbar,
          toolbarBottom,
          prefixCls,
          overflow,
          placement: "top"
        }), /* @__PURE__ */ jsxs("div", {
          className: prefixCls + "-content",
          children: [/(edit|live)/.test(state.preview || "") && /* @__PURE__ */ jsx(TextAreaComponent, _extends({
            className: prefixCls + "-input",
            prefixCls,
            autoFocus
          }, textareaProps, {
            onChange: changeHandle,
            renderTextarea: (components == null ? void 0 : components.textarea) || renderTextarea,
            onScroll: (e) => handleScroll(e, "text")
          })), /(live|preview)/.test(state.preview || "") && mdPreview]
        }), visibleDragbar && !state.fullscreen && /* @__PURE__ */ jsx(DragBar, {
          prefixCls,
          height: state.height,
          maxHeight,
          minHeight,
          onChange: dragBarChange
        }), /* @__PURE__ */ jsx(ToolbarVisibility, {
          hideToolbar,
          toolbarBottom,
          prefixCls,
          overflow,
          placement: "bottom"
        })]
      }))
    });
  });
  var Editor = InternalMDEditor;
  Editor.Markdown = MarkdownPreview2;
  Editor.displayName = "MDEditor";
  return Editor;
}
const MDEditor = createMDEditor({
  MarkdownPreview,
  TextArea
});
export {
  EditorContext,
  TextAreaCommandOrchestrator,
  TextAreaTextApi,
  bold,
  checkedListCommand,
  code,
  codeBlock,
  codeEdit,
  codeLive,
  codePreview,
  comment,
  MDEditor as default,
  divider,
  executeCommand,
  fullscreen,
  getBreaksNeededForEmptyLineAfter,
  getBreaksNeededForEmptyLineBefore,
  getCommands,
  getExtraCommands,
  getStateFromTextArea,
  getSurroundingWord,
  group,
  handleKeyDown,
  heading1,
  heading2,
  heading3,
  heading4,
  heading5,
  heading6,
  headingExecute,
  help,
  hr,
  image,
  insertBeforeEachLine,
  insertTextAtPosition,
  italic,
  link,
  orderedListCommand,
  quote,
  reducer,
  selectLine,
  selectWord,
  shortcutsHandle as shortcuts,
  strikethrough,
  table,
  title1,
  title2,
  title3,
  title4,
  title5,
  title6,
  unorderedListCommand
};
