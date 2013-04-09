package com.shine.framework.Olap4J;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;

import org.olap4j.Axis;
import org.olap4j.OlapConnection;
import org.olap4j.layout.RectangularCellSetFormatter;
import org.olap4j.mdx.IdentifierNode;
import org.olap4j.metadata.Cube;
import org.olap4j.metadata.Member;
import org.olap4j.query.Query;
import org.olap4j.query.QueryDimension;
import org.olap4j.query.Selection;

public class QueryModelDemo {

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

		// Get a cube object.
		Cube salesCube = olapConnection.getOlapSchema().getCubes().get("Sales");

		// Build a query object.
		Query myQuery = new Query("myQuery", salesCube);

		// Lookup some dimensions
		QueryDimension productDim = myQuery.getDimension("Product");
		QueryDimension storeDim = myQuery.getDimension("Store");
		QueryDimension timeDim = myQuery.getDimension("Time");

		// Place dimensions on some axis
		myQuery.getAxis(Axis.COLUMNS).addDimension(productDim);
		myQuery.getAxis(Axis.ROWS).addDimension(storeDim);
		myQuery.getAxis(Axis.FILTER).addDimension(timeDim);

		// Including a member by metadata
		Member year1997 = salesCube.lookupMember(IdentifierNode.ofNames("Time",
				"1997").getSegmentList());
		timeDim.include(year1997);

		// Including a member by name parts
		productDim.include(Selection.Operator.CHILDREN, IdentifierNode.ofNames(
				"Product", "Drink", "Beverages").getSegmentList());

		// We can also exclude members
		productDim.exclude(IdentifierNode.ofNames("Product", "Drink",
				"Beverages", "Carbonated Beverages").getSegmentList());

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
