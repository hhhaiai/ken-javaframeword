package com.shine.project.SunshineCms;

import com.shine.Plugin.ProjectPlugin;
import com.shine.Plugin.util.PluginTypes;
import com.shine.platform.core.model.BaseProject;

public class SunshineCmsProject extends BaseProject {

	public SunshineCmsProject() {
		this.initPlugin("SunshineCms", "1.0", PluginTypes.CLASSPATH, "",
				"SunshineCms");
	}

	@Override
	protected void pluginStart() {
		

	}

}
