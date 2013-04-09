package com.shine.framework.Olap4J;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Arrays;

import org.olap4j.AllocationPolicy;
import org.olap4j.CellSet;
import org.olap4j.OlapConnection;
import org.olap4j.Scenario;
import org.olap4j.layout.RectangularCellSetFormatter;

public class ScenarioDemo {

	public static void main(String[] args) throws Exception {

		RectangularCellSetFormatter formatter = new RectangularCellSetFormatter(
				false);
		PrintWriter writer = new PrintWriter(System.out);

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

		// Create a scenario
		Scenario scenario = olapConnection.createScenario();

		// Activate it.
		olapConnection.setScenario(scenario);

		// Build a query against that scenario
		final String query = "SELECT { [Product].[All Products].[Drink].[Beverages].Children } ON COLUMNS, "
				+ "{ [Store].[All Stores].[USA], [Store].[All Stores].[USA].Children } ON ROWS FROM [Sales] WHERE ([Time].[1997], "
				+ "[Scenario].[" + scenario.getId() + "])";

		// Prepare a statement and execute
		final CellSet cellSetBefore = olapConnection
				.prepareOlapStatement(query).executeQuery();

		// Check the results
		System.out
				.println("/********************* BEFORE ***********************/");
		formatter.format(cellSetBefore, writer);
		writer.flush();
		System.out
				.println("/********************* BEFORE ***********************/");
		System.out.println(" ");
		System.out.println(" ");
		System.out.println(" ");
		System.out.println(" ");

		// Change a cell
		cellSetBefore.getCell(Arrays.asList(3, 0)).setValue(1000000,
				AllocationPolicy.EQUAL_ALLOCATION);

		// Prepare a statement and execute
		final CellSet cellSetAfter = olapConnection.prepareOlapStatement(query)
				.executeQuery();

		// Check the results
		System.out
				.println("/********************* AFTER ******************************************/");
		formatter.format(cellSetAfter, writer);
		writer.flush();
		System.out
				.println("/********************* AFTER ******************************************/");
	}
}
