package com.shine.framework.Olap4J;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;

import org.olap4j.OlapConnection;

public class XmlaDriverConnectDemo {

	public static void main(String[] args) throws Exception {

		// Load the driver
		Class.forName("org.olap4j.driver.xmla.XmlaOlap4jDriver");

		// Connect
		final Connection connection = DriverManager
				.getConnection(

				// This is the SQL Server service end point.
						"jdbc:xmla:Server=http://localhost:81/mondrian/xmla"

						// Tells the XMLA driver to use a SOAP request cache
						// layer.
								// We will use an in-memory static cache.
								+ ";Cache=org.olap4j.driver.xmla.cache.XmlaOlap4jNamedMemoryCache"

								// Sets the cache name to use. This allows
								// cross-connection
								// cache sharing. Don't give the driver a cache
								// name and it
								// disables sharing.
								+ ";Cache.Name=MyNiftyConnection"

								// Some cache performance tweaks.
								// Look at the javadoc for details.
								+ ";Cache.Mode=LFU;Cache.Timeout=600;Cache.Size=100",

						// XMLA is over HTTP, so BASIC authentication is used.
						null, null);

		// We are dealing with an olap connection. we must unwrap it.
		final OlapConnection olapConnection = connection
				.unwrap(OlapConnection.class);

		// Check if it's all groovy
		ResultSet databases = olapConnection.getMetaData().getDatabases();
		databases.first();
		System.out.println(olapConnection.getMetaData().getDriverName()
				+ " -> " + databases.getString(1));

		// Done
		connection.close();
	}

}