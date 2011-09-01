/* commonResAll.js
commonList all resource: list xp + cmd + pagination + pageCalendarSet;
*/
require.provide("sv.common.commonList.commonResAll");

require("sv.common.commonList.cmd");//commands to oprate data table list
require("sv.common.commonList.pagination");//commonList(sv_content_table) Pagination
require("sv.common.commonList.xp");//the interface of add experience to commonList
require("sv.common.commonList.xp_paintRows");//parity paint talbe rows color
require("sv.common.commonList.xp_autoWidth");//auto width xp for commonList;
require("sv.common.commonList.xp_sort");//sortable xp for commonList;
require("sv.common.pageCalendarSet");//calendar for commonList's date select 