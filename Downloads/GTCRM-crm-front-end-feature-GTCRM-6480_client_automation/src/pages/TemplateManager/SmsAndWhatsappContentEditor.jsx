import { Box } from "@mui/material";
import CharacterCount from "@tiptap/extension-character-count";
import Mention from "@tiptap/extension-mention";
import { Editor, EditorContent, ReactRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { MentionList } from "./MentionList";
import tippy from "tippy.js";
import CharacterLimit from "./CharacterLimit";
const SmsAndWhatsappContentEditor = ({
  contentLimit,
  setEditorContent,
  editorContent,
  setTextContent,
  templateMergeKaysList,
}) => {
  const [isFocusedEditor, setIsFocusedEditor] = useState(false);
  const [isBlurEditor, setIsBlurEditor] = useState(false);
  const [editor, setEditor] = useState(
    new Editor({
      extensions: [
        StarterKit,
        CharacterCount.configure({
          limit: contentLimit,
        }),
      ],
    })
  );
  const [isEditorSet, setIsEditorSet] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (!isEditorSet) {
        const editor = new Editor({
          extensions: [
            StarterKit,
            Mention.configure({
              HTMLAttributes: {
                class: "sms-merge-tag",
              },
              renderLabel({ node }) {
                return `${node.attrs.id}`;
              },
              suggestion: {
                char: "/",
                items: ({ query }) => {
                  return templateMergeKaysList.filter((item) =>
                    item?.name.toLowerCase().startsWith(query.toLowerCase())
                  );
                },

                render: () => {
                  let reactRenderer;
                  let popup;

                  return {
                    onStart: (props) => {
                      if (!props.clientRect) {
                        return;
                      }

                      reactRenderer = new ReactRenderer(MentionList, {
                        props,
                        editor: props.editor,
                      });
                      popup = tippy("body", {
                        getReferenceClientRect: props.clientRect,
                        appendTo: () => document.body,
                        content: reactRenderer.element,
                        showOnCreate: true,
                        interactive: true,
                        trigger: "manual",
                        placement: "bottom-start",
                      });
                    },

                    onUpdate(props) {
                      reactRenderer.updateProps(props);

                      if (!props.clientRect) {
                        return;
                      }

                      popup[0].setProps({
                        getReferenceClientRect: props.clientRect,
                      });
                    },

                    onKeyDown(props) {
                      if (props.event.key === "Escape") {
                        popup[0].hide();

                        return true;
                      }

                      return reactRenderer.ref?.onKeyDown(props);
                    },

                    onExit() {
                      popup[0].destroy();
                      reactRenderer.destroy();
                    },
                  };
                },
              },
            }),
            CharacterCount.configure({
              limit: contentLimit,
            }),
          ],
          content: editorContent,
          onFocus() {
            setIsFocusedEditor(true);
            setIsBlurEditor(false);
          },
          onBlur({ editor }) {
            setIsBlurEditor(true);
            if (!editor?.getText()?.length) {
              setIsFocusedEditor(false);
            }
          },
          onUpdate({ editor }) {
            setEditorContent(editor?.getHTML());
            setTextContent(editor.getText());
          },
        });
        setEditor(editor);
        setIsFocusedEditor(editorContent?.length ? true : false);
        setIsEditorSet(true);
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorContent, templateMergeKaysList]);

  const editorInputCount = editor
    ? editor?.storage.characterCount.characters()
    : 0;
  const textFillPercentage = editor
    ? Math.round((100 / contentLimit) * editorInputCount)
    : 0;

  if (!editor) {
    return null;
  }

  return (
    <Box className="sms-editor-container" sx={{ mt: 0, mb: 1 }}>
      <Box className="sms-editor-label-container">
        <span
          style={{
            color: isBlurEditor && editor?.getText()?.length ? "#65748b" : "",
          }}
          className={
            isFocusedEditor ? "sms-editor-label" : "sms-editor-placeholder"
          }
        >
          Content *
        </span>
      </Box>

      <EditorContent editor={editor}/>
      {editor && (
        <CharacterLimit
          editorInputCount={editorInputCount}
          contentLimit={contentLimit}
          textFillPercentage={textFillPercentage}
        />
      )}
      <span className="sms-editor-helper-text">
        You can press <code>/</code> to add tag
      </span>
    </Box>
  );
};

export default SmsAndWhatsappContentEditor;
