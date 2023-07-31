/*
Copied entirely from https://github.com/GrapesJS/ckeditor/blob/master/src/index.ts
To update this for Prosemirror
*/

import type { Plugin, CustomRTE } from 'grapesjs';
import type CKE from 'ckeditor4';

//Prosemirror imports
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"


export type PluginOptions = {
  /**
   * CKEditor's configuration options.
   * @see https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html
   * @default {}
   */
  //options?: CKE.config;

  /**
   * Pass CKEDITOR constructor or the CDN string from which the CKEDITOR will be loaded.
   * If this option is empty, the plugin will also check the global scope (eg. window.CKEDITOR)
   * @default 'https://cdn.ckeditor.com/4.21.0/standard-all/ckeditor.js'
   */
  ckeditor?: CKE.CKEditorStatic | string;

  /**
   * Position side of the toolbar.
   * @default 'left'
   */
  position?: 'left' | 'center' | 'right';

  /**
   * Extend the default customRTE interface.
   * @see https://grapesjs.com/docs/guides/Replace-Rich-Text-Editor.html
   * @default {}
   * @example
   * customRte: { parseContent: true, ... },
   */
  customRte?: Partial<CustomRTE>;

  /**
   * Customize CKEditor toolbar element once created.
   * @example
   * onToolbar: (el) => {
   *  el.style.minWidth = '350px';
   * }
   */
  onToolbar?: (toolbar: HTMLElement) => void;
};

const isString = (value: any): value is string => typeof value === 'string';

const loadFromCDN = (url: string) => {
  const scr = document.createElement('script');
  scr.src = url;
  document.head.appendChild(scr);
  return scr;
}

const forEach = <T extends HTMLElement = HTMLElement>(items: Iterable<T>, clb: (item: T) => void) => {
  [].forEach.call(items, clb);
}

const stopPropagation = (ev: Event) => ev.stopPropagation();

const plugin: Plugin<PluginOptions> = (editor, options = {}) => {
  const opts: Required<PluginOptions> = {
    //options: {},
    customRte: {},
    position: 'left',
    //ckeditor: 'https://cdn.ckeditor.com/ckeditor5/38.1.1/classic/ckeditor.js',
    ckeditor: 'https://cdn.ckeditor.com/4.21.0/standard-all/ckeditor.js',
    onToolbar: () => {},
    ...options,
  };

  let ck: CKE.CKEditorStatic | undefined;
  const { ckeditor } = opts;
  const hasWindow = typeof window !== 'undefined';
  let dynamicLoad = false;

  // Check and load CKEDITOR constructor
  if (ckeditor) {
    if (isString(ckeditor)) {
      if (hasWindow) {
        dynamicLoad = true;
        const scriptEl = loadFromCDN(ckeditor);
        scriptEl.onload = () => {
          ck = window.CKEDITOR;
        }
      }
    } else if (ckeditor.inline!) {
      ck = ckeditor;
    }
  } else if (hasWindow) {
    ck = window.CKEDITOR;
  }

  const updateEditorToolbars = () => setTimeout(() => editor.refresh(), 0);
  const logCkError = () => {
    editor.log('CKEDITOR instance not found', { level: 'error' })
  };

  if (!ck && !dynamicLoad) {
    return logCkError();
  }

  const focus = (el: HTMLElement, rte? : any) => {
    if (rte?.focusManager?.hasFocus) return;
    el.contentEditable = 'true';
    rte?.focus();
    updateEditorToolbars();
  };


  editor.setCustomRte({
    
    getContent(el, rte: CKE.editor) {
      return rte.getData();
    },

    enable(el, rte?: Object) {

       /**
       * Enabling the custom RTE
       * @param  {HTMLElement} el This is the HTML node which was selected to be edited
       * @param  {Object} rte It's the instance you'd return from the first call of enable().
       *                      At the first call it'd be undefined. This is useful when you need
       *                      to check if the RTE is already enabled on the component
       * @return {Object} The return should be the RTE initialized instance
       */

        // If already exists I'll just focus on it
        if(rte) {
            focus(el, rte);
            return rte;
        }

        // Mix the nodes from prosemirror-schema-list into the basic schema to
        // create a schema with list support.
        const mySchema = new Schema({
            nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
            marks: schema.spec.marks
        });

        const returnedRTEObject = new EditorView(el, {
        state: EditorState.create({
            doc: DOMParser.fromSchema(mySchema).parse(el),
            plugins: exampleSetup({schema: mySchema})
        })
        })

        //window.view = returnedRTEObject;

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

    disable(el, rte?: CKE.editor) {
      el.contentEditable = 'false';
      rte?.focusManager?.blur(true);
    },

    ...opts.customRte,
  });

  // Update RTE toolbar position
  editor.on('rteToolbarPosUpdate', (pos: any) => {
    const { elRect } = pos;

    switch (opts.position) {
      case 'center':
        pos.left = (elRect.width / 2) - (pos.targetWidth / 2);
        break;
      case 'right':
        pos.left = ''
        pos.right = 0;
        break;
    }
  });
};

export default plugin;