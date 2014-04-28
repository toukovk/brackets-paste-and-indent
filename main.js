/*jslint vars: true, nomen: true */
/*global define, $, brackets */

// When code is pasted in the editor, re-indent the changed lines.
define(function (require, exports, module) {
    "use strict";

    var AppInit = brackets.getModule("utils/AppInit"),
        DocumentManger = brackets.getModule("document/DocumentManager"),
        EditorManager = brackets.getModule("editor/EditorManager");

    // Tell CodeMirror to re-indent the document between two lines.
    function reindentLines(codeMirror, lineFrom, lineTo) {
        // Everything within the `operation` method get batched into 1 update.
        codeMirror.operation(function () {
            codeMirror.eachLine(lineFrom, lineTo, function (lineHandle) {
                codeMirror.indentLine(lineHandle.lineNo(), "smart");
            });
        });
    }

    // When the document changes, listen for 'paste' changes in the editor.
    $(DocumentManger).on("currentDocumentChange", function () {
        var editor = EditorManager.getCurrentFullEditor();
        if (!editor) {
            return;
        }
        var codeMirror = editor._codeMirror;
        codeMirror.on("change", function (codeMirror, change) {
            if (change.origin !== "paste") {
                return;
            }

            var lineFrom = change.from.line,
                lineTo = change.from.line + change.text.length;

            reindentLines(codeMirror, lineFrom, lineTo);
        });
    });
});
