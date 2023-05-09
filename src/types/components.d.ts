
// 菜单属性
declare interface IComponent {
    domId?:any // 组件ID
    type: string, // 类型
    config: IComponentsConfig
    slot?: any,
    style?: any
    readonly?: boolean // 是否只读
    disabled?: boolean // 是否隐藏

    [key: string]: any;
}

declare interface IComponentsConfig {
    label: string, // 标题
    labelWidth?: number | null, // 标题宽度
    showLabel?: boolean,  // 是否显示标题
    changeTag?: boolean, // 是否可以改变标签
    tagIcon?: string, // 图标
    defaultValue?: any, // 默认值
    required?: boolean, // 是否必填
    span?: number,  // 占比
    dataPath?: string, // 数据路径
    dataType?: string, // 数据路径
    dataConsumer?: string,
    optionType?: string, // 选项类型
    regList?: string[]  //   // 正则校验规则

    [key: string]: any;
}


declare interface ILeftComponents {
    title: string,
    icon:string
    list: IComponent[]
}
