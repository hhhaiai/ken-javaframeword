package com.shine.framework.Olap4J;

import java.sql.Connection;
import java.sql.DriverManager;

import org.olap4j.OlapConnection;
import org.olap4j.mdx.SelectNode;
import org.olap4j.mdx.parser.MdxParser;

public class MdxParserDemo {

	public static void main(String[] args) throws Exception {

		// Our query we want to parse.
		final String myQuery = "SELECT {[Product].[All Products].[Drink].[Beverages].Children} ON COLUMNS FROM [Sales] WHERE ([Time].[1997])";

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

		// Instantiate a parser
		final MdxParser parser = olapConnection.getParserFactory()
				.createMdxParser(olapConnection);

		// Parse into an object model
		final SelectNode parsedObject = parser.parseSelect(myQuery);

		// Print out what was parsed, just for kicks.
		System.out.print(parsedObject.toString());
	}
}
