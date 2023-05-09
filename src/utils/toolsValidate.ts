
/**
 * 密码强度
 * @param val 当前值字符串
 * @description 弱：纯数字，纯字母，纯特殊字符
 * @description 中：字母+数字，字母+特殊字符，数字+特殊字符
 * @description 强：字母+数字+特殊字符
 * @returns 返回处理：1、2、3
 */
export function verifyPasswordStrength(val: string) {
	let v = 1;
	// 弱：纯数字，纯字母，纯特殊字符
	if (/^(?:\d+|[a-zA-Z]+|[!@#$%^&\.*]+){6,16}$/.test(val)) v = 1;
	// 中：字母+数字，字母+特殊字符，数字+特殊字符
	if (/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&\.*]+$)[a-zA-Z\d!@#$%^&\.*]{6,16}$/.test(val)) v = 2;
	// 强：字母+数字+特殊字符
	if (/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&\.*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&\.*]+$)(?![\d!@#$%^&\.*]+$)[a-zA-Z\d!@#$%^&\.*]{6,16}$/.test(val))
		v = 3;
	// 返回结果
	return v;
}

/**
 * 邮箱
 * @param val 当前值字符串
 * @returns 返回 true: 邮箱正确
 */
export function verifyEmail(val: string) {
	// false: 邮箱不正确
	if (
		!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
			val
		)
	)
		return false;
	// true: 邮箱正确
	else return true;
}

/**
 * 身份证
 * @param val 当前值字符串
 * @returns 返回 true: 身份证正确
 */
export function verifyIdCard(val: string) {
	// false: 身份证不正确
	if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(val)) return false;
	// true: 身份证正确
	else return true;
}

/**
 * url 处理
 * @param val 当前值字符串
 * @returns 返回 true: url 正确
 */
export function verifyUrl(val: string) {
	// false: url不正确
	if (
		!/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
			val
		)
	)
		return false;
	// true: url正确
	else return true;
}

