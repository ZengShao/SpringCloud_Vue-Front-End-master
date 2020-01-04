/**
 * 对后台请求的地址的封装，URL格式如下：
 * 模块名_实体名_操作
 */
export default {

	'SYS_USER_DOLOGIN': 'http://desktop-a48k0if:7601/login', //登陆
	'SYS_TREENODE_LISTALL': 'http://desktop-a48k0if:7601/Permissisons/tree',	//菜单管理
	'SYS_MENU': 'http://desktop-a48k0if:7601/Permissisons/menu',	//合同管理
	'SYS_USER_MANAGEMENT': 'http://desktop-a48k0if:7601/Permissisons/List',	//合同管理
	'SYS_MODIFY_USER_STATUS': 'http://desktop-a48k0if:7601/Permissisons/state',	//修改用户状态
    'SYS_LISTMENU': 'http://desktop-a48k0if:7601/Permissisons/listmenu',	//产品列表
    'SYS_UPDATA_PERMISSISON': 'http://desktop-a48k0if:7601/Permissisons/Updata',	//修改产品信息
    'SYS_SELECTROLE':'http://desktop-a48k0if:7601/Permissisons/SelectRole',//
	'SYS_PRODUCTCONTROLLER_Del': '/ProductController/DelProduct', //删除产品
	'SYS_PRODUCTCONTROLLER_addProduct': '/ProductController/addProduct', //增加产品

	//获得请求的完整地址，用于mockjs测试时使用
	'getFullPath': k => {
		return this[k];
	}
}
