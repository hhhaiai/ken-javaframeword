package com.shine.framework.Olap4J;

import java.sql.Connection;
import java.sql.DriverManager;

import org.olap4j.OlapConnection;
import org.olap4j.mdx.parser.MdxParser;

public class MdxValidatorDemo {

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

		// Our valid query we want to parse.
		final String myValidQuery = "SELECT "
				+ "{[Drink].[Beverages].Children} " + "ON COLUMNS "
				+ "FROM [Sales] " + "WHERE ([Time].[1997])";

		// Our other query we want to parse.
		final String myNotSoValidQuery = "SELECT "
				+ "{[Drink].[Beverages].Children} " + "ON COLUMNS "
				+ "FROM [Sales] " + "WHERE ([Time].[Cake time!])";

		// Get the parser object from the connection.
		final MdxParser parser = olapConnection.getParserFactory()
				.createMdxParser(olapConnection);

		// Validate a valid query
		try {

			olapConnection.getParserFactory()
					.createMdxValidator(olapConnection).validateSelect(
							parser.parseSelect(myValidQuery));

			System.out.println("Query 1 -> Valid");

		} catch (Exception e) {
			System.out.println("Query 1 -> Error");
		}

		// Validate an invalid query
		try {

			olapConnection.getParserFactory()
					.createMdxValidator(olapConnection).validateSelect(
							parser.parseSelect(myNotSoValidQuery));

			System.out.println("Query 2 -> Valid");

		} catch (Exception e) {
			System.out.println("Query 2 -> "
					+ MdxValidatorDemo.getRootCause(e).getMessage());
		}

	}

	static Throwable getRootCause(Throwable e) {
		while (e.getCause() != null && e != e.getCause()) {
			e = e.getCause();
		}
		return e;
	}
}
