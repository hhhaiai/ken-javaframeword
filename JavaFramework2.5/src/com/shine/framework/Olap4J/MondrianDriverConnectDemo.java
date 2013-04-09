package com.shine.framework.Olap4J;

import java.sql.Connection;
import java.sql.DriverManager;

import org.olap4j.OlapConnection;

public class MondrianDriverConnectDemo {

	public static void main(String[] args) throws Exception {

		// Load the driver
		Class.forName("mondrian.olap4j.MondrianOlap4jDriver");

		// Connect
		final Connection connection = DriverManager
				.getConnection("jdbc:mondrian:" // Driver ident
						+ "Jdbc=jdbc:hsqldb:file:foodmart/foodmart;" // Relational
																		// DB
						+ "Catalog=file:foodmart/FoodMart.xml;"); // Catalog

		// We are dealing with an olap connection. we must unwrap it.
		final OlapConnection olapConnection = connection
				.unwrap(OlapConnection.class);

		// Check if it's all groovy
		System.out.println(olapConnection.getMetaData().getDriverName()
				+ " -> "
				+ olapConnection.getMetaData().getDatabaseProductName()
				+ " version "
				+ olapConnection.getMetaData().getDatabaseMajorVersion() + "."
				+ olapConnection.getMetaData().getDatabaseMinorVersion());

		// Done
		connection.close();
	}

}
