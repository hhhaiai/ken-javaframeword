package com.shine.framework.HbaseUtil.Example;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.HColumnDescriptor;
import org.apache.hadoop.hbase.HTableDescriptor;
import org.apache.hadoop.hbase.KeyValue;
import org.apache.hadoop.hbase.MasterNotRunningException;
import org.apache.hadoop.hbase.ZooKeeperConnectionException;
import org.apache.hadoop.hbase.client.Delete;
import org.apache.hadoop.hbase.client.Get;
import org.apache.hadoop.hbase.client.HBaseAdmin;
import org.apache.hadoop.hbase.client.HTable;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Result;
import org.apache.hadoop.hbase.client.ResultScanner;
import org.apache.hadoop.hbase.client.Scan;
import org.apache.hadoop.hbase.util.Bytes;

/**
 * Hbase简单操作类
 * 
 * @author mark
 * @version 2013-01-15
 * */
public class HbaseClient {

	private static Configuration conf = null;

	static {
		// 加载配置 会从classpath下面找core-default.xml, core-site.xml,
		// hbase-default.xml,
		// hbase-site.xml，如果找不到就去加载hbase×.jar下面的hbase-default.xml
		conf = HBaseConfiguration.create();

	}

	/**
	 * create table
	 * 
	 * @param args
	 */
	public static void createTable(String tablename, String[] cfs)
			throws IOException {
		System.out.println(conf);
		HBaseAdmin admin = new HBaseAdmin(conf);
		if (admin.tableExists(tablename)) {
			System.out.println("table has existed!");
		} else {
			HTableDescriptor tableDesc = new HTableDescriptor(tablename);
			for (int i = 0; i < cfs.length; i++) {
				tableDesc.addFamily(new HColumnDescriptor(cfs[i]));
			}
			admin.createTable(tableDesc);
			System.out.println("create table successfully!");
		}
	}

	public void deleteTable(String tablename) throws IOException {
		try {
			HBaseAdmin admin = new HBaseAdmin(conf);
			admin.disableTable(tablename);
			admin.deleteTable(tablename);
			System.out.println("table delete successfully！");
		} catch (MasterNotRunningException e) {
			e.printStackTrace();
		} catch (ZooKeeperConnectionException e) {
			e.printStackTrace();
		}
	}

	public void writeRow(String tablename, String[] cfs) {
		// hbase shell put语法为： put 't1', 'r1', 'c1', 'value', ts1
		try {
			HTable table = new HTable(conf, tablename);
			Put put = new Put(Bytes.toBytes("rows1"));
			for (int j = 0; j < cfs.length; j++) {
				put.add(Bytes.toBytes(cfs[j]),
						Bytes.toBytes(String.valueOf(1)), Bytes
								.toBytes("value_1"));
				table.put(put);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void deleteRow(String tablename, String rowkey) throws IOException {
		HTable table = new HTable(conf, tablename);
		List list = new ArrayList();
		Delete d1 = new Delete(rowkey.getBytes());
		list.add(d1);
		table.delete(list);
		System.out.println("delete successfully！");
	}

	public static void selectRow(String tablename, String rowKey)
			throws IOException {
		System.out.println(rowKey + " is selected!");
		HTable table = new HTable(conf, tablename);
		Get g = new Get(rowKey.getBytes());
		Result rs = table.get(g);
		for (KeyValue kv : rs.raw()) {
			System.out.print(new String(kv.getRow()) + "  ");
			System.out.print(new String(kv.getFamily()) + ":");
			System.out.print(new String(kv.getQualifier()) + "  ");
			System.out.print(kv.getTimestamp() + "  ");
			System.out.println(new String(kv.getValue()));
		}
	}

	public void limitRow(String tableName, String startRowkey, String endRowkey)
			throws IOException {
		System.out.println("start rowkey is " + startRowkey);
		System.out.println("end rowkey is " + endRowkey);
		HTable table = new HTable(conf, tableName);
		try {
			Scan s = new Scan(startRowkey.getBytes(), startRowkey.getBytes());
			ResultScanner rs = table.getScanner(s);
			for (Result r : rs) {
				KeyValue[] kv = r.raw();
				for (int i = 0; i < kv.length; i++) {
					System.out.print(new String(kv[i].getRow()) + "  ");
					System.out.print(new String(kv[i].getFamily()) + ":");
					System.out.print(new String(kv[i].getQualifier()) + "  ");
					System.out.print(kv[i].getTimestamp() + "  ");
					System.out.println(new String(kv[i].getValue()));
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void scaner(String tablename) {
		try {
			HTable table = new HTable(conf, tablename);
			Scan s = new Scan();
			ResultScanner rs = table.getScanner(s);
			for (Result r : rs) {
				KeyValue[] kv = r.raw();
				for (int i = 0; i < kv.length; i++) {
					System.out.print(new String(kv[i].getRow()) + "  ");
					System.out.print(new String(kv[i].getFamily()) + ":");
					System.out.print(new String(kv[i].getQualifier()) + "  ");
					System.out.print(kv[i].getTimestamp() + "  ");
					System.out.println(new String(kv[i].getValue()));
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) {

		try {
			HbaseClient client = new HbaseClient();
			// 建表
			createTable("dsinfo", new String[] { "publish", "mark" });
			// 增加数据
			String[] str = { "publish", "mark" };
			client.writeRow("dsinfo", str);
			// 查看表
			client.scaner("dsinfo");
			// client.deleteRow("dsinfo", "rows1");
			client.selectRow("dsinfo", "rows1");
			// limit
			client.limitRow("dsinfo", "rows1", "rows2");
			// 删除表
			// client.deleteTable("dsinfo");

		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}