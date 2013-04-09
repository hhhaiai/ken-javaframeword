package com.shine.framework.Olap4J;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;

import org.olap4j.CellSet;
import org.olap4j.OlapConnection;
import org.olap4j.layout.RectangularCellSetFormatter;

public class QueryDemo {

	public static void main(String[] args) throws Exception {

		final String query = "SELECT { Except( {[Product].[All Products].[Drink].[Beverages].Children}, {[Product].[All Products].[Drink].[Beverages].[Carbonated Beverages]} ) } ON COLUMNS, { [Store].[All Stores].[USA].Children } ON ROWS FROM [Sales] WHERE ([Time].[1997])";

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

		// Prepare a statement.
		final CellSet cellSet = olapConnection.createStatement() // Prepare a
																	// statement
				.executeOlapQuery(query); // Execute some query

		// We use the utility formatter.
		RectangularCellSetFormatter formatter = new RectangularCellSetFormatter(
				false);

		// Print out.
		PrintWriter writer = new PrintWriter(System.out);
		formatter.format(cellSet, writer);
		writer.flush();
	}
}
