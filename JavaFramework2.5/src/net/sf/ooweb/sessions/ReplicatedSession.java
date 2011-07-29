/*
 * OOWeb
 *    
 * Copyright(c)2005, OOWeb developers (see the accompanying "AUTHORS" file)
 *
 * This software is licensed under the 
 * GNU LESSER GENERAL PUBLIC LICENSE, Version 2.1
 *    
 * For more information on distributing and using this program, please
 * see the accompanying "COPYING" file.
 */
package net.sf.ooweb.sessions;

/**
 * OOWeb Session that uses ReplicatedHashtable to replicate
 * sessions transparently among all OOWeb instances running on
 * a network.
 * 
 * @author Robin Rawson-Tetley
 * @since 0.5
 */
class ReplicatedSession extends Session {

	public ReplicatedSession(String name) {
        super(name);
		mapImpl = new ReplicatedHashtable(name);
	}
	
	public void dispose() {
		((ReplicatedHashtable) mapImpl).delete();
		super.dispose();
	}

}
