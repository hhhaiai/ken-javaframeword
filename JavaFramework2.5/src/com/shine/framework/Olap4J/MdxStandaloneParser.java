package com.shine.framework.Olap4J;

import org.mdx4j.Mdx4jParserFactory;
import org.olap4j.mdx.SelectNode;
import org.olap4j.mdx.parser.MdxParser;

public class MdxStandaloneParser {

	public static void main(String[] args) throws Exception {

		// Our query we want to parse.
		final String myQuery = "SELECT {[Product].[All Products].[Drink].[Beverages].Children} ON COLUMNS FROM [Sales] WHERE ([Time].[1997])";

		// Instantiate a parser
		final MdxParser parser = Mdx4jParserFactory.createMdxParser();

		// Parse into an object model
		final SelectNode parsedObject = parser.parseSelect(myQuery);

		// Print out what was parsed, just for kicks.
		System.out.print(parsedObject.toString());
	}
}
