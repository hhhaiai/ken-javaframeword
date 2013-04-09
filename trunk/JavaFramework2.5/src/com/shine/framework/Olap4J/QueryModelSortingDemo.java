package com.shine.framework.Olap4J;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;

import org.olap4j.Axis;
import org.olap4j.OlapConnection;
import org.olap4j.layout.RectangularCellSetFormatter;
import org.olap4j.mdx.IdentifierNode;
import org.olap4j.metadata.Cube;
import org.olap4j.query.Query;
import org.olap4j.query.Selection;
import org.olap4j.query.SortOrder;

public class QueryModelSortingDemo {

	public static void main(String[] args) throws Exception {

		// Load the driver
		Class.forName("mondrian.olap4j.MondrianOlap4jDriver");

		// Connect
		final Connection connection = DriverManager
				.getConnection("jdbc:mondrian:" // Driver ident
						+ "JdbcDrivers=com.mysql.jdbc.Driver;" // Relational
																// driver
						// +
						// "Jdbc=jdbc:mysql://localhost/foodmart?user=foodmart&password=foodmart;"
						// // Relational DB
						+ "Jdbc=jdbc:hsqldb:file:foodmart/foodmart;" // Relational
																		// DB
						+ "Catalog=file:foodmart/FoodMart.xml;"); // Catalog

		// We are dealing with an olap connection. we must unwrap it.
		final OlapConnection olapConnection = connection
				.unwrap(OlapConnection.class);

		// Get a cube object.
		Cube salesCube = olapConnection.getOlapSchema().getCubes().get("Sales");

		// Build a query object.
		Query myQuery = new Query("myQuery", salesCube);

		// Place some dimensions on the axis
		myQuery.getAxis(Axis.ROWS)
				.addDimension(myQuery.getDimension("Product"));

		myQuery.getAxis(Axis.ROWS).addDimension(
				myQuery.getDimension("Store Type"));

		myQuery.getAxis(Axis.COLUMNS)
				.addDimension(myQuery.getDimension("Time"));

		// Include and exclude members
		myQuery.getDimension("Store Type").include(
				Selection.Operator.CHILDREN,
				IdentifierNode.ofNames("Store Type", "All Store Types")
						.getSegmentList());

		myQuery.getDimension("Product").include(
				IdentifierNode.ofNames("Product", "Food", "Seafood")
						.getSegmentList());

		myQuery.getDimension("Product").include(
				IdentifierNode.ofNames("Product", "Food", "Meat")
						.getSegmentList());

		// SORT!!!
		myQuery.getAxis(Axis.ROWS).sort(SortOrder.BDESC);

		// Validate this query
		myQuery.validate();

		// Print!
		System.out
				.println("/********************* QUERY ***********************/");

		System.out.println(myQuery.getSelect().toString());

		System.out
				.println("/********************* QUERY ***********************/");
		System.out.println(" ");
		System.out.println(" ");
		System.out.println(" ");
		System.out.println(" ");

		System.out
				.println("/********************* RESULTS ***********************/");

		RectangularCellSetFormatter formatter = new RectangularCellSetFormatter(
				false);

		PrintWriter writer = new PrintWriter(System.out);

		formatter.format(myQuery.execute(), writer);

		writer.flush();
		System.out
				.println("/********************* RESULTS ***********************/");
	}
}
