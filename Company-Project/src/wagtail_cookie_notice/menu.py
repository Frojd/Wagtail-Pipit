from wagtail.admin.menu import Menu


cookie_notice_menu = Menu(
    register_hook_name='register_cookie_notice_menu_item',
    construct_hook_name='construct_cookie_notice_menu'
)
