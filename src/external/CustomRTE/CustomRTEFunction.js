import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"

// IMPORTANT: place the code in a new plugin
const customRTE = (editor) => {
    const focus = (el, rte) => {
      // implemented later
      el.contentEditable = 'true';
      rte.focused = "true";
    }
  
    editor.setCustomRte({
      getContent(el, rte) {
        return rte.docView.contentDOM.innerHTML;
      },
      /**
       * Enabling the custom RTE
       * @param  {HTMLElement} el This is the HTML node which was selected to be edited
       * @param  {Object} rte It's the instance you'd return from the first call of enable().
       *                      At the first call it'd be undefined. This is useful when you need
       *                      to check if the RTE is already enabled on the component
       * @return {Object} The return should be the RTE initialized instance
       */
      enable(el, rte) {
        // If already exists just focus
        if (rte) {
          focus(el, rte);
          return rte;
        }

        // Mix the nodes from prosemirror-schema-list into the basic schema to
        // create a schema with list support.
        const mySchema = new Schema({
          nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
          marks: schema.spec.marks
        });

        //const editorElement = el.parentElement;
        const editorElement = document.querySelector("#pm-editor");
        const returnedRTEObject = new EditorView(editorElement, {
          state: EditorState.create({
            doc: DOMParser.fromSchema(mySchema).parse(el),
            plugins: exampleSetup({schema: mySchema})
          })
        })

        window.view = returnedRTEObject;
        console.log(returnedRTEObject);
  
        // CKEditor initialization
        // rte = CKEDITOR.inline(el, {
        //   // Your configurations...
        // //   toolbar: [...],
        //   // IMPORTANT
        //   // Generally, inline editors are attached exactly at the same position of
        //   // the selected element but in this case it'd work until you start to scroll
        //   // the canvas. For this reason you have to move the RTE's toolbar inside the
        //   // one from GrapesJS. For this purpose we used a plugin which simplify
        //   // this process and move all next CKEditor's toolbars inside our indicated
        //   // element
        //   sharedSpaces: {
        //     top: editor.RichTextEditor.getToolbarEl(),
        //   }
        // });
  
        focus(el, returnedRTEObject);
        return returnedRTEObject;
      },
      disable(el, rte) {
        el.contentEditable = 'false';
        rte.focused = "false";
        //rte?.focusManager?.blur(true);
      },
    });
  }
  

  export default customRTE;