// 表单属性【右面板】

export const formConf = {
    formRef: 'elForm',
    formModel: 'formData',
    size: 'default',
    labelPosition: 'right',
    labelWidth: 100,
    formRules: 'rules',
    gutter: 15,
    disabled: false,
    span: 24,
    formBtns: true
}

// 输入型组件 【左面板】
export const inputComponents: IComponent[] = [
    {
        type: 'input',
        // 组件的自定义配置
        config: {
            label: '单行文本',
            labelWidth: null,
            showLabel: true,
            changeTag: true,
            tagIcon: 'fa fa-keyboard-o',
            defaultValue: '',
            required: true,
            span: 24,
            // 正则校验规则
            regList: []
        },
        // 组件的插槽属性
        slot: {
            prepend: '',
            append: ''
        },
        // 其余的为可直接写在组件标签上的属性
        placeholder: '请输入',
        style: {width: '100%'},
        clearable: true,
        'prefix-icon': '',
        'suffix-icon': '',
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false
    },
    {
        type: 'textarea',
        config: {
            label: '多行文本',
            labelWidth: null,
            showLabel: true,
            tagIcon: 'ele-Crop',
            required: true,
            span: 24,
            regList: [],
            changeTag: true,
        },

        placeholder: '请输入',
        autosize: {
            minRows: 4,
            maxRows: 4
        },
        style: {width: '100%'},
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false
    },
    {
        type: 'password',
        config: {
            label: '密码',
            showLabel: true,
            labelWidth: null,
            changeTag: true,
            tagIcon: 'ele-Lock',
            defaultValue: undefined,
            span: 24,
            required: true,
            regList: []
        },
        slot: {
            prepend: '',
            append: ''
        },
        placeholder: '请输入',
        'show-password': true,
        style: {width: '100%'},
        clearable: true,
        'prefix-icon': '',
        'suffix-icon': '',
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false
    },
    {
        type: 'count',
        config: {
            label: '计数器',
            showLabel: true,
            changeTag: true,
            labelWidth: null,
            tagIcon: 'fa fa-sort-numeric-desc',
            defaultValue: 0,
            span: 24,
            required: true,
            regList: [],
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
    // {
    //     type: 'edit',
    //     config: {
    //         label: '编辑器',
    //         showLabel: true,
    //         changeTag: true,
    //         labelWidth: null,
    //         tagIcon: 'rich-text',
    //         span: 24,
    //         required: true,
    //         regList: [],
    //     },
    //     placeholder: '请输入',
    //     height: 300, // 编辑器高度
    //     branding: false // 隐藏右下角品牌烙印
    // }
]


// 选择型组件 【左面板】
export const selectComponents: IComponent[] = [
    {
        type: 'select',
        config: {
            label: '下拉选择',
            showLabel: true,
            labelWidth: null,
            tagIcon: 'select',
            span: 24,
            required: true,
            regList: [],
            changeTag: true,
        },
        slot: {
            options: [{
                label: '选项一',
                value: 1
            }, {
                label: '选项二',
                value: 2
            }]
        },
        placeholder: '请选择',
        style: {width: '100%'},
        clearable: true,
        disabled: false,
        filterable: false,
        multiple: false
    },
    {
        type: 'cascader',
        config: {
            label: '级联选择',

            dataConsumer: 'options',
            showLabel: true,
            labelWidth: null,
            tagIcon: 'cascader',
            defaultValue: [],
            dataType: 'dynamic',
            span: 24,
            required: true,
            regList: [],
            changeTag: true,
        },
        options: [{
            id: 1,
            value: 1,
            label: '选项1',
            children: [{
                id: 2,
                value: 2,
                label: '选项1-1'
            }]
        }],
        placeholder: '请选择',
        style: {width: '100%'},
        props: {
            props: {
                multiple: false,
                label: 'label',
                value: 'value',
                children: 'children'
            }
        },
        'show-all-levels': true,
        disabled: false,
        clearable: true,
        filterable: false,
        separator: '/'
    },
    {
        type: 'radio',
        config: {
            label: '单选框组',
            labelWidth: null,
            showLabel: true,
            tagIcon: 'radio',
            changeTag: true,
            defaultValue: undefined,
            span: 24,
            optionType: 'default',
            regList: [],
            required: true,
            border: false,
        },
        slot: {
            options: [{
                label: '选项一',
                value: 1
            }, {
                label: '选项二',
                value: 2
            }]
        },
        style: {},
        size: 'medium',
        disabled: false
    },
    {
        type: 'checkbox',
        config: {
            label: '多选框组',
            tagIcon: 'checkbox',
            defaultValue: [],
            span: 24,
            showLabel: true,
            labelWidth: null,
            optionType: 'default',
            required: true,
            regList: [],
            changeTag: true,
            border: false,
        },
        slot: {
            options: [{
                label: '选项一',
                value: 1
            }, {
                label: '选项二',
                value: 2
            }]
        },
        style: {},
        size: 'medium',
        min: null,
        max: null,
        disabled: false
    },
    {
        type: 'switch',
        config: {
            label: '开关',
            tagIcon: 'switch',
            defaultValue: false,
            span: 24,
            showLabel: true,
            labelWidth: null,
            required: true,
            regList: [],
            changeTag: true,
        },
        style: {},
        disabled: false,
        'active-text': '',
        'inactive-text': '',
        'active-color': null,
        'inactive-color': null,
        'active-value': true,
        'inactive-value': false
    },
    {
        type: 'slider',
        config: {
            label: '滑块',
            tagIcon: 'slider',
            defaultValue: null,
            span: 24,
            showLabel: true,
            labelWidth: null,
            required: true,
            regList: [],
            changeTag: true,
        },
        disabled: false,
        min: 0,
        max: 100,
        step: 1,
        'show-stops': false,
        range: false
    },
    {
        type: 'time',
        config: {
            label: '时间选择',
            tagIcon: 'time',
            defaultValue: null,
            span: 24,
            showLabel: true,
            labelWidth: null,
            required: true,
            regList: [],
            changeTag: true,
        },
        placeholder: '请选择',
        style: {width: '100%'},
        disabled: false,
        clearable: true,
        'picker-options': {
            selectableRange: '00:00:00-23:59:59'
        },
        format: 'HH:mm:ss',
        'value-format': 'HH:mm:ss'
    },
    {
        type: 'timeRange',
        config: {
            label: '时间范围',
            tagIcon: 'time-range',
            span: 24,
            showLabel: true,
            labelWidth: null,
            defaultValue: null,
            required: true,
            regList: [],
            changeTag: true,
        },
        style: {width: '100%'},
        disabled: false,
        clearable: true,
        'is-range': true,
        'range-separator': '至',
        'start-placeholder': '开始时间',
        'end-placeholder': '结束时间',
        format: 'HH:mm:ss',
        'value-format': 'HH:mm:ss'
    },
    {
        type: 'date',
        config: {
            label: '日期选择',
            tagIcon: 'date',
            defaultValue: null,
            showLabel: true,
            labelWidth: null,
            span: 24,
            required: true,
            regList: [],
            changeTag: true,
            type: 'date',
        },
        placeholder: '请选择',
        style: {width: '100%'},
        disabled: false,
        clearable: true,
        format: 'yyyy-MM-dd',
        'value-format': 'yyyy-MM-dd',
        readonly: false
    },
    {
        type: 'dateRange',
        config: {
            label: '日期范围',
            tagIcon: 'date-range',
            defaultValue: null,
            span: 24,
            showLabel: true,
            labelWidth: null,
            required: true,
            regList: [],
            changeTag: true,
            type: 'daterange',
        },
        style: {width: '100%'},
        'range-separator': '至',
        'start-placeholder': '开始日期',
        'end-placeholder': '结束日期',
        disabled: false,
        clearable: true,
        format: 'yyyy-MM-dd',
        'value-format': 'yyyy-MM-dd',
        readonly: false
    },
    {
        type: 'rate',
        config: {
            label: '评分',
            tagIcon: 'rate',
            defaultValue: 0,
            span: 24,
            showLabel: true,
            labelWidth: null,
            required: true,
            regList: [],
            changeTag: true,
        },
        style: {},
        max: 5,
        'allow-half': false,
        'show-text': false,
        'show-score': false,
        disabled: false
    },
    {
        type: 'color',
        config: {
            label: '颜色选择',
            tagIcon: 'color',
            span: 24,
            defaultValue: null,
            showLabel: true,
            labelWidth: null,
            required: true,
            regList: [],
            changeTag: true,
        },
        'show-alpha': false,
        'color-format': '',
        disabled: false,
        size: 'medium'
    },
    {
        type: 'upload',
        config: {
            label: '上传',
            tagIcon: 'upload',
            defaultValue: null,
            showLabel: true,
            labelWidth: null,
            required: true,
            span: 24,
            showTip: false,
            buttonText: '点击上传',
            regList: [],
            changeTag: true,
            fileSize: 2,
            sizeUnit: 'MB',
        },
        slot: {
            'list-type': true
        },
        action: 'https://jsonplaceholder.typicode.com/posts/',
        disabled: false,
        accept: '',
        name: 'file',
        'auto-upload': true,
        'list-type': 'text',
        multiple: false
    }
]

