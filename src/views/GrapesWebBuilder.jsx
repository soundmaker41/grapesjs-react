import { useEffect, useRef } from "react";
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs/dist/grapes.min.js';

/*
'grapesjs-plugin-forms',
          'grapesjs-component-countdown',
          'grapesjs-plugin-export',
          'grapesjs-tabs', // Unable to use with Typescript
          'grapesjs-custom-code',
          'grapesjs-touch',
          'grapesjs-parser-postcss',
          'grapesjs-tooltip',
          'grapesjs-tui-image-editor',
          'grapesjs-typed',
          'grapesjs-style-bg',
          'grapesjs-preset-webpage',
*/
import grapesPresetWebPlugin from 'grapesjs-preset-webpage';
import grapesBlocksBasicPlugin from "grapesjs-blocks-basic";
import grapesExportPlugin from "grapesjs-plugin-export";
import grapesFormsPlugin from "grapesjs-plugin-forms";
import grapesComponentCountdownPlugin from "grapesjs-component-countdown";
import grapesCustomCodePlugin from "grapesjs-custom-code";
import grapesParserPostCSSPlugin from "grapesjs-parser-postcss";
import grapesTooltipPlugin from "grapesjs-tooltip";
import grapesTUIImageEditorPlugin from "grapesjs-tui-image-editor";
import grapesTypedPlugin from "grapesjs-typed";
import grapesStyleBGPlugin from "grapesjs-style-bg";
import grapesCKEditorPlugin from "grapesjs-plugin-ckeditor";
import { readImgs } from "./../external/exportImages.js"
import {testImage} from "./../external/testImageInBase64.js";

const ASSET_IMAGE_PATH = "../assets/img";

export function GrapesWebBuilder() {

    const editorRef = useRef(null);

    useEffect(() => {
        grapesjs.init({
            container: editorRef.current,
            height: "100vh",
            width: "100%",
            fromElement: true,
            showOffsets: true,
            assetManager: {
                embedAsBase64: true,
                assets: [
                    ASSET_IMAGE_PATH + "/team1.jpg",
                    ASSET_IMAGE_PATH + "/team2.jpg",
                    ASSET_IMAGE_PATH + "/team3.jpg"

                ]
            },
            selectorManager: { componentFirst: true },
            styleManager: {
                sectors: [{
                    name: 'General',
                    properties: [
                        {
                            extend: 'float',
                            type: 'radio',
                            default: 'none',
                            options: [
                                { value: 'none', className: 'fa fa-times' },
                                { value: 'left', className: 'fa fa-align-left' },
                                { value: 'right', className: 'fa fa-align-right' }
                            ],
                        },
                        'display',
                        { extend: 'position', type: 'select' },
                        'top',
                        'right',
                        'left',
                        'bottom',
                    ],
                }, {
                    name: 'Dimension',
                    open: false,
                    properties: [
                        'width',
                        {
                            id: 'flex-width',
                            type: 'integer',
                            name: 'Width',
                            units: ['px', '%'],
                            property: 'flex-basis',
                            toRequire: 1,
                        },
                        'height',
                        'max-width',
                        'min-height',
                        'margin',
                        'padding'
                    ],
                }, {
                    name: 'Typography',
                    open: false,
                    properties: [
                        'font-family',
                        'font-size',
                        'font-weight',
                        'letter-spacing',
                        'color',
                        'line-height',
                        {
                            extend: 'text-align',
                            options: [
                                { id: 'left', label: 'Left', className: 'fa fa-align-left' },
                                { id: 'center', label: 'Center', className: 'fa fa-align-center' },
                                { id: 'right', label: 'Right', className: 'fa fa-align-right' },
                                { id: 'justify', label: 'Justify', className: 'fa fa-align-justify' }
                            ],
                        },
                        {
                            property: 'text-decoration',
                            type: 'radio',
                            default: 'none',
                            options: [
                                { id: 'none', label: 'None', className: 'fa fa-times' },
                                { id: 'underline', label: 'underline', className: 'fa fa-underline' },
                                { id: 'line-through', label: 'Line-through', className: 'fa fa-strikethrough' }
                            ],
                        },
                        'text-shadow'
                    ],
                }, {
                    name: 'Decorations',
                    open: false,
                    properties: [
                        'opacity',
                        'border-radius',
                        'border',
                        'box-shadow',
                        'background', // { id: 'background-bg', property: 'background', type: 'bg' }
                    ],
                }, {
                    name: 'Extra',
                    open: false,
                    buildProps: [
                        'transition',
                        'perspective',
                        'transform'
                    ],
                }, {
                    name: 'Flex',
                    open: false,
                    properties: [{
                        name: 'Flex Container',
                        property: 'display',
                        type: 'select',
                        defaults: 'block',
                        list: [
                            { value: 'block', name: 'Disable' },
                            { value: 'flex', name: 'Enable' }
                        ],
                    }, {
                        name: 'Flex Parent',
                        property: 'label-parent-flex',
                        type: 'integer',
                    }, {
                        name: 'Direction',
                        property: 'flex-direction',
                        type: 'radio',
                        defaults: 'row',
                        list: [{
                            value: 'row',
                            name: 'Row',
                            className: 'icons-flex icon-dir-row',
                            title: 'Row',
                        }, {
                            value: 'row-reverse',
                            name: 'Row reverse',
                            className: 'icons-flex icon-dir-row-rev',
                            title: 'Row reverse',
                        }, {
                            value: 'column',
                            name: 'Column',
                            title: 'Column',
                            className: 'icons-flex icon-dir-col',
                        }, {
                            value: 'column-reverse',
                            name: 'Column reverse',
                            title: 'Column reverse',
                            className: 'icons-flex icon-dir-col-rev',
                        }],
                    }, {
                        name: 'Justify',
                        property: 'justify-content',
                        type: 'radio',
                        defaults: 'flex-start',
                        list: [{
                            value: 'flex-start',
                            className: 'icons-flex icon-just-start',
                            title: 'Start',
                        }, {
                            value: 'flex-end',
                            title: 'End',
                            className: 'icons-flex icon-just-end',
                        }, {
                            value: 'space-between',
                            title: 'Space between',
                            className: 'icons-flex icon-just-sp-bet',
                        }, {
                            value: 'space-around',
                            title: 'Space around',
                            className: 'icons-flex icon-just-sp-ar',
                        }, {
                            value: 'center',
                            title: 'Center',
                            className: 'icons-flex icon-just-sp-cent',
                        }],
                    }, {
                        name: 'Align',
                        property: 'align-items',
                        type: 'radio',
                        defaults: 'center',
                        list: [{
                            value: 'flex-start',
                            title: 'Start',
                            className: 'icons-flex icon-al-start',
                        }, {
                            value: 'flex-end',
                            title: 'End',
                            className: 'icons-flex icon-al-end',
                        }, {
                            value: 'stretch',
                            title: 'Stretch',
                            className: 'icons-flex icon-al-str',
                        }, {
                            value: 'center',
                            title: 'Center',
                            className: 'icons-flex icon-al-center',
                        }],
                    }, {
                        name: 'Flex Children',
                        property: 'label-parent-flex',
                        type: 'integer',
                    }, {
                        name: 'Order',
                        property: 'order',
                        type: 'integer',
                        defaults: 0,
                        min: 0
                    }, {
                        name: 'Flex',
                        property: 'flex',
                        type: 'composite',
                        properties: [{
                            name: 'Grow',
                            property: 'flex-grow',
                            type: 'integer',
                            defaults: 0,
                            min: 0
                        }, {
                            name: 'Shrink',
                            property: 'flex-shrink',
                            type: 'integer',
                            defaults: 0,
                            min: 0
                        }, {
                            name: 'Basis',
                            property: 'flex-basis',
                            type: 'integer',
                            units: ['px', '%', ''],
                            unit: '',
                            defaults: 'auto',
                        }],
                    }, {
                        name: 'Align',
                        property: 'align-self',
                        type: 'radio',
                        defaults: 'auto',
                        list: [{
                            value: 'auto',
                            name: 'Auto',
                        }, {
                            value: 'flex-start',
                            title: 'Start',
                            className: 'icons-flex icon-al-start',
                        }, {
                            value: 'flex-end',
                            title: 'End',
                            className: 'icons-flex icon-al-end',
                        }, {
                            value: 'stretch',
                            title: 'Stretch',
                            className: 'icons-flex icon-al-str',
                        }, {
                            value: 'center',
                            title: 'Center',
                            className: 'icons-flex icon-al-center',
                        }],
                    }]
                }
                ],
            },
            storageManager: {
                id: 'gjs-',
                type: 'local',
                autosave: true,
                autoload: false,

            },
            deviceManager: {
                devices:
                    [
                        {
                            id: 'desktop',
                            name: 'Desktop',
                            width: '',
                        },
                        {
                            id: 'tablet',
                            name: 'Tablet',
                            width: '768px',
                            widthMedia: '992px',
                        },
                        {
                            id: 'mobilePortrait',
                            name: 'Mobile portrait',
                            width: '320px',
                            widthMedia: '575px',
                        },
                    ]
            },

            plugins: [
                (editor) => {
                    return grapesPresetWebPlugin(editor, {
                        //blocks: ['link-block', 'quote', 'text-basic'],
                        modalImportTitle: 'Import Template',
                        modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
                        modalImportContent(editor) {
                            return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
                        },
                    })
                },
                (editor) => {
                    return grapesBlocksBasicPlugin(editor, {
                        flexGrid: true
                    })
                },
                (editor) => {
                    return grapesExportPlugin(editor, {
                        root: {
                            css: {
                                "style.css": editor => { return editor.getCss(); }
                            },
                            "index.html": editor => {
                                return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
        <link rel="stylesheet" href="./css/style.css"/>
    </head>
    <body>${editor.getHtml()}</body>
</html>`;
                            }
                        }
                    })
                },
                (editor) => {
                    return grapesFormsPlugin(editor, {

                    })
                },
                (editor) => {
                    return grapesComponentCountdownPlugin(editor, {

                    })
                },
                (editor) => {
                    return grapesCustomCodePlugin(editor, {

                    })
                },
                (editor) => {
                    return grapesParserPostCSSPlugin(editor, {

                    })
                },

                (editor) => {
                    return grapesTooltipPlugin(editor, {

                    })
                },
                (editor) => {
                    return grapesTUIImageEditorPlugin(editor, {
                        script: [
                            // 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.6.7/fabric.min.js',
                            'https://uicdn.toast.com/tui.code-snippet/v1.5.2/tui-code-snippet.min.js',
                            'https://uicdn.toast.com/tui-color-picker/v2.2.7/tui-color-picker.min.js',
                            'https://uicdn.toast.com/tui-image-editor/v3.15.2/tui-image-editor.min.js'
                        ],
                        style: [
                            'https://uicdn.toast.com/tui-color-picker/v2.2.7/tui-color-picker.min.css',
                            'https://uicdn.toast.com/tui-image-editor/v3.15.2/tui-image-editor.min.css',
                        ],
                    })
                },
                (editor) => {
                    return grapesTypedPlugin(editor, {
                        block: {
                            category: 'Extra',
                            content: {
                                type: 'typed',
                                'type-speed': 40,
                                strings: [
                                    'Text row one',
                                    'Text row two',
                                    'Text row three',
                                ],
                            }
                        }
                    })
                },
                (editor) => {
                    return grapesStyleBGPlugin(editor, {
                        
                    })
                },
                (editor) => {
                    return grapesCKEditorPlugin(editor, {
                        options:{
                            startupFocus: true,
                            extraAllowedContent: '*(*);*{*}', // Allows any class and any inline style
                            allowedContent: true, // Disable auto-formatting, class removing, etc.
                            enterMode: 2, // CKEDITOR.ENTER_BR,
                            extraPlugins: 'sharedspace,justify,colorbutton,panelbutton,font',
                            // toolbar: [
                            //     { name: 'styles', items: ['Font', 'FontSize' ] },
                            //     ['Bold', 'Italic', 'Underline', 'Strike'],
                            //     {name: 'paragraph', items : [ 'NumberedList', 'BulletedList']},
                            //     {name: 'links', items: ['Link', 'Unlink']},
                            //     {name: 'colors', items: [ 'TextColor', 'BGColor' ]},
                            // ],
                        }
                        
                    })
                }
            ]
        })
    }, []);


    return (
        <div ref={editorRef}></div>
    );
}
