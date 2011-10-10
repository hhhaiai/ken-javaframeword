package com.shine.featuresView.util
{
	import com.shine.featuresView.view.Line.FeaturesLine;
	import com.shine.featuresView.view.node.FeatrueBusinessNodeContainer;
	import com.shine.featuresView.view.node.FeatrueNodeContainer;
	import com.shine.framework.core.model.BaseXmlModel;
	import com.shine.framework.core.util.XMLArrayCollection;
	import com.shine.topo.util.TopoLinesArrayCollection;
	import com.shine.topo.util.TopoNodeArrayCollection;

	public class NodeUtil
	{
		public function NodeUtil()
		{
		}
		
		public static function getAllNode(value:XMLArrayCollection):TopoNodeArrayCollection{
			var topoNodeArrayCollection:TopoNodeArrayCollection=new TopoNodeArrayCollection;
			for each(var baseXmlModel:BaseXmlModel in value){
				if(baseXmlModel.getString("type")!="MSB"){
					var featuresNodeContaine:FeatrueNodeContainer=new FeatrueNodeContainer;
					featuresNodeContaine.initNode(baseXmlModel);
					topoNodeArrayCollection.addItem(featuresNodeContaine);
				}else{
					var featuresBusinessContainer:FeatrueBusinessNodeContainer=new FeatrueBusinessNodeContainer;
					featuresBusinessContainer.initBusinessNode(baseXmlModel);
					topoNodeArrayCollection.addItem(featuresBusinessContainer);
				}
			}
			return topoNodeArrayCollection;
		}
		
//		public static  function getAllBusinessNode(value:XMLArrayCollection):TopoNodeArrayCollection{
//			var topoNodeArrayCollection:TopoNodeArrayCollection=new TopoNodeArrayCollection;
//			for each(var baseXmlModel:BaseXmlModel in value){
//				if(baseXmlModel.getString("type")=="MSB"){
//					var featuresBusinessContainer:FeatrueBusinessNodeContainer=new FeatrueBusinessNodeContainer;
//					featuresBusinessContainer.initBusinessNode(baseXmlModel);
//					topoNodeArrayCollection.addItem(featuresBusinessContainer);
//				}
//			}
//			return topoNodeArrayCollection;
//		}
		
		public static function getAllLine(value:XMLArrayCollection,topoNodeArrayCollection:TopoNodeArrayCollection):TopoLinesArrayCollection{
			var topoLinesArrayCollection:TopoLinesArrayCollection=new TopoLinesArrayCollection;
			for each(var baseXmlModel:BaseXmlModel in value){
				var featureLine:FeaturesLine=new FeaturesLine;
				featureLine.initTopoLine(baseXmlModel,topoNodeArrayCollection.getNodeByAttribute("id",baseXmlModel.getString("start")),topoNodeArrayCollection.getNodeByAttribute("id",baseXmlModel.getString("end")));
				featureLine.initLabel(baseXmlModel.getString("message"));
				topoLinesArrayCollection.addItem(featureLine);
			}
			return topoLinesArrayCollection;
		}
	}
}