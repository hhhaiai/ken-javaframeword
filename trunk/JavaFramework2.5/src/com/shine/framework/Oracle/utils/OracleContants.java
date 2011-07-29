package com.shine.framework.Oracle.utils;

public class OracleContants {
	//oracle进程监控
	public static final String ORACLE_PROCESS = "select p.spid ThreadID,b.name BackgroundProcess,s.username UserName,"
			+ "s.status STATUS from v$process p, v$bgprocess b, v$session s where s.paddr = p.addr and b.paddr(+) = p.addr";

	//oracle活跃用户监控
	public static final String ORACLE_ACTIVE_USERS = "SELECT COUNT(0) num FROM v$session WHERE"
			+ " (username IS NOT NULL) AND (osuser != 'SYSTEM') AND (TYPE != 'BACKGROUND')";

	//oracle缓存击中
	public static final String ORACLE_BUFFER_HIT = "select trunc((1-(sum(decode(name,'physical reads',value,0))"
			+ "/(sum(decode(name,'db clock gets',value,0)) + (sum(decode(name,'consistent gets',value,0)))))) * 100) from v$sysstat";

	//oracle数据大小
	public static final String ORACLE_DB_SIZE = "SELECT sum(bytes) total_bytes FROM dba_data_files";

	//oracle硬盘击中
	public static final String ORACLE_DICT_HIT = "select trunc((1-(sum(getmisses)/sum(gets)))*100) from v$rowcache";

	
	public static final String ORACLE_AVG_EXECUTIONS = "select CEIL(SUM(executions)/COUNT(0)) avg_execs from v$sqlarea";

	public static final String ORACLE_LIB_HIT = "select round(sum(pinhits)/sum(pins) * 100) from v$librarycache";

	public static final String ORACLE_TABLE_SPACE = "select a.tablespace_name,round((a.bytes-b.bytes)/1024) "
			+ "as usedsize,100-round(b.bytes/a.bytes*100) as usedpercent from sys.dba_data_files a,"
			+ "sys.sm$ts_free b where a.tablespace_name=b.tablespace_name";

	public static final String ORACLE_LOCK = "select count(*) from v$lock where block=1";

	public static final String ORACLE_INSTANCE = "select * from v$instance";

	public static final String ORACLE_DATABASE = "select * from v$database";

	public static final String ORACLE_FILESTAT = "select SUM(f.phyrds),SUM(f.phywrts) FROM v$filestat f";

	public static final String ORACLE_PARAMETER = "select round(value/1024) from v$parameter where NAME like 'db_block_size'";

	public static final String ORACLE_SQLAREA = "select CEIL(SUM(executions)/COUNT(executions)/100) avg_exe FROM v$sqlarea";

	public static final String ORACLE_SGA = "select sga.dbbuffer_size, sgastat.fixed_size, sgastat.log_size, sga.variable_size, sgastat.dict_cache_size,"
			+ "sgastat.lib_cache_size, sgastat.sql_area_size FROM (SELECT  SUM(DECODE(UPPER(name), 'DATABASE BUFFERS', value,0)) "
			+ "dbbuffer_size, SUM(DECODE(UPPER(name), 'VARIABLE SIZE', value, 0)) variable_size FROM v$sga ) sga, (select "
			+ "SUM(DECODE(UPPER(name), 'FIXED_SGA', bytes, 0)) fixed_size, SUM(DECODE(UPPER(name), 'LOG_BUFFER', bytes, 0)) log_size,"
			+ "SUM(DECODE(UPPER(name), 'DICTIONARY CACHE', bytes, 0)) dict_cache_size, SUM(DECODE(UPPER(name),'LIBRARY CACHE',bytes,0))"
			+ " lib_cache_size, SUM(DECODE(UPPER(name),'SQL AREA',bytes,0)) sql_area_size FROM v$sgastat) sgastat";

	public static final String ORACLE_SGASTAT = "select sum(bytes) fm from v$sgastat where name='free memory'";

	public static final String ORACLE_SQL_DISK = "select * from (select sql_text,sorts,sum(disk_reads) as diskreads,"
			+ "sum(EXECUTIONS) as exetimes,sum(elapsed_time) et from v$sqlarea group by sql_text,sorts"
			+ " order by diskreads desc )where rownum<11";

	public static final String ORACLE_SQL_BUFFER = "select * from (select sql_text,sorts,sum(buffer_gets) as buffers,"
			+ "sum(EXECUTIONS) as exetimes,sum(elapsed_time) et from v$sqlarea group by sql_text,sorts"
			+ " order by buffers desc )where rownum<11";

	public static final String ORACLE_TABLESPACE1 = "select dbf.tablespace_name as tablespace_name,dbf.totalspace as total,dbf.totalblocks as blocks,dfs.freespace as usedsize,dfs.freeblocks,(dfs.freespace / dbf.totalspace) * 100 as usedpercent from (select t.tablespace_name,sum(t.bytes) / 1024 / 1024 totalspace,sum(t.blocks) totalblocks from dba_data_files t group by t.tablespace_name) dbf,(select tt.tablespace_name,sum(tt.bytes) / 1024 /1024 freespace,sum(tt.blocks) freeblocks from dba_free_space tt group by tt.tablespace_name) dfs where trim(dbf.tablespace_name) =trim(dfs.tablespace_name)";

	public static final String ORACLE_TABLESPACE2 = "select tablespace_name,count(file_name) total from dba_data_files group by tablespace_name";

	public static final String ORACLE_SESSION = "select s.username,s.status status,s.terminal,s.machine,s.type sessiontype,"
			+ "to_char(s.LOGON_TIME,'yyyy-mm-dd hh24:mi') logontime,substr(s.program,1,15) program from v$session s,"
			+ " v$process p,v$transaction t,v$rollstat r,v$rollname n where s.paddr=p.addr and s.taddr=t.addr(+) "
			+ "and t.xidusn=r.usn(+) and r.usn = n.usn(+) and s.type='USER' and s.username is not null order by logon_time desc";

	public static final String ORACLE_SQL_AND_PROCESS = "select p.pid,p.username,p.program,s1.machine,s2.sql_text,s2.sql_id"
			+ " from v$process p,v$session s1,v$sqltext s2 where s1.paddr=p.addr and s1.sql_address=s2.address order by pid";

	public static final String ORACLE_DBA_USERS = "select * from dba_users";

	public static final String ORACLE_DBA_ROLE_PRIVS = "select * from dba_role_privs";

	public static final String ORACLE_DBA_SYS_PRIVS = "select * from dba_sys_privs";
}
