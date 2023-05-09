// 表单属性【右面板】
export const formConf = {
    formRef: 'elForm',
    formModel: 'formData',
    size: 'medium',
    labelPosition: 'right',
    labelWidth: 100,
    formRules: 'rules',
    gutter: 15,
    disabled: false,
    span: 24,
    formBtns: true
}

// 输入型组件 【左面板】
export const inputComponents = [
    {
        // 组件的自定义配置
        __config__: {
            label: '单行文本',
            labelWidth: null,
            showLabel: true,
            changeTag: true,
            tag: 'el-input',
            tagIcon: 'input',
            defaultValue: undefined,
            required: true,
            layout: 'colFormItem',
            span: 24,
            document: 'https://element.eleme.cn/#/zh-CN/component/input',
            // 正则校验规则
            regList: []
        },
        // 组件的插槽属性
        __slot__: {
            prepend: '',
            append: ''
        },
        // 其余的为可直接写在组件标签上的属性
        placeholder: '请输入',
        style: { width: '100%' },
        clearable: true,
        'prefix-icon': '',
        'suffix-icon': '',
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false
    },
    {
        __config__: {
            label: '多行文本',
            labelWidth: null,
            showLabel: true,
            tag: 'el-input',
            tagIcon: 'textarea',
            defaultValue: undefined,
            required: true,
            layout: 'colFormItem',
            span: 24,
            regList: [],
            changeTag: true,
            document: 'https://element.eleme.cn/#/zh-CN/component/input'
        },
        type: 'textarea',
        placeholder: '请输入',
        autosize: {
            minRows: 4,
            maxRows: 4
        },
        style: { width: '100%' },
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false
    },
    {
        __config__: {
            label: '密码',
            showLabel: true,
            labelWidth: null,
            changeTag: true,
            tag: 'el-input',
            tagIcon: 'password',
            defaultValue: undefined,
            layout: 'colFormItem',
            span: 24,
            required: true,
            regList: [],
            document: 'https://element.eleme.cn/#/zh-CN/component/input'
        },
        __slot__: {
            prepend: '',
            append: ''
        },
        placeholder: '请输入',
        'show-password': true,
        style: { width: '100%' },
        clearable: true,
        'prefix-icon': '',
        'suffix-icon': '',
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false
    },
    {
        __config__: {
            label: '计数器',
            showLabel: true,
            changeTag: true,
            labelWidth: null,
            tag: 'el-input-number',
            tagIcon: 'number',
            defaultValue: undefined,
            span: 24,
            layout: 'colFormItem',
            required: true,
            regList: [],
            document: 'https://element.eleme.cn/#/zh-CN/component/input-number'
        },
        placeholder: '',
        min: undefined,
        max: undefined,
        step: 1,
        'step-strictly': false,
        precision: undefined,
        'controls-position': '',
        disabled: false
    },
    {
        __config__: {
            label: '编辑器',
            showLabel: true,
            changeTag: true,
            labelWidth: null,
            tag: 'tinymce',
            tagIcon: 'rich-text',
            defaultValue: null,
            span: 24,
            layout: 'colFormItem',
            required: true,
            regList: [],
            document: 'http://tinymce.ax-z.cn'
        },
        placeholder: '请输入',
        height: 300, // 编辑器高度
        branding: false // 隐藏右下角品牌烙印
    }
]
